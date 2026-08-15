import type { IlmihalTopicContent } from '../types';

/**
 * Gözden geçirildi ve onaylandı.
 * Diyanet İşleri Başkanlığı İlmihali esas alınmıştır.
 *
 * Namazın farzları iki mezhepte de aynı sayıda sıralanır ama içerikte
 * ayrışma vardır: Hanefî mezhebinde Fâtiha okumak vaciptir, Şâfiî
 * mezhebinde her rekâtta farzdır. Bu fark tek metinle anlatılamaz.
 */

export const NAMAZIN_FARZLARI: IlmihalTopicContent = {
  id: 'namazin-farzlari',
  title: 'Namazın Farzları',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Namazın dışındaki farzlar (şartlar)',
        paragraphs: [
          'Bunlar namaza başlamadan önce yerine getirilmesi gereken şartlardır.',
        ],
        items: [
          'Hadesten tahâret: abdestli olmak, gerekiyorsa gusletmiş olmak',
          'Necâsetten tahâret: bedenin, elbisenin ve namaz kılınan yerin temiz olması',
          'Setr-i avret: örtülmesi gereken yerlerin örtülü olması',
          'İstikbâl-i kıble: kıbleye yönelmek',
          'Vakit: namazın vaktinin girmiş olması',
          'Niyet: hangi namazı kıldığını kalben belirlemek',
        ],
      },
      {
        heading: 'Namazın içindeki farzlar (rükünler)',
        items: [
          'İftitah tekbiri: "Allâhu ekber" diyerek namaza başlamak',
          'Kıyam: gücü yetenin ayakta durması',
          'Kıraat: Kur’an’dan okumak',
          'Rükû: eğilmek',
          'Secde: alnı ve burnu yere koymak',
          'Ka‘de-i ahîre: son oturuşta Tahiyyat okuyacak kadar oturmak',
        ],
      },
      {
        heading: 'Hanefî mezhebine özgü nokta',
        paragraphs: [
          'Hanefî mezhebinde Fâtiha sûresini okumak farz değil vaciptir. Terk edilirse namaz bozulmaz, ancak sehiv secdesi gerekir. Kıraat farzının yerine gelmesi için Kur’an’dan bir miktar okumak yeterlidir.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Namazın şartları',
        items: [
          'Abdestli olmak, gerekiyorsa gusletmiş olmak',
          'Beden, elbise ve namaz kılınan yerin temiz olması',
          'Avret yerlerinin örtülü olması',
          'Kıbleye yönelmek',
          'Namaz vaktinin girmiş olması',
        ],
      },
      {
        heading: 'Namazın rükünleri',
        paragraphs: [
          'Şâfiî mezhebinde rükünler daha ayrıntılı sayılır; her rekâtta Fâtiha okumak ve tümâninet (her rükünde bir süre sükûnet) farzdır.',
        ],
        items: [
          'Niyet',
          'İftitah tekbiri',
          'Gücü yetenin ayakta durması',
          'Her rekâtta Fâtiha sûresini okumak',
          'Rükû ve rükûda tümâninet',
          'Rükûdan doğrulmak ve doğrulmuş hâlde durmak',
          'İki secde ve secdede tümâninet',
          'İki secde arasında oturmak',
          'Son oturuş ve Tahiyyat okumak',
          'Peygamber Efendimiz’e salavat getirmek',
          'Selam vermek',
          'Rükünleri sırasıyla yapmak (tertip)',
        ],
      },
      {
        heading: 'Hanefî mezhebinden fark',
        paragraphs: [
          'Şâfiî mezhebinde Fâtiha her rekâtta farzdır; okunmazsa o rekât sahih olmaz. Ayrıca imama uyan kişi de Fâtiha’yı kendisi okur.',
        ],
      },
    ],
  },
};

export const NAMAZIN_KILINISI: IlmihalTopicContent = {
  id: 'namazin-kilinisi',
  title: 'Namazın Kılınışı',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'İki rekâtlı namazın kılınışı',
        paragraphs: [
          'Aşağıda sabah namazının farzı örnek alınmıştır. Diğer namazlar rekât sayısı ve okunanlar dışında aynı düzende kılınır.',
        ],
        steps: [
          {
            title: 'Niyet',
            body: 'Kıbleye dönülür ve hangi namazın kılınacağı kalben belirlenir.',
            ruling: 'farz',
          },
          {
            title: 'İftitah tekbiri',
            body: 'Eller kulak hizasına kaldırılıp "Allâhu ekber" denir. Erkekler ellerini göbek altında, kadınlar göğüs üzerinde bağlar.',
            ruling: 'farz',
          },
          {
            title: 'Sübhâneke',
            body: 'Sübhâneke duası okunur.',
            ruling: 'sunnet',
          },
          {
            title: 'Eûzü besmele ve Fâtiha',
            body: 'Eûzü besmele çekilir, Fâtiha sûresi okunur.',
            ruling: 'vacip',
          },
          {
            title: 'Zamm-ı sûre',
            body: 'Fâtiha’dan sonra Kur’an’dan bir sûre veya en az üç âyet okunur.',
            ruling: 'vacip',
          },
          {
            title: 'Rükû',
            body: '"Allâhu ekber" denip eğilinir, eller dizleri kavrar, sırt düz tutulur. Üç kez "Sübhâne rabbiye’l-azîm" denir.',
            ruling: 'farz',
          },
          {
            title: 'Kıyama doğrulmak',
            body: '"Semiallâhu limen hamideh" denerek doğrulunur, ardından "Rabbenâ leke’l-hamd" denir.',
            ruling: 'vacip',
          },
          {
            title: 'Birinci secde',
            body: '"Allâhu ekber" denip secdeye varılır; alın, burun, iki el, iki diz ve ayak parmakları yere değer. Üç kez "Sübhâne rabbiye’l-a‘lâ" denir.',
            ruling: 'farz',
          },
          {
            title: 'İki secde arası oturuş',
            body: '"Allâhu ekber" denip doğrulup bir süre oturulur.',
            ruling: 'vacip',
          },
          {
            title: 'İkinci secde',
            body: 'Aynı şekilde ikinci secde yapılır.',
            ruling: 'farz',
          },
          {
            title: 'İkinci rekât',
            body: '"Allâhu ekber" denip ayağa kalkılır. Sübhâneke ve eûzü okunmaz; besmele, Fâtiha ve zamm-ı sûre ile devam edilir, rükû ve secdeler tekrarlanır.',
            ruling: 'farz',
          },
          {
            title: 'Son oturuş',
            body: 'İkinci secdeden sonra oturulur; Tahiyyat, Allâhümme salli, Allâhümme bârik ve Rabbenâ duaları okunur.',
            ruling: 'farz',
          },
          {
            title: 'Selam',
            body: 'Önce sağa, sonra sola "Esselâmü aleyküm ve rahmetullâh" denilerek selam verilir.',
            ruling: 'vacip',
          },
        ],
      },
      {
        heading: 'Üç ve dört rekâtlı namazlar',
        items: [
          'Üçüncü ve dördüncü rekâtlarda farz namazlarda yalnız Fâtiha okunur, zamm-ı sûre okunmaz',
          'Sünnet namazlarda her rekâtta Fâtiha ve zamm-ı sûre okunur',
          'Üç ve dört rekâtlı namazlarda ikinci rekâtın sonunda oturulur ve yalnız Tahiyyat okunur',
        ],
      },
    ],
    safii: [
      {
        heading: 'İki rekâtlı namazın kılınışı',
        paragraphs: [
          'Şâfiî mezhebinde niyet iftitah tekbiriyle birlikte bulunmalı, Fâtiha her rekâtta okunmalı ve her rükünde tümâninet gözetilmelidir.',
        ],
        steps: [
          {
            title: 'Niyet ve iftitah tekbiri',
            body: 'Eller kulak hizasına kaldırılır, "Allâhu ekber" denir ve niyet tekbirle birlikte kalpte bulunur. Eller göğüs altında bağlanır.',
            ruling: 'farz',
          },
          {
            title: 'Sübhâneke',
            body: 'İftitah duası okunur.',
            ruling: 'sunnet',
          },
          {
            title: 'Fâtiha',
            body: 'Besmele Fâtiha’dan bir âyet sayılır ve sesli namazlarda sesli okunur. Fâtiha her rekâtta farzdır.',
            ruling: 'farz',
          },
          {
            title: 'Zamm-ı sûre',
            body: 'İlk iki rekâtta Fâtiha’dan sonra bir sûre okunur.',
            ruling: 'sunnet',
          },
          {
            title: 'Rükû ve tümâninet',
            body: 'Eğilinir ve bir süre sükûnetle beklenir. Acele edilerek geçilirse rükün yerine gelmez.',
            ruling: 'farz',
          },
          {
            title: 'İ‘tidâl',
            body: 'Rükûdan doğrulunur ve doğrulmuş hâlde bir süre durulur.',
            ruling: 'farz',
          },
          {
            title: 'İki secde ve aralarındaki oturuş',
            body: 'Her secdede ve iki secde arasındaki oturuşta tümâninet gözetilir.',
            ruling: 'farz',
          },
          {
            title: 'İkinci rekât',
            body: 'Kalkılır, Fâtiha tekrar okunur ve rükünler tekrarlanır.',
            ruling: 'farz',
          },
          {
            title: 'Son oturuş, Tahiyyat ve salavat',
            body: 'Tahiyyat okunur, ardından Peygamber Efendimiz’e salavat getirilir. Salavat Şâfiî mezhebinde farzdır.',
            ruling: 'farz',
          },
          {
            title: 'Selam',
            body: 'Sağa selam verilir; sola selam sünnettir.',
            ruling: 'farz',
          },
        ],
      },
      {
        heading: 'Cemaatle kılarken',
        paragraphs: [
          'Şâfiî mezhebinde imama uyan kişi de Fâtiha’yı kendisi okur. Sesli namazlarda imam Fâtiha’yı okurken cemaat dinler, imam bitirince kendi Fâtiha’sını okur.',
        ],
      },
    ],
  },
};

export const NAMAZI_BOZANLAR: IlmihalTopicContent = {
  id: 'namazi-bozanlar',
  title: 'Namazı Bozan Durumlar',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Namazı bozan durumlar',
        paragraphs: [
          'Aşağıdaki durumlar namazı bozar; namaz yeniden kılınır.',
        ],
        items: [
          'Konuşmak, az bir kelime de olsa',
          'Bir şey yiyip içmek',
          'Sesli gülmek',
          'Abdestin bozulması',
          'Göğsü kıbleden çevirmek',
          'Namazla ilgisi olmayan çok hareket etmek (amel-i kesir)',
          'Selam vermek veya selam almak',
          'Kur’an’ı anlamı bozulacak şekilde yanlış okumak',
          'Özürsüz olarak bir rüknü terk etmek',
        ],
      },
      {
        heading: 'Gülmek meselesi',
        paragraphs: [
          'Hanefî mezhebinde namazda sesli gülmek hem namazı hem abdesti bozar; namaz yeniden abdest alınarak kılınır. Yalnızca kendisinin duyacağı kadar gülümsemek (tebessüm) namazı bozmaz.',
        ],
      },
      {
        heading: 'Namazı bozmayan durumlar',
        items: [
          'Öksürmek, aksırmak, esnemek gibi elde olmayan sesler',
          'Sivrisinek kovmak gibi az hareket',
          'Gözle etrafa bakmak (mekruh olmakla birlikte namazı bozmaz)',
          'Yanlışlıkla bir vacibi terk edip sehiv secdesiyle telafi etmek',
        ],
      },
      {
        heading: 'Şüpheye düşülürse',
        paragraphs: [
          'Kaç rekât kılındığında şüpheye düşülürse ve bu ilk kez oluyorsa namaz yeniden kılınır. Sık sık oluyorsa galip kanaate göre hareket edilir ve sonunda sehiv secdesi yapılır.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Namazı bozan durumlar',
        items: [
          'Kasten konuşmak (iki harften fazla)',
          'Bir şey yiyip içmek',
          'Peş peşe üç hareket yapmak',
          'Abdestin bozulması',
          'Namazdan çıkmaya niyet etmek veya niyeti bozmak',
          'Avret yerinin açılması ve hemen örtülmemesi',
          'Beden veya elbiseye necaset bulaşması',
          'Göğsü kıbleden çevirmek',
          'Kasten bir rükün eklemek',
        ],
      },
      {
        heading: 'Gülmek meselesi',
        paragraphs: [
          'Şâfiî mezhebinde gülmek namazı bozar ancak abdesti bozmaz. Bu, Hanefî mezhebinden önemli bir farktır: namaz aynı abdestle yeniden kılınabilir.',
        ],
      },
      {
        heading: 'Namazı bozmayan durumlar',
        items: [
          'Elde olmayan öksürük, aksırık ve esneme',
          'İki harften az istemsiz ses',
          'Az ve dağınık hareketler',
          'Unutarak yapılan ve sehiv secdesiyle telafi edilen eksiklikler',
        ],
      },
      {
        heading: 'Şüpheye düşülürse',
        paragraphs: [
          'Şâfiî mezhebinde rekât sayısında şüpheye düşülürse az olan esas alınır, eksik kalan rekât tamamlanır ve sonunda sehiv secdesi yapılır. Kanaate göre hareket edilmez.',
        ],
      },
    ],
  },
};
