import type { IlmihalTopicContent } from '../types';

/**
 * Gözden geçirildi ve onaylandı.
 * Diyanet İşleri Başkanlığı İlmihali esas alınmıştır.
 *
 * Oruç bölümü. En kritik fark niyetin zamanı: Şâfiî'de farz oruca
 * geceden niyet etmek şart, Hanefî'de kuşluk vaktine kadar niyet
 * edilebiliyor. Kefaretin hangi durumda gerektiği de ayrışıyor.
 */

export const ORUCUN_ESASLARI: IlmihalTopicContent = {
  id: 'orucun-esaslari',
  title: 'Orucun Esasları',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Ramazan orucu, akıllı ve ergenlik çağına ulaşmış her Müslümana farzdır. İslam’ın beş temel esasından biridir.',
          'Oruç, tan yerinin ağarmasından (imsak) güneşin batışına (iftar) kadar yeme, içme ve cinsel ilişkiden uzak durmaktır.',
        ],
      },
      {
        heading: 'Niyet ne zaman yapılır',
        paragraphs: [
          'Hanefî mezhebinde ramazan orucuna niyet, akşam güneş battıktan sonra ertesi gün kuşluk vaktine kadar yapılabilir. Kuşluk vakti, imsak ile öğle arasının ortasından biraz öncesidir.',
          'Bu, gece niyet etmeyi unutan veya sahura kalkamayan kişi için bir kolaylıktır: sabah niyet ederek o günün orucunu tutabilir. Ancak henüz bir şey yiyip içmemiş olması gerekir.',
        ],
        items: [
          'Ramazanın her günü için ayrı niyet edilir',
          'Kaza ve kefaret oruçlarına ise geceden, imsaktan önce niyet edilmesi gerekir',
          'Niyet kalple olur; dille söylemek şart değildir',
        ],
      },
      {
        heading: 'Oruç çeşitleri',
        items: [
          'Farz: ramazan orucu, kaza orucu, kefaret orucu',
          'Vacip: adak orucu, başlanıp bozulan nafile orucun kazası',
          'Sünnet ve nafile: Muharrem’in dokuz ve onuncu günleri, Şevval’de altı gün, pazartesi ve perşembe, her ayın on üç-on dört-on beşinci günleri',
          'Haram: Ramazan Bayramı’nın birinci günü ile Kurban Bayramı’nın dört günü',
        ],
      },
      {
        heading: 'Oruç tutmayabilecekler',
        items: [
          'Hastalar ve yolcular — iyileştiklerinde veya döndüklerinde kaza ederler',
          'Hamile ve emziren kadınlar, kendisi veya çocuğu için endişe duyarsa — sonra kaza ederler',
          'Hayız ve nifas hâlindeki kadınlar — tutmaları caiz değildir, sonra kaza ederler',
          'İyileşme ümidi olmayan hastalar ve oruca güç yetiremeyecek kadar yaşlı olanlar — fidye verirler',
        ],
      },
      {
        heading: 'Sahur ve iftar',
        items: [
          'Sahur yemek sünnettir; imsak vaktine yakın olması müstehaptır',
          'İftarda acele etmek, güneş battığı kesinleştiğinde geciktirmemek sünnettir',
          'Hurma veya su ile açmak sünnettir',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Ramazan orucu, akıllı ve ergenlik çağına ulaşmış her Müslümana farzdır.',
          'Oruç, fecrin doğuşundan güneşin batışına kadar orucu bozan şeylerden uzak durmaktır.',
        ],
      },
      {
        heading: 'Niyet geceden yapılmalıdır',
        paragraphs: [
          'Bu, Hanefî mezhebinden en önemli farktır. Şâfiî mezhebinde farz oruçlarda niyetin geceden, yani fecir doğmadan önce yapılması şarttır. Buna tebyît denir.',
          'Gece niyet edilmemişse o günün orucu farz olarak geçerli olmaz. Kişi günü oruçlu geçirse bile o günü sonradan kaza etmesi gerekir.',
        ],
        items: [
          'Ramazanın her günü için ayrı ayrı niyet edilmesi gerekir',
          'Niyet, güneşin batışından fecrin doğuşuna kadar herhangi bir anda yapılabilir',
          'Nafile oruçlarda gündüz de niyet edilebilir; öğleden önce olması ve o ana kadar orucu bozan bir şey yapılmamış olması şartıyla',
        ],
      },
      {
        heading: 'Orucun rükünleri',
        items: [
          'Niyet etmek',
          'Fecrin doğuşundan güneşin batışına kadar orucu bozan şeylerden uzak durmak',
        ],
      },
      {
        heading: 'Orucun şartları',
        items: [
          'Müslüman olmak',
          'Akıllı olmak',
          'Oruç tutmaya güç yetirebilmek',
          'Hayız ve nifas hâlinde olmamak',
        ],
      },
      {
        heading: 'Oruç tutmayabilecekler',
        items: [
          'Hastalar ve yolcular — sonra kaza ederler',
          'Hamile ve emziren kadınlar — sonra kaza ederler; yalnızca çocuğu için endişe ediyorlarsa kazanın yanında fidye de gerekir',
          'Hayız ve nifas hâlindeki kadınlar — sonra kaza ederler',
          'İyileşme ümidi olmayan hastalar ve çok yaşlılar — fidye verirler',
        ],
      },
    ],
  },
};

export const ORUCU_BOZANLAR: IlmihalTopicContent = {
  id: 'orucu-bozanlar',
  title: 'Orucu Bozan Durumlar',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hem kaza hem kefaret gerektirenler',
        paragraphs: [
          'Oruçlu olduğunu bilerek, isteyerek ve bir özrü bulunmaksızın orucu bozmak kefareti gerektirir.',
        ],
        items: [
          'Gıda veya ilaç niteliğinde bir şeyi kasten yiyip içmek',
          'Cinsel ilişkide bulunmak',
        ],
      },
      {
        heading: 'Yalnız kaza gerektirenler',
        items: [
          'Abdest alırken veya ağzı çalkalarken suyun boğaza kaçması',
          'Gıda ve ilaç sayılmayan bir şeyi yutmak (toprak, taş, kâğıt gibi)',
          'Ağız dolusu isteyerek kusmak',
          'Zorlama altında orucu bozmak',
          'Sigara içmek',
        ],
      },
      {
        heading: 'Orucu bozmayan durumlar',
        paragraphs: [
          'Halk arasında orucu bozduğu sanılan bazı durumlar aslında orucu bozmaz.',
        ],
        items: [
          'Unutarak yiyip içmek — oruç bozulmaz, hatırlandığında ağızdakiler çıkarılıp oruca devam edilir',
          'Elde olmadan kusmak',
          'İhtilam olmak (uykuda boşalma)',
          'Kan aldırmak veya kan vermek',
          'Göze damla damlatmak',
          'Tükürüğü yutmak',
          'Gıybet ve yalan orucu bozmaz, ancak sevabını eksiltir',
        ],
      },
      {
        heading: 'Kefaretin miktarı',
        paragraphs: [
          'Kefaret, ard arda altmış gün oruç tutmaktır; bozulan günün kazasıyla birlikte toplam altmış bir gün olur. Buna güç yetiremeyen kişi altmış fakiri bir gün doyurur.',
          'Kefaret orucu kesintisiz olmalıdır. Araya ramazan veya oruç tutulması yasak bayram günleri girerse yeniden başlanır. Kadının hayız sebebiyle ara vermesi ise özür sayılır, yeniden başlaması gerekmez.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Orucu bozan durumlar',
        items: [
          'Açık bir yoldan vücut boşluğuna bir şeyin ulaşması (yemek, içmek, buruna su çekmek gibi)',
          'Kasten kusmak',
          'Cinsel ilişkide bulunmak',
          'İstimnâ',
          'Hayız veya nifas hâlinin başlaması',
          'Gün içinde delirmek',
          'Dinden çıkmak',
        ],
      },
      {
        heading: 'Kefaret yalnız cinsel ilişkide gerekir',
        paragraphs: [
          'Bu, Hanefî mezhebinden temel farktır. Şâfiî mezhebinde kefaret yalnızca ramazan gününde cinsel ilişkiyle orucu bozan kişiye gerekir.',
          'Kasten yiyip içmek orucu bozar ve günahtır, ancak kefaret gerektirmez; yalnızca o günün kazası gerekir.',
        ],
      },
      {
        heading: 'Orucu bozmayan durumlar',
        items: [
          'Unutarak yiyip içmek',
          'Elde olmadan kusmak',
          'İhtilam olmak',
          'Tükürüğü yutmak',
          'Bilmeden veya zorlama altında orucu bozacak bir şey yapmak',
        ],
      },
      {
        heading: 'Kefaretin miktarı',
        paragraphs: [
          'Kefaret sırayla şudur: köle azat etmek; buna imkân yoksa ard arda iki ay oruç tutmak; buna da güç yetmezse altmış fakiri doyurmak.',
        ],
      },
    ],
  },
};

export const FIDYE_KEFARET: IlmihalTopicContent = {
  id: 'fidye-kefaret',
  title: 'Fidye ve Kefaret',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: true,
  byMadhab: {
    hanefi: [
      {
        heading: 'Fidye kimlere gerekir',
        paragraphs: [
          'Fidye, oruç tutmaya güç yetiremeyecek durumda olan ve bu durumun geçmesi beklenmeyen kişiler içindir.',
        ],
        items: [
          'İyileşme ümidi bulunmayan hastalar',
          'Oruç tutamayacak kadar yaşlı olanlar',
        ],
      },
      {
        heading: 'Fidyenin miktarı ve verilişi',
        paragraphs: [
          'Tutulamayan her gün için bir fakirin bir günlük yiyeceği verilir; bu, fitre miktarına denktir. Ramazanın başında topluca verilebileceği gibi gün gün de verilebilir.',
          'Fidye verecek durumda olan kişi sonradan iyileşir ve oruç tutabilecek hâle gelirse, verdiği fidye nafile sadaka olur ve tutamadığı oruçları kaza eder.',
        ],
      },
      {
        heading: 'Kaza gerektiren durumlar',
        paragraphs: [
          'Hastalık, yolculuk, hayız-nifas, hamilelik veya emzirme sebebiyle tutulamayan oruçlar kaza edilir.',
          'Hanefî mezhebinde kaza için belirli bir süre sınırı yoktur; gelecek ramazana kadar tutulması müstehaptır ancak geciktirilmesi hâlinde ayrıca fidye gerekmez.',
        ],
      },
      {
        heading: 'Kefaret ne zaman gerekir',
        paragraphs: [
          'Kefaret, ramazan orucunu bilerek, isteyerek ve özürsüz olarak bozmakla gerekir. Kasten yiyip içmek de cinsel ilişki de kefareti gerektirir.',
          'Sırasıyla: köle azat etmek; buna imkân yoksa ard arda altmış gün oruç tutmak (bozulan günün kazasıyla birlikte altmış bir gün); buna da güç yetmezse altmış fakiri bir gün doyurmak.',
        ],
      },
      {
        heading: 'Kefaret gerektirmeyen bozmalar',
        paragraphs: [
          'Yanlışlıkla, zorlama altında veya bir özür sebebiyle bozulan oruçlarda kefaret gerekmez; yalnızca kaza edilir.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Fidye kimlere gerekir',
        items: [
          'İyileşme ümidi bulunmayan hastalar',
          'Oruç tutamayacak kadar yaşlı olanlar',
          'Yalnızca çocuğu için endişe ederek oruç tutmayan hamile ve emziren kadınlar — bunlara hem kaza hem fidye gerekir',
          'Kaza borcunu özürsüz olarak gelecek ramazana kadar geciktiren kişiler',
        ],
      },
      {
        heading: 'Kazayı geciktirmenin bedeli',
        paragraphs: [
          'Bu, Hanefî mezhebinden önemli bir farktır. Şâfiî mezhebinde ramazan orucunun kazası, gelecek ramazan girmeden tamamlanmalıdır.',
          'Özürsüz olarak geciktirilirse, kazanın yanı sıra geciken her yıl için ayrıca fidye verilmesi gerekir. Hanefî mezhebinde böyle bir yükümlülük yoktur.',
        ],
      },
      {
        heading: 'Fidyenin miktarı',
        paragraphs: [
          'Her gün için bir müd (yaklaşık 600-750 gram) o beldenin temel gıda maddesi verilir. Güncel karşılığı için müftülüğün ilan ettiği miktar esas alınmalıdır.',
        ],
      },
      {
        heading: 'Kefaret ne zaman gerekir',
        paragraphs: [
          'Şâfiî mezhebinde kefaret yalnızca ramazan gününde cinsel ilişkiyle orucu bozmakla gerekir. Kasten yiyip içmek kefaret gerektirmez; o günün kazası yeterlidir.',
          'Sırasıyla: köle azat etmek; buna imkân yoksa ard arda iki ay oruç tutmak; buna da güç yetmezse altmış fakiri doyurmak.',
        ],
      },
    ],
  },
};
