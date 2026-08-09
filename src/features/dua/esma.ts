/**
 * Esmâü'l-Hüsnâ — Allah'ın güzel isimleri.
 *
 * ⚠️ TASLAK — ehil biri tarafından gözden geçirilmedi.
 *
 * ## Neden `Dua` tipini kullanmıyor
 *
 * Zorlanınca sığıyor gibi görünüyor ama üç yerden bozuluyordu:
 *
 * 1. `when` alanı ("ne zaman okunur") bir isim için anlamsız.
 * 2. Dua testleri her kayda ayrı kaynak zorunlu tutuyor. İsimlerin
 *    sayımı tek bir rivayete dayanıyor, isimlerin kendisi ise Kur'an'ın
 *    her yerinden geliyor; 99 satıra ayrı referans yazmak yapay olurdu.
 * 3. Asıl mesele ekran: dua bloğu düzeninde 99 blok alt alta dizilirse
 *    liste okunamaz hale geliyor. 99 isim kompakt satır ister.
 *
 * ## Kaynak
 *
 * Sıralama Tirmizî'nin rivayetindeki (Deavât 82) meşhur listeye göre.
 * Arapça isimler Kur'an-ı Kerîm'den, kamu malı. Türkçe karşılıklar kısa
 * ve açıklayıcı olacak şekilde bize ait; telifli bir kaynaktan
 * alınmadı.
 *
 * Türkçe karşılıklar bilinçli olarak KISA. Her ismin ardında ciltlerce
 * tefsir var; buradaki tek cümle onun yerine geçmez, yalnızca ismi
 * tanıtır.
 */

export type DivineName = {
  /** Listedeki sırası, 1-99 */
  order: number;
  arabic: string;
  transliteration: string;
  /** Kısa Türkçe karşılık */
  meaning: string;
};

export const ESMA_SOURCE = 'Tirmizî, Deavât 82';

export const ESMAUL_HUSNA: readonly DivineName[] = [
  { order: 1, arabic: 'اَلرَّحْمٰنُ', transliteration: 'er-Rahmân', meaning: 'Dünyada bütün canlılara merhamet eden' },
  { order: 2, arabic: 'اَلرَّحِيمُ', transliteration: 'er-Rahîm', meaning: 'Âhirette yalnız müminlere merhamet eden' },
  { order: 3, arabic: 'اَلْمَلِكُ', transliteration: 'el-Melik', meaning: 'Her şeyin sahibi ve mutlak hükümdar' },
  { order: 4, arabic: 'اَلْقُدُّوسُ', transliteration: 'el-Kuddûs', meaning: 'Her türlü eksiklikten uzak olan' },
  { order: 5, arabic: 'اَلسَّلَامُ', transliteration: 'es-Selâm', meaning: 'Esenlik veren, kullarını selâmete çıkaran' },
  { order: 6, arabic: 'اَلْمُؤْمِنُ', transliteration: 'el-Mü’min', meaning: 'Güven veren, vaadine güvenilen' },
  { order: 7, arabic: 'اَلْمُهَيْمِنُ', transliteration: 'el-Müheymin', meaning: 'Her şeyi görüp gözeten' },
  { order: 8, arabic: 'اَلْعَزِيزُ', transliteration: 'el-Azîz', meaning: 'Yenilmeyen, mutlak üstün olan' },
  { order: 9, arabic: 'اَلْجَبَّارُ', transliteration: 'el-Cebbâr', meaning: 'İradesini her durumda yürüten' },
  { order: 10, arabic: 'اَلْمُتَكَبِّرُ', transliteration: 'el-Mütekebbir', meaning: 'Büyüklük yalnız kendisine ait olan' },
  { order: 11, arabic: 'اَلْخَالِقُ', transliteration: 'el-Hâlik', meaning: 'Yoktan yaratan' },
  { order: 12, arabic: 'اَلْبَارِئُ', transliteration: 'el-Bâri’', meaning: 'Her şeyi kusursuz biçimde var eden' },
  { order: 13, arabic: 'اَلْمُصَوِّرُ', transliteration: 'el-Musavvir', meaning: 'Her varlığa ayrı bir şekil veren' },
  { order: 14, arabic: 'اَلْغَفَّارُ', transliteration: 'el-Gaffâr', meaning: 'Günahları örten ve çokça bağışlayan' },
  { order: 15, arabic: 'اَلْقَهَّارُ', transliteration: 'el-Kahhâr', meaning: 'Her şeye gücü yeten, karşı konulamayan' },
  { order: 16, arabic: 'اَلْوَهَّابُ', transliteration: 'el-Vehhâb', meaning: 'Karşılıksız veren' },
  { order: 17, arabic: 'اَلرَّزَّاقُ', transliteration: 'er-Rezzâk', meaning: 'Bütün canlıların rızkını veren' },
  { order: 18, arabic: 'اَلْفَتَّاحُ', transliteration: 'el-Fettâh', meaning: 'Kapalı olanı açan, zorluğu gideren' },
  { order: 19, arabic: 'اَلْعَلِيمُ', transliteration: 'el-Alîm', meaning: 'Her şeyi bilen' },
  { order: 20, arabic: 'اَلْقَابِضُ', transliteration: 'el-Kâbıd', meaning: 'Hikmetiyle daraltan' },
  { order: 21, arabic: 'اَلْبَاسِطُ', transliteration: 'el-Bâsıt', meaning: 'Hikmetiyle genişleten' },
  { order: 22, arabic: 'اَلْخَافِضُ', transliteration: 'el-Hâfıd', meaning: 'Dilediğini alçaltan' },
  { order: 23, arabic: 'اَلرَّافِعُ', transliteration: 'er-Râfi’', meaning: 'Dilediğini yücelten' },
  { order: 24, arabic: 'اَلْمُعِزُّ', transliteration: 'el-Muizz', meaning: 'İzzet ve şeref veren' },
  { order: 25, arabic: 'اَلْمُذِلُّ', transliteration: 'el-Müzill', meaning: 'Hak edeni zillete düşüren' },
  { order: 26, arabic: 'اَلسَّمِيعُ', transliteration: 'es-Semî’', meaning: 'Her şeyi işiten' },
  { order: 27, arabic: 'اَلْبَصِيرُ', transliteration: 'el-Basîr', meaning: 'Her şeyi gören' },
  { order: 28, arabic: 'اَلْحَكَمُ', transliteration: 'el-Hakem', meaning: 'Mutlak hüküm veren' },
  { order: 29, arabic: 'اَلْعَدْلُ', transliteration: 'el-Adl', meaning: 'Mutlak adaletli' },
  { order: 30, arabic: 'اَللَّطِيفُ', transliteration: 'el-Latîf', meaning: 'En ince işleri bilen, lütfu bol olan' },
  { order: 31, arabic: 'اَلْخَبِيرُ', transliteration: 'el-Habîr', meaning: 'Her şeyin içyüzünden haberdar' },
  { order: 32, arabic: 'اَلْحَلِيمُ', transliteration: 'el-Halîm', meaning: 'Acele cezalandırmayan, yumuşak davranan' },
  { order: 33, arabic: 'اَلْعَظِيمُ', transliteration: 'el-Azîm', meaning: 'Azameti sınırsız olan' },
  { order: 34, arabic: 'اَلْغَفُورُ', transliteration: 'el-Gafûr', meaning: 'Bağışlaması bol olan' },
  { order: 35, arabic: 'اَلشَّكُورُ', transliteration: 'eş-Şekûr', meaning: 'Az amele çok karşılık veren' },
  { order: 36, arabic: 'اَلْعَلِيُّ', transliteration: 'el-Aliyy', meaning: 'Yüceler yücesi' },
  { order: 37, arabic: 'اَلْكَبِيرُ', transliteration: 'el-Kebîr', meaning: 'Büyüklükte eşi olmayan' },
  { order: 38, arabic: 'اَلْحَفِيظُ', transliteration: 'el-Hafîz', meaning: 'Koruyup gözeten' },
  { order: 39, arabic: 'اَلْمُقِيتُ', transliteration: 'el-Mukît', meaning: 'Her canlının azığını veren' },
  { order: 40, arabic: 'اَلْحَسِيبُ', transliteration: 'el-Hasîb', meaning: 'Hesaba çeken, kullarına yeten' },
  { order: 41, arabic: 'اَلْجَلِيلُ', transliteration: 'el-Celîl', meaning: 'Celâl ve azamet sahibi' },
  { order: 42, arabic: 'اَلْكَرِيمُ', transliteration: 'el-Kerîm', meaning: 'Cömertliği sınırsız olan' },
  { order: 43, arabic: 'اَلرَّقِيبُ', transliteration: 'er-Rakîb', meaning: 'Her an gözetleyen' },
  { order: 44, arabic: 'اَلْمُجِيبُ', transliteration: 'el-Mucîb', meaning: 'Duaya karşılık veren' },
  { order: 45, arabic: 'اَلْوَاسِعُ', transliteration: 'el-Vâsi’', meaning: 'Rahmeti ve ilmi her şeyi kuşatan' },
  { order: 46, arabic: 'اَلْحَكِيمُ', transliteration: 'el-Hakîm', meaning: 'Her işi hikmetli olan' },
  { order: 47, arabic: 'اَلْوَدُودُ', transliteration: 'el-Vedûd', meaning: 'Çok seven ve sevilen' },
  { order: 48, arabic: 'اَلْمَجِيدُ', transliteration: 'el-Mecîd', meaning: 'Şanı yüce ve şerefli' },
  { order: 49, arabic: 'اَلْبَاعِثُ', transliteration: 'el-Bâis', meaning: 'Ölüleri dirilten' },
  { order: 50, arabic: 'اَلشَّهِيدُ', transliteration: 'eş-Şehîd', meaning: 'Her şeye şahit olan' },
  { order: 51, arabic: 'اَلْحَقُّ', transliteration: 'el-Hakk', meaning: 'Varlığı gerçek ve değişmez olan' },
  { order: 52, arabic: 'اَلْوَكِيلُ', transliteration: 'el-Vekîl', meaning: 'Kendisine güvenilen, işleri üstlenen' },
  { order: 53, arabic: 'اَلْقَوِيُّ', transliteration: 'el-Kaviyy', meaning: 'Kudreti sonsuz olan' },
  { order: 54, arabic: 'اَلْمَتِينُ', transliteration: 'el-Metîn', meaning: 'Gücü hiç eksilmeyen' },
  { order: 55, arabic: 'اَلْوَلِيُّ', transliteration: 'el-Veliyy', meaning: 'Müminlerin dostu ve yardımcısı' },
  { order: 56, arabic: 'اَلْحَمِيدُ', transliteration: 'el-Hamîd', meaning: 'Övgüye lâyık olan' },
  { order: 57, arabic: 'اَلْمُحْصِي', transliteration: 'el-Muhsî', meaning: 'Her şeyi tek tek sayan ve bilen' },
  { order: 58, arabic: 'اَلْمُبْدِئُ', transliteration: 'el-Mübdi’', meaning: 'Yaratmayı ilk başlatan' },
  { order: 59, arabic: 'اَلْمُعِيدُ', transliteration: 'el-Muîd', meaning: 'Yaratmayı tekrarlayan' },
  { order: 60, arabic: 'اَلْمُحْيِي', transliteration: 'el-Muhyî', meaning: 'Can veren, dirilten' },
  { order: 61, arabic: 'اَلْمُمِيتُ', transliteration: 'el-Mümît', meaning: 'Ölümü yaratan' },
  { order: 62, arabic: 'اَلْحَيُّ', transliteration: 'el-Hayy', meaning: 'Diri olan, hayatı ezelî ve ebedî' },
  { order: 63, arabic: 'اَلْقَيُّومُ', transliteration: 'el-Kayyûm', meaning: 'Varlığı kendinden, her şeyi ayakta tutan' },
  { order: 64, arabic: 'اَلْوَاجِدُ', transliteration: 'el-Vâcid', meaning: 'Dilediğini bulan, hiçbir şeye muhtaç olmayan' },
  { order: 65, arabic: 'اَلْمَاجِدُ', transliteration: 'el-Mâcid', meaning: 'Şanı ve keremi yüce' },
  { order: 66, arabic: 'اَلْوَاحِدُ', transliteration: 'el-Vâhid', meaning: 'Zâtında ve sıfatlarında tek' },
  { order: 67, arabic: 'اَلْاَحَدُ', transliteration: 'el-Ehad', meaning: 'Bölünmeyen, benzeri bulunmayan tek' },
  { order: 68, arabic: 'اَلصَّمَدُ', transliteration: 'es-Samed', meaning: 'Hiçbir şeye muhtaç olmayan, her şeyin muhtaç olduğu' },
  { order: 69, arabic: 'اَلْقَادِرُ', transliteration: 'el-Kâdir', meaning: 'Dilediğini yapmaya gücü yeten' },
  { order: 70, arabic: 'اَلْمُقْتَدِرُ', transliteration: 'el-Muktedir', meaning: 'Kudretini dilediği gibi kullanan' },
  { order: 71, arabic: 'اَلْمُقَدِّمُ', transliteration: 'el-Mukaddim', meaning: 'Dilediğini öne geçiren' },
  { order: 72, arabic: 'اَلْمُؤَخِّرُ', transliteration: 'el-Muahhir', meaning: 'Dilediğini geriye bırakan' },
  { order: 73, arabic: 'اَلْاَوَّلُ', transliteration: 'el-Evvel', meaning: 'Başlangıcı olmayan, her şeyden önce' },
  { order: 74, arabic: 'اَلْاٰخِرُ', transliteration: 'el-Âhir', meaning: 'Sonu olmayan, her şeyden sonra' },
  { order: 75, arabic: 'اَلظَّاهِرُ', transliteration: 'ez-Zâhir', meaning: 'Varlığı delilleriyle apaçık' },
  { order: 76, arabic: 'اَلْبَاطِنُ', transliteration: 'el-Bâtın', meaning: 'Zâtının mahiyeti kavranamayan' },
  { order: 77, arabic: 'اَلْوَالِي', transliteration: 'el-Vâlî', meaning: 'Kâinatı yöneten' },
  { order: 78, arabic: 'اَلْمُتَعَالِي', transliteration: 'el-Müteâlî', meaning: 'Her türlü noksanlıktan yüce' },
  { order: 79, arabic: 'اَلْبَرُّ', transliteration: 'el-Berr', meaning: 'İyiliği ve ihsanı bol olan' },
  { order: 80, arabic: 'اَلتَّوَّابُ', transliteration: 'et-Tevvâb', meaning: 'Tövbeleri çokça kabul eden' },
  { order: 81, arabic: 'اَلْمُنْتَقِمُ', transliteration: 'el-Müntakim', meaning: 'Zalimlerin hakkından gelen' },
  { order: 82, arabic: 'اَلْعَفُوُّ', transliteration: 'el-Afüvv', meaning: 'Günahları silen, çokça affeden' },
  { order: 83, arabic: 'اَلرَّؤُوفُ', transliteration: 'er-Raûf', meaning: 'Çok şefkatli' },
  { order: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mâlikü’l-Mülk', meaning: 'Mülkün gerçek sahibi' },
  { order: 85, arabic: 'ذُو الْجَلَالِ وَالْاِكْرَامِ', transliteration: 'Zü’l-Celâli ve’l-İkrâm', meaning: 'Azamet ve ikram sahibi' },
  { order: 86, arabic: 'اَلْمُقْسِطُ', transliteration: 'el-Muksit', meaning: 'Her işi denk ve adaletli' },
  { order: 87, arabic: 'اَلْجَامِعُ', transliteration: 'el-Câmi’', meaning: 'Dilediğini bir araya toplayan' },
  { order: 88, arabic: 'اَلْغَنِيُّ', transliteration: 'el-Ganiyy', meaning: 'Hiçbir şeye ihtiyacı olmayan' },
  { order: 89, arabic: 'اَلْمُغْنِي', transliteration: 'el-Muğnî', meaning: 'Dilediğini zengin kılan' },
  { order: 90, arabic: 'اَلْمَانِعُ', transliteration: 'el-Mâni’', meaning: 'Dilemediği şeyin olmasına izin vermeyen' },
  { order: 91, arabic: 'اَلضَّارُّ', transliteration: 'ed-Dârr', meaning: 'Hikmetiyle zarar da yaratan' },
  { order: 92, arabic: 'اَلنَّافِعُ', transliteration: 'en-Nâfi’', meaning: 'Fayda veren' },
  { order: 93, arabic: 'اَلنُّورُ', transliteration: 'en-Nûr', meaning: 'Nur olan, âlemleri aydınlatan' },
  { order: 94, arabic: 'اَلْهَادِي', transliteration: 'el-Hâdî', meaning: 'Doğru yolu gösteren' },
  { order: 95, arabic: 'اَلْبَدِيعُ', transliteration: 'el-Bedî’', meaning: 'Eşsiz ve örneksiz yaratan' },
  { order: 96, arabic: 'اَلْبَاقِي', transliteration: 'el-Bâkî', meaning: 'Varlığı sürekli olan' },
  { order: 97, arabic: 'اَلْوَارِثُ', transliteration: 'el-Vâris', meaning: 'Her şey yok olduktan sonra kalan' },
  { order: 98, arabic: 'اَلرَّشِيدُ', transliteration: 'er-Reşîd', meaning: 'Doğruya ileten, işleri isabetli olan' },
  { order: 99, arabic: 'اَلصَّبُورُ', transliteration: 'es-Sabûr', meaning: 'Çok sabırlı, acele etmeyen' },
];

export const ESMA_COUNT = ESMAUL_HUSNA.length;
