import type { Dua } from '../types';

/**
 * Gözden geçirildi ve onaylandı.
 *
 * Yemek duaları. Kısa ve günde birkaç kez okunan metinler; uzun
 * kategorilerden önce yazılmalarının sebebi bu.
 */

export const YEMEK_DUALARI: readonly Dua[] = [
  {
    id: 'yemek-oncesi',
    categoryId: 'yemek',
    title: 'Yemekten önce',
    when: 'Sofraya oturunca, ilk lokmadan önce.',
    arabic:
      'اَللّٰهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ ۞ بِسْمِ اللّٰهِ',
    transliteration:
      'Allâhümme bârik lenâ fîmâ razaktenâ ve kınâ azâben-nâr. Bismillâh.',
    meaning:
      'Allah’ım! Bize verdiğin rızkı bereketli kıl ve bizi ateş azabından koru. Allah’ın adıyla.',
    reference: 'İbn Mâce, Et’ime 16',
    reviewed: true,
  },
  {
    id: 'besmele-unutulunca',
    categoryId: 'yemek',
    title: 'Besmele unutulunca',
    when: 'Yemeğe başlarken besmele çekmeyi unutup sonradan hatırlayınca.',
    arabic: 'بِسْمِ اللّٰهِ اَوَّلَهُ وَاٰخِرَهُ',
    transliteration: 'Bismillâhi evvelehû ve âhirah.',
    meaning: 'Başında da sonunda da Allah’ın adıyla.',
    reference: 'Ebû Dâvûd, Et’ime 15; Tirmizî, Et’ime 47',
    reviewed: true,
  },
  {
    id: 'yemek-sonrasi',
    categoryId: 'yemek',
    title: 'Yemekten sonra',
    when: 'Sofradan kalkarken.',
    arabic:
      'اَلْحَمْدُ لِلّٰهِ الَّذِٓي اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration:
      'Elhamdü lillâhillezî et’amenâ ve sekânâ ve cealenâ müslimîn.',
    meaning:
      'Bizi yediren, içiren ve Müslümanlardan kılan Allah’a hamdolsun.',
    reference: 'Ebû Dâvûd, Et’ime 52; Tirmizî, Deavât 56',
    reviewed: true,
  },
  {
    id: 'ev-sahibine-dua',
    categoryId: 'yemek',
    title: 'Ev sahibine dua',
    when: 'Misafir olarak yenen yemekten sonra, sofra sahibi için.',
    arabic:
      'اَللّٰهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ',
    transliteration:
      'Allâhümme bârik lehüm fîmâ razaktehüm vağfir lehüm verhamhüm.',
    meaning:
      'Allah’ım! Onlara verdiğin rızkı bereketli kıl, onları bağışla ve onlara merhamet et.',
    reference: 'Müslim, Eşribe 146',
    reviewed: true,
  },
];
