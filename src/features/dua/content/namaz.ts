import type { Dua } from '../types';

/**
 * ⚠️ TASLAK — ehil biri tarafından gözden geçirilmedi.
 *
 * Namazda okunan dualar. Arapça metinler hadis külliyatından gelir ve
 * kamu malıdır. Türkçe anlamlar telifli bir mealden alınmadı; sade
 * biçimde kendimiz yazdık (bkz. `content/sources.ts`).
 *
 * Bu kategori bilinçli olarak önce yazıldı: ilmihaldeki "Namazın
 * Kılınışı" bu duaları adlarıyla anıyor ve kullanıcı orada "Sübhâneke
 * okunur" cümlesini görünce metnin kendisini arıyor.
 */

export const NAMAZ_DUALARI: readonly Dua[] = [
  {
    id: 'subhaneke',
    categoryId: 'namaz',
    title: 'Sübhâneke',
    when: 'Namaza başlarken, iftitah tekbirinden sonra okunur.',
    arabic:
      'سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالٰى جَدُّكَ وَلَا اِلٰهَ غَيْرُكَ',
    transliteration:
      'Sübhânekellâhümme ve bihamdik, ve tebârakesmük, ve teâlâ ceddük, ve lâ ilâhe ğayruk.',
    meaning:
      'Allah’ım! Seni eksikliklerden tenzih eder, hamdinle anarım. Senin adın mübarektir, şanın yücedir, senden başka ilâh yoktur.',
    reference: 'Ebû Dâvûd, Salât 122; Tirmizî, Salât 65',
    reviewed: false,
  },
  {
    id: 'ettehiyyatu',
    categoryId: 'namaz',
    title: 'Ettehiyyâtü',
    when: 'Namazın her oturuşunda okunur.',
    arabic:
      'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ اَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِينَ، اَشْهَدُ اَنْ لَا اِلٰهَ اِلَّا اللّٰهُ وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration:
      'Ettehiyyâtü lillâhi vessalevâtü vettayyibât. Esselâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ibâdillâhis-sâlihîn. Eşhedü en lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh.',
    meaning:
      'Dil, beden ve mal ile yapılan bütün ibadetler Allah’a mahsustur. Ey Peygamber! Allah’ın selâmı, rahmeti ve bereketi senin üzerine olsun. Selâm bizim ve Allah’ın sâlih kullarının üzerine olsun. Şehâdet ederim ki Allah’tan başka ilâh yoktur; yine şehâdet ederim ki Muhammed O’nun kulu ve elçisidir.',
    reference: 'Buhârî, Ezân 148; Müslim, Salât 55',
    reviewed: false,
  },
  {
    id: 'allahumme-salli',
    categoryId: 'namaz',
    title: 'Allâhümme salli',
    when: 'Son oturuşta Ettehiyyâtü’den sonra okunur.',
    arabic:
      'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلٰى اِبْرَاهِيمَ وَعَلٰى اٰلِ اِبْرَاهِيمَ، اِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration:
      'Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.',
    meaning:
      'Allah’ım! Muhammed’e ve Muhammed’in ailesine rahmet eyle; İbrâhim’e ve İbrâhim’in ailesine rahmet eylediğin gibi. Şüphesiz sen övülmeye lâyıksın, şanın yücedir.',
    reference: 'Buhârî, Enbiyâ 10; Müslim, Salât 66',
    reviewed: false,
  },
  {
    id: 'allahumme-barik',
    categoryId: 'namaz',
    title: 'Allâhümme bârik',
    when: 'Allâhümme salli’den hemen sonra okunur.',
    arabic:
      'اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى اٰلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلٰى اِبْرَاهِيمَ وَعَلٰى اٰلِ اِبْرَاهِيمَ، اِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration:
      'Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm. İnneke hamîdün mecîd.',
    meaning:
      'Allah’ım! Muhammed’i ve Muhammed’in ailesini mübarek kıl; İbrâhim’i ve İbrâhim’in ailesini mübarek kıldığın gibi. Şüphesiz sen övülmeye lâyıksın, şanın yücedir.',
    reference: 'Buhârî, Enbiyâ 10; Müslim, Salât 66',
    reviewed: false,
  },
  {
    id: 'rabbena-atina',
    categoryId: 'namaz',
    title: 'Rabbenâ âtinâ',
    when: 'Salavatlardan sonra, selâmdan önce okunur.',
    arabic:
      'رَبَّنَٓا اٰتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْاٰخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration:
      'Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhirati haseneten ve kınâ azâben-nâr.',
    meaning:
      'Rabbimiz! Bize dünyada da iyilik ver, âhirette de iyilik ver ve bizi ateş azabından koru.',
    reference: 'Bakara sûresi, 201. âyet',
    reviewed: false,
  },
  {
    id: 'rabbenagfirli',
    categoryId: 'namaz',
    title: 'Rabbenâğfirlî',
    when: 'Rabbenâ âtinâ’dan sonra okunur.',
    arabic:
      'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliteration:
      'Rabbenâğfirlî ve li-vâlideyye ve lil-mü’minîne yevme yekûmül-hisâb.',
    meaning:
      'Rabbimiz! Hesabın görüleceği gün beni, anne babamı ve müminleri bağışla.',
    reference: 'İbrâhim sûresi, 41. âyet',
    reviewed: false,
  },
  {
    id: 'kunut-1',
    categoryId: 'namaz',
    title: 'Kunut duası — birinci',
    when: 'Vitir namazının üçüncü rekâtında, rükûdan önce okunur.',
    arabic:
      'اَللّٰهُمَّ اِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ وَنُؤْمِنُ بِكَ وَنَتُوبُ اِلَيْكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ نَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ',
    transliteration:
      'Allâhümme innâ nesteînüke ve nestağfirüke ve nestehdîke ve nü’minü bike ve netûbü ileyke ve netevekkelü aleyke ve nüsnî aleykel-hayra küllehû neşkürüke ve lâ nekfürüke ve nahleu ve netrükü men yefcüruk.',
    meaning:
      'Allah’ım! Senden yardım diler, bağışlanma diler, doğru yolu göstermeni isteriz. Sana inanır, sana tövbe eder, sana güveniriz. Bütün hayrı sana nispet ederek seni överiz. Sana şükreder, nankörlük etmeyiz. Sana karşı geleni bırakır, ondan uzaklaşırız.',
    reference: 'Beyhakî, es-Sünenü’l-kübrâ, II, 210',
    reviewed: false,
  },
  {
    id: 'kunut-2',
    categoryId: 'namaz',
    title: 'Kunut duası — ikinci',
    when: 'Birinci kunut duasından hemen sonra okunur.',
    arabic:
      'اَللّٰهُمَّ اِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَاِلَيْكَ نَسْعٰى وَنَحْفِدُ نَرْجُو رَحْمَتَكَ وَنَخْشٰى عَذَابَكَ اِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
    transliteration:
      'Allâhümme iyyâke na’büdü ve leke nusallî ve nescüdü ve ileyke nes’â ve nahfidü nercû rahmeteke ve nahşâ azâbeke inne azâbeke bil-küffâri mülhık.',
    meaning:
      'Allah’ım! Yalnız sana kulluk eder, senin için namaz kılar ve secde ederiz. Sana koşar, sana yönelir, rahmetini umar, azabından korkarız. Şüphesiz azabın inkârcılara ulaşacaktır.',
    reference: 'Beyhakî, es-Sünenü’l-kübrâ, II, 211',
    reviewed: false,
  },
  {
    id: 'ruku-secde-tesbihleri',
    categoryId: 'namaz',
    title: 'Rükû ve secde tesbihleri',
    when: 'Rükûda ve secdede üçer kez okunur.',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ ۞ سُبْحَانَ رَبِّيَ الْاَعْلٰى',
    transliteration:
      'Rükûda: Sübhâne rabbiyel-azîm. — Secdede: Sübhâne rabbiyel-a’lâ.',
    meaning:
      'Yüce Rabbimi tenzih ederim. — En yüce olan Rabbimi tenzih ederim.',
    reference: 'Ebû Dâvûd, Salât 151; Tirmizî, Salât 194',
    reviewed: false,
  },
];
