/**
 * Dua içeriğinin şekli.
 *
 * Üç katman ayrı tutuluyor çünkü telif durumları farklı:
 * - `arabic`  → Kur'an ve hadis metinleri, kamu malı
 * - `transliteration` → latin harfli okunuş, kendi çalışmamız
 * - `meaning` → Türkçe anlam, telifli bir mealden alınmıyor; sade
 *   biçimde kendimiz yazıyoruz. Bkz. `content/sources.ts`
 *
 * `reviewed` alanı telifle ilgili değil, dinî doğrulukla ilgili.
 * İkisi ayrı eksen: hakları bizde olan bir metin de yanlış olabilir.
 */

export type Dua = {
  id: string;
  /** DUA_CATEGORIES içindeki kategori kimliği */
  categoryId: string;
  title: string;
  /** Ne zaman veya neden okunduğu — tek cümlelik bağlam */
  when?: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  /** Nereden geldiği: "Bakara sûresi, 201. âyet" veya "Buhârî, Ezan 155" */
  reference?: string;
  /** Ehil biri tarafından gözden geçirildi mi */
  reviewed: boolean;
};

/** Arapça metinde bulunması beklenen karakter aralığı */
const ARABIC_RANGE = /[؀-ۿ]/;

/**
 * Bir metnin gerçekten Arapça harf içerip içermediği.
 *
 * Kopyala-yapıştır sırasında Arapça alanın boş kalması veya yanlışlıkla
 * latin metinle doldurulması gözle fark edilmiyor; ekranda okunuş iki
 * kez görünüyor. Test bunu yakalasın diye burada.
 */
export function hasArabicScript(text: string): boolean {
  return ARABIC_RANGE.test(text);
}
