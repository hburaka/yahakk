import type { IlmihalTopicContent } from '../types';

/**
 * Gözden geçirildi ve onaylandı.
 * Diyanet İşleri Başkanlığı İlmihali esas alınmıştır.
 *
 * Hanefî ve Şâfiî farkları ayrı verildi. Gusülde farz sayısı, teyemmümde
 * tertibin hükmü ve abdesti bozan durumlar iki mezhepte ayrışıyor.
 */

export const ABDEST_BOZAN: IlmihalTopicContent = {
  id: 'abdest-bozan',
  title: 'Abdesti Bozan Durumlar',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Abdesti bozan durumlar',
        paragraphs: [
          'Aşağıdaki durumlardan biri gerçekleştiğinde abdest bozulur ve namaz için yeniden abdest alınması gerekir.',
        ],
        items: [
          'Ön veya arka yoldan bir şey çıkması',
          'Ağız dolusu kusmak',
          'Vücuttaki bir yaradan kan, irin veya sarı su çıkıp yayılması',
          'Yatarak, dayanarak veya bir yere yaslanarak uyumak',
          'Bayılmak, sarhoş olmak veya aklî dengeyi geçici olarak yitirmek',
          'Namazda sesli şekilde gülmek',
        ],
      },
      {
        heading: 'Abdesti bozmayan yaygın durumlar',
        paragraphs: [
          'Halk arasında abdesti bozduğu sanılan bazı durumlar Hanefî mezhebine göre abdesti bozmaz.',
        ],
        items: [
          'Eşe veya bir başkasına dokunmak',
          'Kan aldırmak dışında yayılmayan az miktarda kanama',
          'Oturarak, uyanıklığını koruyarak kısa süre uyuklamak',
          'Tırnak kesmek, saç veya sakal kesmek',
        ],
      },
    ],
    safii: [
      {
        heading: 'Abdesti bozan durumlar',
        paragraphs: [
          'Şâfiî mezhebinde abdesti bozan durumlar Hanefî mezhebinden belirgin biçimde ayrılır. Bu fark özellikle kan ve temas konusunda önemlidir.',
        ],
        items: [
          'Ön veya arka yoldan bir şey çıkması',
          'Uyku, bayılma veya sarhoşlukla aklın örtülmesi',
          'Aralarında nikâh düşen bir kadın ile erkeğin derilerinin doğrudan birbirine değmesi',
          'Avret mahalline elin iç kısmıyla dokunmak',
        ],
      },
      {
        heading: 'Hanefî mezhebinden farklar',
        items: [
          'Kan, irin veya sarı su çıkması abdesti bozmaz',
          'Kusmak abdesti bozmaz',
          'Namazda gülmek abdesti bozmaz, ancak namazı bozar',
          'Buna karşılık nikâh düşen kişiye temas abdesti bozar; Hanefî mezhebinde bozmaz',
        ],
      },
    ],
  },
};

export const GUSUL: IlmihalTopicContent = {
  id: 'gusul',
  title: 'Guslün Alınışı',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Gusül gerektiren haller',
        items: [
          'Cünüplük',
          'Hayız (âdet) hâlinin sona ermesi',
          'Nifas (loğusalık) hâlinin sona ermesi',
        ],
      },
      {
        heading: 'Guslün farzları',
        paragraphs: [
          'Hanefî mezhebine göre guslün farzı üçtür. Üçü de yerine getirilmezse gusül sahih olmaz.',
        ],
        items: [
          'Ağza su alıp çalkalamak',
          'Burna su çekmek',
          'Bütün bedeni kuru yer kalmayacak şekilde yıkamak',
        ],
      },
      {
        heading: 'Guslün alınışı',
        steps: [
          {
            title: 'Niyet ve besmele',
            body: 'Gusletmeye niyet edilir ve besmele çekilir.',
            ruling: 'sunnet',
          },
          {
            title: 'Elleri ve avret mahallini yıkamak',
            body: 'Eller yıkanır, ardından vücuttaki necaset temizlenir.',
            ruling: 'sunnet',
          },
          {
            title: 'Abdest almak',
            body: 'Namaz abdesti gibi abdest alınır. Ayaklar suyun biriktiği bir yerde durulmuyorsa sona bırakılabilir.',
            ruling: 'sunnet',
          },
          {
            title: 'Ağza ve burna su vermek',
            body: 'Ağza su alınıp çalkalanır, burna su çekilip temizlenir.',
            ruling: 'farz',
          },
          {
            title: 'Başa su dökmek',
            body: 'Başa üç kez su dökülür, saç diplerine ulaştığından emin olunur.',
            ruling: 'farz',
          },
          {
            title: 'Bedeni yıkamak',
            body: 'Önce sağ, sonra sol omuzdan başlayarak bütün beden üç kez yıkanır; iğne ucu kadar kuru yer bırakılmaz.',
            ruling: 'farz',
          },
        ],
      },
      {
        heading: 'Dikkat edilecekler',
        items: [
          'Takı, yüzük gibi suyun altına geçmesini engelleyen şeyler oynatılmalıdır',
          'Ojeli tırnak ve suyu geçirmeyen tabakalar gusle engeldir',
          'Saçın örülü olması hâlinde suyun diplere ulaşması yeterlidir',
        ],
      },
    ],
    safii: [
      {
        heading: 'Gusül gerektiren haller',
        items: [
          'Cünüplük',
          'Hayız (âdet) hâlinin sona ermesi',
          'Nifas (loğusalık) hâlinin sona ermesi',
        ],
      },
      {
        heading: 'Guslün farzları',
        paragraphs: [
          'Şâfiî mezhebine göre guslün farzı ikidir. Hanefî mezhebinden farkı, niyetin farz, ağza ve burna su vermenin ise sünnet sayılmasıdır.',
        ],
        items: [
          'Niyet etmek',
          'Bütün bedeni kuru yer kalmayacak şekilde yıkamak',
        ],
      },
      {
        heading: 'Guslün alınışı',
        steps: [
          {
            title: 'Besmele',
            body: 'Gusle besmele ile başlanır.',
            ruling: 'sunnet',
          },
          {
            title: 'Elleri ve avret mahallini yıkamak',
            body: 'Eller yıkanır, vücuttaki necaset temizlenir.',
            ruling: 'sunnet',
          },
          {
            title: 'Abdest almak',
            body: 'Namaz abdesti gibi abdest alınır.',
            ruling: 'sunnet',
          },
          {
            title: 'Niyet ve bedeni yıkamaya başlamak',
            body: 'Bedeni yıkamaya başlarken kalben gusle niyet edilir.',
            ruling: 'farz',
          },
          {
            title: 'Bütün bedeni yıkamak',
            body: 'Başından ayağına, kuru yer kalmayacak şekilde bütün beden yıkanır. Saç diplerine suyun ulaşması gerekir.',
            ruling: 'farz',
          },
        ],
      },
    ],
  },
};

export const TEYEMMUM: IlmihalTopicContent = {
  id: 'teyemmum',
  title: 'Teyemmüm',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Teyemmüm ne zaman yapılır',
        paragraphs: [
          'Teyemmüm, su bulunamadığında veya suyu kullanmak mümkün olmadığında abdest ve gusül yerine geçen temizliktir.',
        ],
        items: [
          'Su bulunmaması veya bulmak için tehlikeye girilmesi',
          'Hastalık sebebiyle suyun zarar verecek olması',
          'Suyun namaz vakti çıkacak kadar uzakta olması',
          'Suyun içme ihtiyacı için saklanması gerekmesi',
        ],
      },
      {
        heading: 'Teyemmümün farzları',
        paragraphs: [
          'Hanefî mezhebine göre teyemmümün farzı ikidir.',
        ],
        items: [
          'Niyet etmek',
          'İki darb: elleri toprağa vurup önce yüzü, sonra kolları meshetmek',
        ],
      },
      {
        heading: 'Teyemmümün yapılışı',
        steps: [
          {
            title: 'Niyet',
            body: 'Abdest veya gusül yerine teyemmüme niyet edilir.',
            ruling: 'farz',
          },
          {
            title: 'Birinci darb ve yüzü meshetmek',
            body: 'İki el temiz toprağa veya toprak cinsinden bir yüzeye vurulur, fazlası silkelenir ve bütün yüz meshedilir.',
            ruling: 'farz',
          },
          {
            title: 'İkinci darb ve kolları meshetmek',
            body: 'Eller tekrar toprağa vurulur; önce sağ kol dirsekle birlikte, sonra sol kol meshedilir.',
            ruling: 'farz',
          },
        ],
      },
      {
        heading: 'Teyemmümü bozan durumlar',
        items: [
          'Abdesti bozan her şey teyemmümü de bozar',
          'Suyun bulunması veya kullanılabilir hâle gelmesi',
        ],
      },
    ],
    safii: [
      {
        heading: 'Teyemmüm ne zaman yapılır',
        items: [
          'Su bulunmaması',
          'Hastalık veya yaranın suyla temastan zarar görecek olması',
          'Suyun ancak içmek için yetecek kadar olması',
        ],
      },
      {
        heading: 'Teyemmümün farzları',
        paragraphs: [
          'Şâfiî mezhebinde tertip, yani yüzden sonra kolların meshedilmesi sırası farzdır.',
        ],
        items: [
          'Niyet etmek',
          'Yüzü meshetmek',
          'Kolları dirseklerle birlikte meshetmek',
          'Tertibe uymak',
        ],
      },
      {
        heading: 'Önemli fark',
        paragraphs: [
          'Şâfiî mezhebinde teyemmüm her farz namaz için yenilenir; tek teyemmümle birden fazla farz namaz kılınmaz. Nafile namazlar için bu şart aranmaz.',
        ],
      },
    ],
  },
};
