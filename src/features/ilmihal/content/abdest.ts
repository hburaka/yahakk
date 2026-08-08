import type { IlmihalTopicContent } from '../types';

/**
 * ⚠️ TASLAK — ehil biri tarafından gözden geçirilmedi (`reviewed: false`).
 *
 * Diyanet İşleri Başkanlığı İlmihali esas alınarak hazırlandı. Hanefî ve
 * Şâfiî farkları ayrı ayrı verildi; iki mezhepte abdestin farz sayısı ve
 * abdesti bozan durumlar farklıdır, tek metinle anlatmak okuyucunun bir
 * kısmına yanlış bilgi vermek olur.
 *
 * Onay gelene kadar arayüzde uyarı gösteriliyor ve konu yayına giremez.
 */
export const ABDEST: IlmihalTopicContent = {
  id: 'abdest',
  title: 'Abdestin Alınışı',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: false,

  byMadhab: {
    hanefi: [
      {
        heading: 'Abdestin farzları',
        paragraphs: [
          'Hanefî mezhebine göre abdestin farzı dörttür. Bunlardan biri eksik kalırsa abdest sahih olmaz.',
        ],
        items: [
          'Yüzü bir kez yıkamak',
          'Kolları dirseklerle birlikte bir kez yıkamak',
          'Başın dörtte birini meshetmek',
          'Ayakları topuklarla birlikte bir kez yıkamak',
        ],
      },
      {
        heading: 'Abdestin alınışı',
        paragraphs: [
          'Aşağıdaki sıra, farzların yanında sünnet ve âdâbı da içerir. Sünnetleri terk etmek abdesti bozmaz, ancak sevabını eksiltir.',
        ],
        steps: [
          {
            title: 'Niyet ve besmele',
            body: 'Kalben abdest almaya niyet edilir ve besmele çekilir.',
            ruling: 'sunnet',
          },
          {
            title: 'Elleri yıkamak',
            body: 'Eller bileklere kadar üç kez yıkanır, parmak araları ovulur.',
            ruling: 'sunnet',
          },
          {
            title: 'Ağza su vermek',
            body: 'Sağ el ile ağza üç kez su alınıp iyice çalkalanır.',
            ruling: 'sunnet',
          },
          {
            title: 'Burna su vermek',
            body: 'Sağ el ile burna üç kez su çekilir, sol el ile sümkürülür.',
            ruling: 'sunnet',
          },
          {
            title: 'Yüzü yıkamak',
            body: 'Alnın saç bittiği yerden çene altına, iki kulak yumuşağı arasına kadar olan bölge üç kez yıkanır.',
            ruling: 'farz',
          },
          {
            title: 'Kolları yıkamak',
            body: 'Önce sağ, sonra sol kol dirseklerle birlikte üç kez yıkanır. Dirsekler de yıkanan bölgeye dahildir.',
            ruling: 'farz',
          },
          {
            title: 'Başı meshetmek',
            body: 'Eller ıslatılıp başın en az dörtte biri bir kez meshedilir.',
            ruling: 'farz',
          },
          {
            title: 'Kulakları ve boynu meshetmek',
            body: 'Aynı ıslaklıkla kulakların içi ve arkası, ardından elin dışıyla boyun meshedilir.',
            ruling: 'sunnet',
          },
          {
            title: 'Ayakları yıkamak',
            body: 'Önce sağ, sonra sol ayak topuklarla birlikte üç kez yıkanır; parmak araları ovulur.',
            ruling: 'farz',
          },
        ],
      },
      {
        heading: 'Abdesti bozan durumlar',
        items: [
          'Ön veya arkadan bir şey çıkması',
          'Ağız dolusu kusmak',
          'Vücuttan kan, irin gibi bir şeyin çıkıp yayılması',
          'Yatarak veya bir yere dayanarak uyumak',
          'Bayılmak veya aklî dengeyi yitirmek',
          'Namazda sesli gülmek',
        ],
      },
    ],

    safii: [
      {
        heading: 'Abdestin farzları',
        paragraphs: [
          'Şâfiî mezhebine göre abdestin farzı altıdır. Hanefî mezhebinden farkı, niyetin ve tertibin de farz sayılmasıdır.',
        ],
        items: [
          'Niyet etmek',
          'Yüzü yıkamak',
          'Kolları dirseklerle birlikte yıkamak',
          'Başın bir kısmını meshetmek',
          'Ayakları topuklarla birlikte yıkamak',
          'Tertibe uymak, yani bu sıraya riayet etmek',
        ],
      },
      {
        heading: 'Abdestin alınışı',
        paragraphs: [
          'Şâfiî mezhebinde niyet, yüzü yıkamaya başlarken kalpte bulunmalıdır. Sıraya uymak farz olduğu için adımların yeri değiştirilemez.',
        ],
        steps: [
          {
            title: 'Besmele',
            body: 'Abdeste besmele ile başlanır.',
            ruling: 'sunnet',
          },
          {
            title: 'Elleri yıkamak',
            body: 'Eller bileklere kadar üç kez yıkanır.',
            ruling: 'sunnet',
          },
          {
            title: 'Ağza ve burna su vermek',
            body: 'Ağza ve burna üçer kez su verilir.',
            ruling: 'sunnet',
          },
          {
            title: 'Niyet ve yüzü yıkamak',
            body: 'Yüzü yıkamaya başlarken kalben abdeste niyet edilir; yüz üç kez yıkanır.',
            ruling: 'farz',
          },
          {
            title: 'Kolları yıkamak',
            body: 'Önce sağ, sonra sol kol dirseklerle birlikte üç kez yıkanır.',
            ruling: 'farz',
          },
          {
            title: 'Başı meshetmek',
            body: 'Başın bir kısmı, birkaç saç teline değecek kadar da olsa meshedilir.',
            ruling: 'farz',
          },
          {
            title: 'Kulakları meshetmek',
            body: 'Kulakların içi ve dışı meshedilir.',
            ruling: 'sunnet',
          },
          {
            title: 'Ayakları yıkamak',
            body: 'Önce sağ, sonra sol ayak topuklarla birlikte üç kez yıkanır.',
            ruling: 'farz',
          },
        ],
      },
      {
        heading: 'Abdesti bozan durumlar',
        paragraphs: [
          'Şâfiî mezhebinde abdesti bozan durumlar Hanefî mezhebinden belirgin biçimde ayrılır: kan çıkması ve kusmak abdesti bozmazken, aralarında nikâh düşen bir kişiye derinin doğrudan teması abdesti bozar.',
        ],
        items: [
          'Ön veya arkadan bir şey çıkması',
          'Aklın uyku, bayılma veya sarhoşlukla örtülmesi',
          'Aralarında nikâh düşen bir kadın ile erkeğin derilerinin birbirine değmesi',
          'Avret mahalline elin içiyle dokunmak',
        ],
      },
    ],
  },
};
