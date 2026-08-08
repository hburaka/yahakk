import { File, Paths } from 'expo-file-system';

import { db } from '@/core/db/client';
import { favorites, locations, zikirSessions } from '@/core/db/schema';
import { storage } from '@/core/store/storage';

/**
 * Yedekleme — dosyayla dışa/içe aktarma.
 *
 * Sunucumuz olmadığı için veri taşımanın yolu bu. Kullanıcı tüm
 * geçmişini tek bir JSON dosyası olarak alıp istediği yere koyabiliyor
 * (WhatsApp, Drive, e-posta) ve yeni telefonda geri yükleyebiliyor.
 * Veri hiçbir zaman bizim göremediğimiz bir yerden geçmiyor.
 *
 * Android'de ayrıca Auto Backup açık: uygulama verisi kullanıcının
 * KENDİ Google Drive'ına yedekleniyor, biz görmüyoruz. O yedek
 * platform içinde kalıyor; bu dosya ise Android↔iPhone geçişinde de
 * çalışıyor.
 */

const FORMAT = 'yahakk-backup';
const VERSION = 1;

export type BackupPayload = {
  format: typeof FORMAT;
  version: number;
  exportedAt: string;
  settings: Record<string, string>;
  sessions: unknown[];
  favorites: unknown[];
  locations: unknown[];
};

export type ImportSummary = {
  sessions: number;
  favorites: number;
  locations: number;
  settings: number;
};

function readAllSettings(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of storage.getAllKeys()) {
    const value = storage.getString(key);
    if (value !== undefined) result[key] = value;
  }
  return result;
}

export async function buildBackup(): Promise<BackupPayload> {
  const [sessions, favoriteRows, locationRows] = await Promise.all([
    db.select().from(zikirSessions),
    db.select().from(favorites),
    db.select().from(locations),
  ]);

  return {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    settings: readAllSettings(),
    sessions,
    favorites: favoriteRows,
    locations: locationRows,
  };
}

function backupFileName(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `yahakk-yedek-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`;
}

export type ExportResult =
  | { status: 'ok' }
  | { status: 'unavailable' }
  | { status: 'failed' };

/**
 * Yedeği dosyaya yazıp sistemin paylaşma menüsünü açar.
 *
 * `expo-sharing` ve `expo-document-picker` **tembel yükleniyor.** İkisi
 * de native modül ve eski bir derlemede bulunmuyorlar. Dosyanın başında
 * import edilirlerse modülün yokluğu tüm dosyayı patlatıyor, bu da onu
 * kullanan Ayarlar ekranını hiç açılamaz hale getiriyor — üstelik
 * expo-router rota modülünü `undefined` alıp "ErrorBoundary of
 * undefined" gibi ilgisiz görünen bir hata veriyor.
 *
 * Özelliğin çalışmaması ile ekranın çökmesi çok farklı iki şey.
 */
export async function exportBackup(): Promise<ExportResult> {
  let Sharing: typeof import('expo-sharing');
  try {
    Sharing = await import('expo-sharing');
    if (!(await Sharing.isAvailableAsync())) return { status: 'unavailable' };
  } catch {
    return { status: 'unavailable' };
  }

  try {
    const payload = await buildBackup();
    const file = new File(Paths.cache, backupFileName());

    if (file.exists) file.delete();
    file.create();
    file.write(JSON.stringify(payload, null, 2));

    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Yahakk yedeğini paylaş',
      UTI: 'public.json',
    });
    return { status: 'ok' };
  } catch {
    return { status: 'failed' };
  }
}

function isBackup(value: unknown): value is BackupPayload {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<BackupPayload>;
  return (
    candidate.format === FORMAT &&
    typeof candidate.version === 'number' &&
    Array.isArray(candidate.sessions)
  );
}

export type ImportResult =
  | { status: 'cancelled' }
  | { status: 'invalid'; reason: string }
  | { status: 'ok'; summary: ImportSummary };

/**
 * Dosya seçici tembel yükleniyor.
 *
 * Native modül, o modül eklenmeden önce alınmış bir derlemede yok.
 * Dosyanın başında import edilirse modülün yokluğu tüm dosyayı
 * patlatıyor ve onu kullanan Ayarlar ekranı hiç açılmıyordu — özelliğin
 * çalışmaması bir şey, ekranın çökmesi başka şey.
 */
async function pickBackupFile(): Promise<string | null> {
  const DocumentPicker = await import('expo-document-picker');
  const picked = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'text/plain', '*/*'],
    copyToCacheDirectory: true,
  });
  if (picked.canceled || !picked.assets?.[0]) return null;
  return picked.assets[0].uri;
}

/**
 * Yedeği içeri aktarır.
 *
 * Birleştirme kuralı: **hiçbir şey silinmiyor.** Oturumlar kimliğe göre
 * birleşiyor, çakışmada daha yeni güncellenmiş olan kazanıyor. Ayarlar
 * dosyadakiyle değiştiriliyor (kullanıcının tercihleri onlar). Bu
 * sayede iki telefonun geçmişi kaybolmadan tek dosyada toplanabiliyor.
 */
export async function importBackup(): Promise<ImportResult> {
  let uri: string | null;
  try {
    uri = await pickBackupFile();
  } catch {
    return {
      status: 'invalid',
      reason:
        'Dosya seçici bu sürümde kullanılamıyor. Uygulamanın güncel derlemesi gerekiyor.',
    };
  }

  if (!uri) return { status: 'cancelled' };

  let parsed: unknown;
  try {
    const file = new File(uri);
    parsed = JSON.parse(file.textSync());
  } catch {
    return { status: 'invalid', reason: 'Dosya okunamadı veya bozuk.' };
  }

  if (!isBackup(parsed)) {
    return {
      status: 'invalid',
      reason: 'Bu dosya bir Yahakk yedeği değil.',
    };
  }

  if (parsed.version > VERSION) {
    return {
      status: 'invalid',
      reason:
        'Bu yedek uygulamanın daha yeni bir sürümünden. Önce uygulamayı güncelleyin.',
    };
  }

  const summary: ImportSummary = {
    sessions: 0,
    favorites: 0,
    locations: 0,
    settings: 0,
  };

  // Konumlar önce: oturumlar ve ayarlar bunlara bağlı olabiliyor.
  for (const row of parsed.locations as (typeof locations.$inferInsert)[]) {
    try {
      await db.insert(locations).values(row).onConflictDoNothing();
      summary.locations += 1;
    } catch {
      // Tek bir bozuk satır tüm içe aktarmayı düşürmemeli.
    }
  }

  for (const row of parsed.sessions as (typeof zikirSessions.$inferInsert)[]) {
    try {
      await db
        .insert(zikirSessions)
        .values(row)
        .onConflictDoUpdate({
          target: zikirSessions.id,
          set: {
            currentCount: row.currentCount,
            targetCount: row.targetCount,
            status: row.status,
            updatedAt: row.updatedAt,
            completedAt: row.completedAt,
          },
        });
      summary.sessions += 1;
    } catch {
      // atla
    }
  }

  for (const row of parsed.favorites as (typeof favorites.$inferInsert)[]) {
    try {
      await db.insert(favorites).values(row).onConflictDoNothing();
      summary.favorites += 1;
    } catch {
      // atla
    }
  }

  for (const [key, value] of Object.entries(parsed.settings ?? {})) {
    if (typeof value !== 'string') continue;
    storage.set(key, value);
    summary.settings += 1;
  }

  return { status: 'ok', summary };
}
