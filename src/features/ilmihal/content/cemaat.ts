import type { IlmihalTopicContent } from '../types';

/**
 * Gözden geçirildi ve onaylandı.
 * Diyanet İşleri Başkanlığı İlmihali esas alınmıştır.
 *
 * Cemaatle kılınan namazlar. Dört konuda da mezhep farkı yüzeysel değil,
 * doğrudan kılınışı değiştiriyor: cemaatte Fâtiha, cumada cemaat sayısı,
 * bayramda tekbir sayısı, cenazede Fâtiha'nın hükmü.
 */

export const CEMAAT: IlmihalTopicContent = {
  id: 'cemaat',
  title: 'Cemaatle Namaz',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hükmü ve fazileti',
        paragraphs: [
          'Cemaatle namaz, ergenlik çağına gelmiş, sağlıklı ve hür erkekler için farz namazlarda sünnet-i müekkededir. Cuma namazı bunun dışındadır; onda cemaat namazın geçerlilik şartıdır.',
          'Hz. Peygamber cemaatle kılınan namazın tek başına kılınandan yirmi yedi derece üstün olduğunu bildirmiştir.',
        ],
      },
      {
        heading: 'İmama uymak',
        items: [
          'Cemaate katılırken imama uymaya niyet edilir',
          'İmamdan önce rükûya veya secdeye gidilmez, imamla birlikte veya hemen ardından hareket edilir',
          'İmamla aynı namazı kılmak gerekir',
        ],
      },
      {
        heading: 'Cemaat Fâtiha okur mu',
        paragraphs: [
          'Hanefî mezhebinde imama uyan kişi Fâtiha ve zamm-ı sûre okumaz. "İmamın okuması, kendisine uyanın da okumasıdır" esası geçerlidir.',
          'İmamın sesli okuduğu namazlarda (sabah, akşam, yatsının ilk iki rekâtı, cuma, bayram) cemaat susup dinler. İmamın içinden okuduğu namazlarda da cemaat okumaz, sessizce bekler.',
        ],
      },
      {
        heading: 'İmama sonradan yetişmek',
        paragraphs: [
          'İmama namazın başında yetişemeyen kişiye mesbûk denir. Mesbûk imamla birlikte selam vermez; imam selam verdikten sonra ayağa kalkıp yetişemediği rekâtları tek başına tamamlar.',
        ],
        items: [
          'Kaçırdığı rekâtları okuma bakımından namazın ilk rekâtları gibi kılar; Fâtiha ve zamm-ı sûre okur',
          'Oturuş bakımından ise namazın son rekâtları gibi sayar',
          'İmama rükûda yetişen kişi o rekâtı almış olur',
          'İmam secdedeyken yetişilirse o rekât kaçmış sayılır, yine de imama uyulur',
        ],
      },
      {
        heading: 'Safların düzeni',
        items: [
          'Saflar önden doldurulur, aralarda boşluk bırakılmaz',
          'Tek kişi cemaat ise imamın sağında, hizasından biraz geride durur',
          'İki ve daha fazla kişi imamın arkasında saf tutar',
          'Öne geçmek için Kur’an’ı en iyi bilen ve okuyan tercih edilir',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hükmü ve fazileti',
        paragraphs: [
          'Şâfiî mezhebinde cemaatle namaz, farz namazlar için erkeklere farz-ı kifâyedir; bir beldede yeterli sayıda kişi cemaatle kılarsa diğerlerinden sorumluluk kalkar. Bireysel olarak sünnet-i müekkede sayılır.',
          'Cemaatle kılınan namazın tek başına kılınandan yirmi yedi derece üstün olduğu bildirilmiştir.',
        ],
      },
      {
        heading: 'Cemaat Fâtiha okur mu',
        paragraphs: [
          'Bu, Hanefî mezhebinden en belirgin ayrılıktır. Şâfiî mezhebinde Fâtiha her rekâtta ve herkese farzdır; imamın okuması cemaatten bu yükümlülüğü düşürmez. İmama uyan kişi Fâtiha’yı kendisi okur.',
        ],
        items: [
          'İmamın içinden okuduğu namazlarda cemaat Fâtiha’yı kendi okur',
          'İmamın sesli okuduğu namazlarda, imam Fâtiha’yı bitirip sûreye geçtiğinde cemaat kendi Fâtiha’sını okur',
          'Zamm-ı sûre okumak cemaate gerekmez',
        ],
      },
      {
        heading: 'İmama uymak',
        items: [
          'İmama uymaya niyet edilir',
          'İmamdan önce hareket edilmez',
          'Cemaatin imamın bulunduğu yeri veya arkasındaki safları görebilmesi ya da sesini duyabilmesi gerekir',
        ],
      },
      {
        heading: 'İmama sonradan yetişmek',
        paragraphs: [
          'İmama rükûda yetişen kişi o rekâtı almış sayılır ve o rekât için Fâtiha yükümlülüğü kendisinden düşer.',
          'Kıyamda yetişip Fâtiha’yı bitiremeden imam rükûya giderse, kişi mazur sayılır; imamı takip eder, o rekât geçerlidir.',
        ],
      },
      {
        heading: 'Safların düzeni',
        items: [
          'Saflar önden doldurulur, aralar boş bırakılmaz',
          'Tek kişi cemaat ise imamın sağında durur',
          'İki ve daha fazla kişi imamın arkasında saf tutar',
        ],
      },
    ],
  },
};

export const CUMA: IlmihalTopicContent = {
  id: 'cuma',
  title: 'Cuma Namazı',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Cuma namazı, şartlarını taşıyanlara farz-ı ayndır ve o günün öğle namazı yerine geçer. Cuma kılan kişi ayrıca öğle namazı kılmaz.',
        ],
      },
      {
        heading: 'Kimlere farzdır',
        items: [
          'Erkek olmak',
          'Hür olmak',
          'Mukim olmak, yani seferî olmamak',
          'Sağlıklı olmak; cuma namazına gitmeye engel bir hastalığı bulunmamak',
          'Âkil ve bâliğ olmak',
        ],
      },
      {
        heading: 'Kimlere farz değildir',
        paragraphs: [
          'Kadınlara, yolculuk hâlindekilere ve hastalara cuma farz değildir. Ancak kılarlarsa namazları geçerlidir ve o günün öğle namazı yerine geçer.',
        ],
      },
      {
        heading: 'Namazın geçerlilik şartları',
        items: [
          'Öğle vakti içinde kılınması',
          'Namazdan önce hutbe okunması',
          'Cemaat bulunması: imam dışında en az üç kişi',
          'İzn-i âmm, yani herkese açık olması; kapıların kapatılmaması',
          'Şehir veya şehir hükmündeki bir yerde kılınması',
        ],
      },
      {
        heading: 'Kılınışı',
        steps: [
          {
            title: 'İlk sünnet',
            body: 'Dört rekât cuma namazının ilk sünneti kılınır.',
            ruling: 'sunnet',
          },
          {
            title: 'Hutbe',
            body: 'İmam hutbeyi okur. Hutbe sırasında konuşulmaz, namaz kılınmaz; hutbeyi dinlemek vaciptir.',
            ruling: 'farz',
          },
          {
            title: 'Farz',
            body: 'İki rekât cuma namazının farzı cemaatle kılınır. İmam Fâtiha ve sûreyi sesli okur.',
            ruling: 'farz',
          },
          {
            title: 'Son sünnet',
            body: 'Dört rekât cuma namazının son sünneti kılınır.',
            ruling: 'sunnet',
          },
        ],
      },
      {
        heading: 'Zuhr-i âhir hakkında',
        paragraphs: [
          'Türkiye’de son sünnetten sonra "zuhr-i âhir" adıyla dört rekât ve ardından iki rekât daha kılınması yaygındır. Bu, cumanın geçerlilik şartlarında bir eksiklik ihtimaline karşı ihtiyaten yapılan bir uygulamadır; namazın kendisinden sayılmaz. Bu konuda görüş ayrılığı vardır, bölgenizdeki uygulamayı müftülüğe danışabilirsiniz.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Cuma namazı şartlarını taşıyanlara farz-ı ayndır ve o günün öğle namazı yerine geçer.',
        ],
      },
      {
        heading: 'Kimlere farzdır',
        items: [
          'Erkek olmak',
          'Hür olmak',
          'Mukim olmak',
          'Sağlıklı olmak',
          'Âkil ve bâliğ olmak',
        ],
      },
      {
        heading: 'Namazın geçerlilik şartları',
        paragraphs: [
          'Cemaat sayısı Hanefî mezhebinden en belirgin farktır.',
        ],
        items: [
          'Öğle vakti içinde kılınması',
          'Cemaatte, imam dâhil en az kırk kişinin bulunması; bu kişilerin mukim, hür, erkek ve bâliğ olması',
          'Namazdan önce iki hutbe okunması',
          'Yerleşim yerinde kılınması',
          'Zaruret olmadıkça aynı beldede birden fazla yerde cuma kılınmaması',
        ],
      },
      {
        heading: 'Hutbenin rükünleri',
        paragraphs: [
          'Şâfiî mezhebinde hutbenin belirli rükünleri vardır; bunlar eksik olursa cuma sahih olmaz.',
        ],
        items: [
          'Her iki hutbede Allah’a hamd etmek',
          'Her iki hutbede Peygamber’e salavat getirmek',
          'Her iki hutbede takvayı tavsiye etmek',
          'Hutbelerden birinde bir âyet okumak',
          'İkinci hutbede müminlere dua etmek',
        ],
      },
      {
        heading: 'Kılınışı',
        steps: [
          {
            title: 'İlk sünnet',
            body: 'Cuma namazının sünneti kılınır.',
            ruling: 'sunnet',
          },
          {
            title: 'İki hutbe',
            body: 'İmam iki hutbe okur, arasında kısa süre oturur. Hutbeyi dinlemek gerekir.',
            ruling: 'farz',
          },
          {
            title: 'Farz',
            body: 'İki rekât farz cemaatle kılınır. Cemaat Fâtiha’yı kendisi okur.',
            ruling: 'farz',
          },
          {
            title: 'Son sünnet',
            body: 'Cuma namazının son sünneti kılınır.',
            ruling: 'sunnet',
          },
        ],
      },
    ],
  },
};

export const BAYRAM: IlmihalTopicContent = {
  id: 'bayram',
  title: 'Bayram Namazı',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hükmü ve vakti',
        paragraphs: [
          'Bayram namazı, cuma namazı kendisine farz olan kişilere vaciptir.',
          'Vakti, güneşin doğup bir mızrak boyu yükselmesinden (kerahet vakti çıktıktan sonra) zevale, yani öğle vaktinin girmesine kadar olan süredir. Bayram namazı için ezan ve kamet okunmaz.',
        ],
      },
      {
        heading: 'Kılınışı',
        paragraphs: [
          'İki rekâttır. Her rekâtta fazladan üçer tekbir vardır; bunlara zevâid tekbirler denir.',
        ],
        steps: [
          {
            title: 'Niyet ve iftitah tekbiri',
            body: 'Bayram namazına niyet edilir, iftitah tekbiri alınır ve Sübhâneke okunur.',
            ruling: 'farz',
          },
          {
            title: 'Birinci rekâtta üç tekbir',
            body: 'Eller kulak hizasına kaldırılıp "Allahü ekber" denir ve yanlara salınır. Bu üç kez tekrarlanır; üçüncü tekbirden sonra eller bağlanır.',
            ruling: 'vacip',
          },
          {
            title: 'Kıraat ve rükû',
            body: 'Eûzü besmele çekilip Fâtiha ve bir sûre okunur, ardından rükû ve secdeler yapılır.',
            ruling: 'farz',
          },
          {
            title: 'İkinci rekâtta kıraat',
            body: 'İkinci rekâta kalkılır, doğrudan Fâtiha ve bir sûre okunur.',
            ruling: 'farz',
          },
          {
            title: 'İkinci rekâtta üç tekbir',
            body: 'Kıraatten sonra eller kaldırılarak üç tekbir alınır ve yanlara salınır. Dördüncü tekbirde eller kaldırılmadan rükûya gidilir.',
            ruling: 'vacip',
          },
          {
            title: 'Selam ve hutbe',
            body: 'Namaz tamamlanıp selam verilir. Hutbe namazdan sonra okunur ve dinlenmesi sünnettir.',
            ruling: 'sunnet',
          },
        ],
      },
      {
        heading: 'Teşrik tekbirleri',
        paragraphs: [
          'Kurban Bayramı’nda arefe günü sabah namazından bayramın dördüncü günü ikindi namazına kadar, farz namazlardan sonra bir kez teşrik tekbiri getirmek vaciptir. Toplam yirmi üç vakit namazın ardından getirilir.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hükmü ve vakti',
        paragraphs: [
          'Şâfiî mezhebinde bayram namazı sünnet-i müekkededir. Hanefî mezhebinde vacip sayılması yönüyle ayrılır.',
          'Cemaatle kılınması sünnettir ancak şart değildir; tek başına da kılınabilir. Vakti güneşin doğmasından zevale kadardır.',
        ],
      },
      {
        heading: 'Kılınışı',
        paragraphs: [
          'İki rekâttır. Zevâid tekbirlerin sayısı Hanefî mezhebinden farklıdır: birinci rekâtta yedi, ikinci rekâtta beş tekbir alınır.',
        ],
        steps: [
          {
            title: 'Niyet ve iftitah tekbiri',
            body: 'Bayram namazına niyet edilir, iftitah tekbiri alınır ve Sübhâneke okunur.',
            ruling: 'farz',
          },
          {
            title: 'Birinci rekâtta yedi tekbir',
            body: 'İftitah tekbirinden ayrı olarak yedi tekbir alınır. Tekbirler arasında zikir okunması müstehaptır.',
            ruling: 'sunnet',
          },
          {
            title: 'Kıraat ve rükû',
            body: 'Fâtiha ve bir sûre okunur, rükû ve secdeler yapılır.',
            ruling: 'farz',
          },
          {
            title: 'İkinci rekâtta beş tekbir',
            body: 'İkinci rekâta kalkıldığında, kıyam tekbiri dışında beş tekbir alınır.',
            ruling: 'sunnet',
          },
          {
            title: 'Kıraat ve tamamlama',
            body: 'Fâtiha ve bir sûre okunur, namaz tamamlanıp selam verilir.',
            ruling: 'farz',
          },
          {
            title: 'Hutbe',
            body: 'Hutbe namazdan sonra okunur; dinlenmesi sünnettir.',
            ruling: 'sunnet',
          },
        ],
      },
    ],
  },
};

export const CENAZE: IlmihalTopicContent = {
  id: 'cenaze',
  title: 'Cenaze Namazı',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Cenaze namazı farz-ı kifâyedir. Cemaatten bir kısmı kılarsa diğerlerinden sorumluluk kalkar; hiç kimse kılmazsa herkes sorumlu olur.',
        ],
      },
      {
        heading: 'Şartları',
        items: [
          'Ölünün Müslüman olması',
          'Ölünün yıkanmış ve kefenlenmiş olması',
          'Cenazenin namazı kılanların önünde bulunması',
          'Namazı kılanların abdestli olması ve kıbleye yönelmesi',
          'Niyet edilmesi',
        ],
      },
      {
        heading: 'Rükünleri',
        paragraphs: [
          'Cenaze namazının rüknü ikidir: ayakta durmak (kıyam) ve dört tekbir almak. Rükû, secde ve oturuş yoktur.',
        ],
      },
      {
        heading: 'Kılınışı',
        steps: [
          {
            title: 'Niyet ve birinci tekbir',
            body: 'Cenaze namazını kılmaya ve imama uymaya niyet edilir. Eller kaldırılıp tekbir alınır ve bağlanır. Sübhâneke okunur; "ve celle senâüke" ilavesi de eklenir.',
            ruling: 'farz',
          },
          {
            title: 'İkinci tekbir',
            body: 'Eller kaldırılmadan tekbir alınır. Allâhümme salli ve Allâhümme bârik duaları okunur.',
            ruling: 'farz',
          },
          {
            title: 'Üçüncü tekbir',
            body: 'Eller kaldırılmadan tekbir alınır. Cenaze duası okunur; bilinmiyorsa ölü için dua edilir.',
            ruling: 'farz',
          },
          {
            title: 'Dördüncü tekbir ve selam',
            body: 'Eller kaldırılmadan tekbir alınır, bir şey okunmadan önce sağa sonra sola selam verilir.',
            ruling: 'farz',
          },
        ],
      },
      {
        heading: 'Fâtiha okunur mu',
        paragraphs: [
          'Hanefî mezhebinde cenaze namazında Fâtiha kıraat niyetiyle okunmaz. Dua kastıyla okunabileceği görüşü de vardır.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Cenaze namazı farz-ı kifâyedir.',
        ],
      },
      {
        heading: 'Rükünleri',
        paragraphs: [
          'Şâfiî mezhebinde cenaze namazının rüknü yedidir. Fâtiha okumanın rükün sayılması, Hanefî mezhebinden temel farktır.',
        ],
        items: [
          'Niyet etmek',
          'Ayakta durmak',
          'Dört tekbir almak',
          'Birinci tekbirden sonra Fâtiha okumak',
          'İkinci tekbirden sonra Peygamber’e salavat getirmek',
          'Üçüncü tekbirden sonra ölüye dua etmek',
          'Selam vermek',
        ],
      },
      {
        heading: 'Kılınışı',
        steps: [
          {
            title: 'Niyet ve birinci tekbir',
            body: 'Niyet edilip tekbir alınır ve Fâtiha okunur.',
            ruling: 'farz',
          },
          {
            title: 'İkinci tekbir',
            body: 'Tekbir alınır ve Peygamber’e salavat getirilir.',
            ruling: 'farz',
          },
          {
            title: 'Üçüncü tekbir',
            body: 'Tekbir alınır ve ölü için dua edilir.',
            ruling: 'farz',
          },
          {
            title: 'Dördüncü tekbir ve selam',
            body: 'Tekbir alınır, kısa bir dua edilir ve sağa sola selam verilerek namaz tamamlanır.',
            ruling: 'farz',
          },
        ],
      },
    ],
  },
};
