import type { Dua } from '../types';

/**
 * Gözden geçirildi ve onaylandı.
 *
 * Şifa, sıkıntı ve keder duaları. Bu kategori muhtemelen en zor anda
 * açılacak olan; metinler kısa ve doğrudan tutuldu.
 *
 * Arapça metinler Kur'an ve hadis külliyatından (kamu malı); Türkçe
 * anlamlar bize ait sade çeviriler.
 */

export const SIFA_DUALARI: readonly Dua[] = [
  {
    id: 'hastaya-sifa',
    categoryId: 'sifa',
    title: 'Hastaya şifa duası',
    when: 'Hasta ziyaretinde, hastanın yanında okunur.',
    arabic:
      'اَللّٰهُمَّ رَبَّ النَّاسِ، اَذْهِبِ الْبَاْسَ، اِشْفِ اَنْتَ الشَّافِي، لَا شِفَٓاءَ اِلَّا شِفَٓاؤُكَ، شِفَٓاءً لَا يُغَادِرُ سَقَمًا',
    transliteration:
      'Allâhümme rabben-nâs, ezhibil-be’se, işfi entes-şâfî, lâ şifâe illâ şifâük, şifâen lâ yügâdiru sekamâ.',
    meaning:
      'Ey insanların Rabbi olan Allah’ım! Sıkıntıyı gider, şifa ver. Şifa veren yalnız sensin. Senin şifandan başka şifa yoktur. Öyle bir şifa ver ki geride hastalık bırakmasın.',
    reference: 'Buhârî, Merdâ 20; Müslim, Selâm 46',
    reviewed: true,
  },
  {
    id: 'agriyan-yere',
    categoryId: 'sifa',
    title: 'Ağrıyan yer için',
    when: 'Ağrıyan yere el konularak yedi kez okunur.',
    arabic:
      'اَعُوذُ بِاللّٰهِ وَقُدْرَتِهِ مِنْ شَرِّ مَٓا اَجِدُ وَاُحَاذِرُ',
    transliteration:
      'Eûzü billâhi ve kudratihî min şerri mâ ecidü ve ühâzir.',
    meaning:
      'Hissettiğim ve korktuğum şeyin şerrinden Allah’a ve O’nun kudretine sığınırım.',
    reference: 'Müslim, Selâm 67',
    reviewed: true,
  },
  {
    id: 'yunus-duasi',
    categoryId: 'sifa',
    title: 'Sıkıntı anında — Yûnus duası',
    when: 'Darda kalındığında, çıkış görünmeyen anlarda.',
    arabic:
      'لَٓا اِلٰهَ اِلَّٓا اَنْتَ سُبْحَانَكَ اِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration:
      'Lâ ilâhe illâ ente sübhâneke innî küntü minez-zâlimîn.',
    meaning:
      'Senden başka ilâh yoktur. Seni tenzih ederim. Gerçekten ben kendine yazık edenlerden oldum.',
    reference: 'Enbiyâ sûresi, 87. âyet',
    reviewed: true,
  },
  {
    id: 'keder-ve-uzuntu',
    categoryId: 'sifa',
    title: 'Keder ve üzüntü için',
    when: 'İçe kapanma, tasa ve yorgunluk anlarında.',
    arabic:
      'اَللّٰهُمَّ اِنِّٓي اَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَاَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَاَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَاَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    transliteration:
      'Allâhümme innî eûzü bike minel-hemmi vel-hazen, ve eûzü bike minel-aczi vel-kesel, ve eûzü bike minel-cübni vel-buhl, ve eûzü bike min galebetid-deyni ve kahrir-ricâl.',
    meaning:
      'Allah’ım! Tasadan ve üzüntüden sana sığınırım. Acizlikten ve tembellikten sana sığınırım. Korkaklıktan ve cimrilikten sana sığınırım. Borcun altında ezilmekten ve insanların baskısından sana sığınırım.',
    reference: 'Buhârî, Deavât 36',
    reviewed: true,
  },
  {
    id: 'borc-sikintisi',
    categoryId: 'sifa',
    title: 'Borç sıkıntısı için',
    when: 'Maddi darlık ve borç yükü altındayken.',
    arabic:
      'اَللّٰهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَاَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration:
      'Allâhümmekfinî bi-halâlike an harâmik, ve ağninî bi-fadlike ammen sivâk.',
    meaning:
      'Allah’ım! Helâlinle yetindir, haramına muhtaç etme. Lütfunla zengin kıl, senden başkasına muhtaç etme.',
    reference: 'Tirmizî, Deavât 110',
    reviewed: true,
  },
  {
    id: 'korku-aninda',
    categoryId: 'sifa',
    title: 'Korku anında',
    when: 'Endişe ve tehlike anlarında.',
    arabic: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbünallâhü ve ni’mel-vekîl.',
    meaning: 'Allah bize yeter. O ne güzel vekildir.',
    reference: 'Âl-i İmrân sûresi, 173. âyet',
    reviewed: true,
  },
  {
    id: 'musibet-aninda',
    categoryId: 'sifa',
    title: 'Musibet anında',
    when: 'Kayıp, ölüm ve büyük sıkıntı haberinde.',
    arabic:
      'اِنَّا لِلّٰهِ وَاِنَّٓا اِلَيْهِ رَاجِعُونَ، اَللّٰهُمَّ اْجُرْنِي فِي مُصِيبَتِي وَاَخْلِفْ لِي خَيْرًا مِنْهَا',
    transliteration:
      'İnnâ lillâhi ve innâ ileyhi râciûn. Allâhümme’cürnî fî musîbetî ve ahlif lî hayran minhâ.',
    meaning:
      'Biz Allah’a aitiz ve O’na döneceğiz. Allah’ım! Bu musibette bana sabır ver ve kaybettiğimden daha hayırlısını nasip et.',
    reference: 'Bakara sûresi, 156. âyet; Müslim, Cenâiz 4',
    reviewed: true,
  },
  {
    id: 'eyyub-duasi',
    categoryId: 'sifa',
    title: 'Hastalıkta — Eyyûb duası',
    when: 'Uzun süren hastalık ve dermansızlık halinde.',
    arabic:
      'اَنِّي مَسَّنِيَ الضُّرُّ وَاَنْتَ اَرْحَمُ الرَّاحِمِينَ',
    transliteration: 'Ennî messeniyed-durru ve ente erhamür-râhimîn.',
    meaning:
      'Bana gerçekten sıkıntı dokundu; sen merhametlilerin en merhametlisisin.',
    reference: 'Enbiyâ sûresi, 83. âyet',
    reviewed: true,
  },
];
