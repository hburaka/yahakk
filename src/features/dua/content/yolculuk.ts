import type { Dua } from '../types';

/**
 * ⚠️ TASLAK — ehil biri tarafından gözden geçirilmedi.
 *
 * Yolculuk duaları. Arapça metinler hadis külliyatından (kamu malı);
 * Türkçe anlamlar bize ait sade çeviriler.
 */

export const YOLCULUK_DUALARI: readonly Dua[] = [
  {
    id: 'binege-binerken',
    categoryId: 'yolculuk',
    title: 'Araca binerken',
    when: 'Yola çıkmak üzere araca bindiğinde.',
    arabic:
      'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَاِنَّٓا اِلٰى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration:
      'Sübhânellezî sahhara lenâ hâzâ ve mâ künnâ lehû mukrinîn, ve innâ ilâ rabbinâ lemünkalibûn.',
    meaning:
      'Bunu bizim hizmetimize veren Allah’ı tenzih ederiz; yoksa buna bizim gücümüz yetmezdi. Şüphesiz biz Rabbimize döneceğiz.',
    reference: 'Zuhruf sûresi, 13-14. âyetler; Müslim, Hac 425',
    reviewed: false,
  },
  {
    id: 'yolculuk-duasi',
    categoryId: 'yolculuk',
    title: 'Yolculuk duası',
    when: 'Yola çıkarken, araca binme duasının ardından.',
    arabic:
      'اَللّٰهُمَّ اِنَّا نَسْاَلُكَ فِي سَفَرِنَا هٰذَا الْبِرَّ وَالتَّقْوٰى، وَمِنَ الْعَمَلِ مَا تَرْضٰى، اَللّٰهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هٰذَا وَاطْوِ عَنَّا بُعْدَهُ',
    transliteration:
      'Allâhümme innâ nes’elüke fî seferinâ hâzel-birra vet-takvâ, ve minel-ameli mâ terdâ. Allâhümme hevvin aleynâ seferanâ hâzâ vatvi annâ bu’deh.',
    meaning:
      'Allah’ım! Bu yolculuğumuzda senden iyilik, takvâ ve razı olacağın ameli dileriz. Allah’ım! Bu yolculuğu bize kolaylaştır, mesafesini kısalt.',
    reference: 'Müslim, Hac 425',
    reviewed: false,
  },
  {
    id: 'konaklarken',
    categoryId: 'yolculuk',
    title: 'Konaklarken',
    when: 'Yolda bir yerde mola verdiğinde veya konakladığında.',
    arabic:
      'اَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّٓامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'Eûzü bi-kelimâtillâhit-tâmmâti min şerri mâ halak.',
    meaning:
      'Yarattığı şeylerin şerrinden Allah’ın eksiksiz kelimelerine sığınırım.',
    reference: 'Müslim, Zikir 54',
    reviewed: false,
  },
  {
    id: 'donuste',
    categoryId: 'yolculuk',
    title: 'Dönüşte',
    when: 'Yolculuktan dönerken.',
    arabic:
      'اٰيِبُونَ تَٓائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
    transliteration: 'Âyibûne tâibûne âbidûne li-rabbinâ hâmidûn.',
    meaning:
      'Dönüyoruz, tövbe ediyoruz, kulluk ediyoruz ve Rabbimize hamd ediyoruz.',
    reference: 'Buhârî, Umre 12; Müslim, Hac 428',
    reviewed: false,
  },
  {
    id: 'yolcuyu-ugurlarken',
    categoryId: 'yolculuk',
    title: 'Yolcuyu uğurlarken',
    when: 'Yolculuğa çıkan birine veda ederken.',
    arabic:
      'اَسْتَوْدِعُ اللّٰهَ دِينَكَ وَاَمَانَتَكَ وَخَوَاتِيمَ عَمَلِكَ',
    transliteration:
      'Estevdiullâhe dîneke ve emâneteke ve havâtîme amelik.',
    meaning:
      'Dinini, emanetini ve amellerinin sonucunu Allah’a emanet ediyorum.',
    reference: 'Ebû Dâvûd, Cihâd 72; Tirmizî, Deavât 44',
    reviewed: false,
  },
];
