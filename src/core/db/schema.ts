import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

/**
 * Kayıtlı konumlar. Kullanıcı birden fazla konum tutabilir
 * (ör. memleket + yaşadığı şehir) ve arasında geçiş yapabilir.
 */
export const locations = sqliteTable('locations', {
  /** Diyanet ilçe kodu ya da serbest konum için `coord:<lat>,<lng>` */
  id: text('id').primaryKey(),
  /** Görünen ad — "Kadıköy" */
  name: text('name').notNull(),
  /** Üst birim — "İstanbul" */
  region: text('region'),
  /** ISO 3166-1 alpha-2 — "TR" */
  countryCode: text('country_code').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  /** IANA saat dilimi — "Europe/Istanbul" */
  timezone: text('timezone').notNull(),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`(unixepoch())`),
});

export type PrayerTimeSource = 'diyanet' | 'calculated';

/**
 * Önbelleğe alınmış namaz vakitleri.
 *
 * Vakitler gün başından itibaren **dakika** cinsinden tam sayı olarak
 * tutulur (ör. 05:42 → 342). Sebebi: yerel saatte saklanır, yaz saati
 * geçişlerinde kayma yaratmaz, karşılaştırma ve fark alma aritmetiği
 * ucuzdur, ve satır başına 6 tam sayı yer kaplar.
 */
export const prayerTimes = sqliteTable(
  'prayer_times',
  {
    locationId: text('location_id')
      .notNull()
      .references(() => locations.id, { onDelete: 'cascade' }),
    /** ISO tarih — "2026-08-07" */
    date: text('date').notNull(),

    fajr: integer('fajr').notNull(),
    sunrise: integer('sunrise').notNull(),
    dhuhr: integer('dhuhr').notNull(),
    asr: integer('asr').notNull(),
    maghrib: integer('maghrib').notNull(),
    isha: integer('isha').notNull(),

    /**
     * Hanefî (asr-ı sânî) ikindi vakti. Diyanet asr-ı evvel yayınlar;
     * kullanıcı ayarlardan Hanefî ikindiyi seçerse bu sütun kullanılır.
     * Diyanet kaynaklı satırlarda adhan-js ile hesaplanıp doldurulur.
     */
    asrHanafi: integer('asr_hanafi'),

    source: text('source').$type<PrayerTimeSource>().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.locationId, table.date] }),
    index('prayer_times_date_idx').on(table.date),
  ]
);

/** Kullanıcının kendi eklediği zikirler */
export const customZikir = sqliteTable('custom_zikir', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  arabic: text('arabic'),
  transliteration: text('transliteration'),
  meaning: text('meaning'),
  defaultCount: integer('default_count').notNull().default(33),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`(unixepoch())`),
});

export type ZikirSessionStatus = 'active' | 'completed' | 'abandoned';

/**
 * Tesbih oturumları.
 *
 * `status = 'active'` olan oturum, kullanıcının yarım bıraktığı zikirdir.
 * 1000'lik bir zikir tek oturuşta bitmez; uygulama kapansa da bu satır
 * sayesinde 847/1000'den devam edilir. Her artışta `currentCount`
 * güncellenir (yazma ucuz, SQLite yerel).
 *
 * Aynı anda birden fazla `active` oturum olabilir — kullanıcı farklı
 * zikirleri paralel sürdürebilir.
 */
export const zikirSessions = sqliteTable(
  'zikir_sessions',
  {
    id: text('id').primaryKey(),

    /** Hazır şablon kimliği (zikir-templates.ts) — özel zikirse null */
    templateId: text('template_id'),
    /** Kullanıcının kendi zikri — şablonsa null */
    customZikirId: text('custom_zikir_id').references(() => customZikir.id, {
      onDelete: 'cascade',
    }),

    /** Zincirli set kimliği (ör. "namaz-tesbihati") — tekil zikirse null */
    setId: text('set_id'),
    /** Zincirli sette kaçıncı adımda kalındığı */
    setStepIndex: integer('set_step_index'),

    targetCount: integer('target_count').notNull(),
    currentCount: integer('current_count').notNull().default(0),

    status: text('status').$type<ZikirSessionStatus>().notNull(),

    /** Yerel tarih "2026-08-07" — günlük istatistik sorgusu için */
    date: text('date').notNull(),
    startedAt: integer('started_at')
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at')
      .notNull()
      .default(sql`(unixepoch())`),
    completedAt: integer('completed_at'),
  },
  (table) => [
    index('zikir_sessions_status_idx').on(table.status),
    index('zikir_sessions_date_idx').on(table.date),
  ]
);

export type FavoriteKind = 'dua' | 'ilmihal' | 'zikir';

/** Dua, ilmihal konusu ve zikir favorileri tek tabloda */
export const favorites = sqliteTable(
  'favorites',
  {
    kind: text('kind').$type<FavoriteKind>().notNull(),
    /** İlgili içeriğin kimliği */
    itemId: text('item_id').notNull(),
    createdAt: integer('created_at')
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.kind, table.itemId] })]
);

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type PrayerTimeRow = typeof prayerTimes.$inferSelect;
export type NewPrayerTimeRow = typeof prayerTimes.$inferInsert;
export type ZikirSession = typeof zikirSessions.$inferSelect;
export type NewZikirSession = typeof zikirSessions.$inferInsert;
export type CustomZikir = typeof customZikir.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
