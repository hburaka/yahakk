import type { Dua } from '../types';

/**
 * ⚠️ TASLAK — ehil biri tarafından gözden geçirilmedi.
 *
 * Sabah, akşam ve gün içinde okunan dualar. Arapça metinler hadis
 * külliyatından (kamu malı); Türkçe anlamlar bize ait sade çeviriler.
 */

export const GUNLUK_DUALAR: readonly Dua[] = [
  {
    id: 'sabah-duasi',
    categoryId: 'gunluk',
    title: 'Sabah duası',
    when: 'Sabah namazından sonra veya güne başlarken.',
    arabic:
      'اَصْبَحْنَا وَاَصْبَحَ الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ، لَٓا اِلٰهَ اِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Asbahnâ ve asbahal-mülkü lillâh, vel-hamdü lillâh, lâ ilâhe illallâhü vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey’in kadîr.',
    meaning:
      'Sabaha erdik, mülk de Allah’ın olarak sabaha erdi. Hamd Allah’a mahsustur. Allah’tan başka ilâh yoktur, O tektir, ortağı yoktur. Mülk O’nundur, hamd O’nadır ve O her şeye gücü yetendir.',
    reference: 'Müslim, Zikir 75',
    reviewed: false,
  },
  {
    id: 'aksam-duasi',
    categoryId: 'gunluk',
    title: 'Akşam duası',
    when: 'Akşam namazından sonra veya gün batarken.',
    arabic:
      'اَمْسَيْنَا وَاَمْسَى الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ، لَٓا اِلٰهَ اِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Emseynâ ve emsel-mülkü lillâh, vel-hamdü lillâh, lâ ilâhe illallâhü vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey’in kadîr.',
    meaning:
      'Akşama erdik, mülk de Allah’ın olarak akşama erdi. Hamd Allah’a mahsustur. Allah’tan başka ilâh yoktur, O tektir, ortağı yoktur. Mülk O’nundur, hamd O’nadır ve O her şeye gücü yetendir.',
    reference: 'Müslim, Zikir 75',
    reviewed: false,
  },
  {
    id: 'seyyidul-istigfar',
    categoryId: 'gunluk',
    title: 'Seyyidü’l-istiğfâr',
    when: 'İstiğfârın en üstünü kabul edilir; sabah ve akşam okunur.',
    arabic:
      'اَللّٰهُمَّ اَنْتَ رَبِّي لَٓا اِلٰهَ اِلَّٓا اَنْتَ، خَلَقْتَنِي وَاَنَا عَبْدُكَ، وَاَنَا عَلٰى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، اَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، اَبُٓوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَاَبُٓوءُ بِذَنْبِي فَاغْفِرْ لِي فَاِنَّهُ لَا يَغْفِرُ الذُّنُوبَ اِلَّٓا اَنْتَ',
    transliteration:
      'Allâhümme ente rabbî lâ ilâhe illâ ente, halaktenî ve ene abdük, ve ene alâ ahdike ve va’dike mesteta’tü, eûzü bike min şerri mâ sana’tü, ebûü leke bi-ni’metike aleyye ve ebûü bi-zenbî fağfirlî fe-innehû lâ yağfiruz-zünûbe illâ ente.',
    meaning:
      'Allah’ım! Sen benim Rabbimsin, senden başka ilâh yoktur. Beni sen yarattın, ben senin kulunum. Gücüm yettiğince sana verdiğim sözde duruyorum. Yaptıklarımın şerrinden sana sığınırım. Üzerimdeki nimetini kabul eder, günahımı itiraf ederim; beni bağışla. Çünkü günahları senden başkası bağışlayamaz.',
    reference: 'Buhârî, Deavât 2',
    reviewed: false,
  },
  {
    id: 'uyaninca',
    categoryId: 'gunluk',
    title: 'Uyanınca',
    when: 'Uykudan uyandığında.',
    arabic:
      'اَلْحَمْدُ لِلّٰهِ الَّذِٓي اَحْيَانَا بَعْدَ مَٓا اَمَاتَنَا وَاِلَيْهِ النُّشُورُ',
    transliteration:
      'Elhamdü lillâhillezî ahyânâ ba’de mâ emâtenâ ve ileyhin-nüşûr.',
    meaning:
      'Bizi öldürdükten sonra dirilten Allah’a hamdolsun. Dönüş ancak O’nadır.',
    reference: 'Buhârî, Deavât 7; Müslim, Zikir 59',
    reviewed: false,
  },
  {
    id: 'uyumadan-once',
    categoryId: 'gunluk',
    title: 'Uyumadan önce',
    when: 'Yatağa girerken.',
    arabic: 'بِاسْمِكَ اللّٰهُمَّ اَمُوتُ وَاَحْيَا',
    transliteration: 'Bismike’llâhümme emûtü ve ahyâ.',
    meaning: 'Allah’ım! Senin adınla ölür, senin adınla dirilirim.',
    reference: 'Buhârî, Deavât 7',
    reviewed: false,
  },
  {
    id: 'evden-cikarken',
    categoryId: 'gunluk',
    title: 'Evden çıkarken',
    when: 'Evden dışarı adım atarken.',
    arabic:
      'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ، وَلَا حَوْلَ وَلَا قُوَّةَ اِلَّا بِاللّٰهِ',
    transliteration:
      'Bismillâhi tevekkeltü alallâh, ve lâ havle ve lâ kuvvete illâ billâh.',
    meaning:
      'Allah’ın adıyla. Allah’a güvendim. Güç ve kuvvet ancak Allah’ındır.',
    reference: 'Ebû Dâvûd, Edeb 103; Tirmizî, Deavât 34',
    reviewed: false,
  },
  {
    id: 'eve-girerken',
    categoryId: 'gunluk',
    title: 'Eve girerken',
    when: 'Eve adım atarken.',
    arabic:
      'بِسْمِ اللّٰهِ وَلَجْنَا، وَبِسْمِ اللّٰهِ خَرَجْنَا، وَعَلٰى رَبِّنَا تَوَكَّلْنَا',
    transliteration:
      'Bismillâhi velecnâ, ve bismillâhi haracnâ, ve alâ rabbinâ tevekkelnâ.',
    meaning:
      'Allah’ın adıyla girdik, Allah’ın adıyla çıktık ve Rabbimize güvendik.',
    reference: 'Ebû Dâvûd, Edeb 102',
    reviewed: false,
  },
  {
    id: 'korunma-duasi',
    categoryId: 'gunluk',
    title: 'Korunma duası',
    when: 'Sabah, akşam ve konaklanan yerlerde üç kez okunur.',
    arabic:
      'اَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّٓامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'Eûzü bi-kelimâtillâhit-tâmmâti min şerri mâ halak.',
    meaning:
      'Yarattığı şeylerin şerrinden Allah’ın eksiksiz kelimelerine sığınırım.',
    reference: 'Müslim, Zikir 54',
    reviewed: false,
  },
];
