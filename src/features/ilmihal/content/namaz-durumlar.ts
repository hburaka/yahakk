import type { IlmihalTopicContent } from '../types';

/**
 * ⚠️ TASLAK — ehil biri tarafından gözden geçirilmedi.
 * Diyanet İşleri Başkanlığı İlmihali esas alınmıştır.
 *
 * Namazda özel durumlar: hata yapıldığında (sehiv secdesi), yolculukta
 * (seferîlik) ve namaz kaçırıldığında (kaza). Üçünde de mezhep farkı
 * uygulamayı doğrudan değiştiriyor — sehiv secdesinin selamdan önce mi
 * sonra mı yapılacağı, kısaltmanın zorunlu mu isteğe bağlı mı olduğu ve
 * kaza sırasının gerekli olup olmadığı.
 */

export const SEHIV_SECDESI: IlmihalTopicContent = {
  id: 'sehiv-secdesi',
  title: 'Sehiv Secdesi',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: false,
  byMadhab: {
    hanefi: [
      {
        heading: 'Ne zaman gerekir',
        paragraphs: [
          'Sehiv secdesi, namazın vaciplerinden biri unutularak terk edildiğinde veya geciktirildiğinde yapılır ve Hanefî mezhebinde vaciptir.',
          'Bir farz terk edilmişse sehiv secdesi yeterli olmaz; namazın yeniden kılınması gerekir. Sünnetin terk edilmesi hâlinde ise sehiv secdesi gerekmez.',
          'Vacip kasten terk edilmişse sehiv secdesi bunu telafi etmez; namaz yeniden kılınır.',
        ],
      },
      {
        heading: 'Sehiv secdesi gerektiren durumlar',
        items: [
          'Fâtiha’yı okumayı unutmak',
          'Fâtiha’dan sonra zamm-ı sûre okumayı unutmak',
          'Fâtiha’yı sûreden sonra okuyarak sırayı bozmak',
          'İlk oturuşu unutup ayağa kalkmak',
          'Oturuşlarda Ettehiyyâtü’yü okumamak',
          'Gizli okunacak yerde sesli, sesli okunacak yerde gizli okumak',
          'Vitir namazında kunut duasını unutmak',
          'Bayram namazında zevâid tekbirleri unutmak',
          'Bir rüknü tekrarlamak veya yerinden geciktirmek',
        ],
      },
      {
        heading: 'Nasıl yapılır',
        steps: [
          {
            title: 'Son oturuşta Ettehiyyâtü',
            body: 'Namazın son oturuşunda Ettehiyyâtü okunur.',
            ruling: 'vacip',
          },
          {
            title: 'Yalnız sağa selam',
            body: 'Sadece sağ tarafa selam verilir.',
            ruling: 'vacip',
          },
          {
            title: 'İki secde',
            body: 'Tekbir alınarak secdeye gidilir, secde tesbihleri okunur; oturulup tekrar tekbirle ikinci secde yapılır.',
            ruling: 'vacip',
          },
          {
            title: 'Tekrar oturuş ve selam',
            body: 'Oturuşa dönülür; Ettehiyyâtü, salli-bârik ve dua okunur, ardından sağa ve sola selam verilerek namaz tamamlanır.',
            ruling: 'vacip',
          },
        ],
      },
      {
        heading: 'Rekât sayısında şüphe',
        paragraphs: [
          'Kaç rekât kılındığı konusunda şüpheye düşen kişi, bu ilk kez yaşıyorsa namazı yeniden kılar. Şüphe sık yaşanıyorsa galip kanaate göre hareket edilir ve sonunda sehiv secdesi yapılır.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Şâfiî mezhebinde sehiv secdesi sünnettir. Hanefî mezhebinde vacip sayılması yönüyle ayrılır; terk edilmesi hâlinde namaz bozulmaz.',
        ],
      },
      {
        heading: 'Sehiv secdesi gerektiren durumlar',
        paragraphs: [
          'Şâfiî mezhebinde "eb’âz" adı verilen bazı sünnetlerin terk edilmesi sehiv secdesini gerektirir.',
        ],
        items: [
          'İlk teşehhüdü (birinci oturuşu) terk etmek',
          'İlk teşehhütte Peygamber’e salavat getirmeyi terk etmek',
          'Sabah namazında ve ramazanın son yarısında vitirde kunutu terk etmek',
          'Unutarak fazladan bir rükün yapmak (fazla rükû, secde veya kıyam)',
          'Rekât sayısında şüpheye düşmek',
        ],
      },
      {
        heading: 'Nasıl yapılır',
        paragraphs: [
          'Sehiv secdesinin yeri Hanefî mezhebinden farklıdır: secdeler selamdan önce yapılır.',
        ],
        steps: [
          {
            title: 'Son teşehhüt ve salavat',
            body: 'Son oturuşta teşehhüt ve Peygamber’e salavat okunur.',
            ruling: 'farz',
          },
          {
            title: 'Selamdan önce iki secde',
            body: 'Henüz selam verilmeden tekbirle secdeye gidilir, oturulup ikinci secde yapılır.',
            ruling: 'sunnet',
          },
          {
            title: 'Selam',
            body: 'Oturuşa dönülür ve sağa sola selam verilerek namaz tamamlanır.',
            ruling: 'farz',
          },
        ],
      },
      {
        heading: 'Rekât sayısında şüphe',
        paragraphs: [
          'Şâfiî mezhebinde şüphe hâlinde az olan sayı esas alınır; eksik kalan rekât tamamlanır ve sonunda sehiv secdesi yapılır. Hanefî mezhebindeki gibi galip kanaate göre hareket edilmez.',
        ],
      },
    ],
  },
};

export const SEFERILIK: IlmihalTopicContent = {
  id: 'seferilik',
  title: 'Seferîlik ve Namazın Kısaltılması',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: false,
  byMadhab: {
    hanefi: [
      {
        heading: 'Kim seferî sayılır',
        paragraphs: [
          'Hanefî mezhebine göre yaklaşık 90 kilometre (orta bir yürüyüşle on sekiz saatlik mesafe) ve daha uzak bir yere gitmek üzere yola çıkan kişi seferî sayılır.',
          'Seferîlik, bulunulan yerleşim yerinin sınırından çıkılmasıyla başlar.',
        ],
      },
      {
        heading: 'Namaz nasıl kısaltılır',
        paragraphs: [
          'Dört rekâtlı farz namazlar (öğle, ikindi ve yatsı) iki rekât olarak kılınır. Sabah namazı iki, akşam namazı üç rekât olduğu için kısaltılmaz. Vitir de kısaltılmaz.',
          'Hanefî mezhebinde bu bir tercih değildir: seferî kişinin dört rekâtlı farzı iki rekât kılması gerekir. Dört rekât kılarsa mekruh olur ve ilk iki rekât farz yerine geçer.',
        ],
      },
      {
        heading: 'Sünnetler',
        paragraphs: [
          'Sünnetler kısaltılmaz. Yolculuk hâlinde ve acele durumlarda terk edilmesinde sakınca yoktur; konaklandığında kılınması daha faziletlidir.',
        ],
      },
      {
        heading: 'Ne zaman mukim olunur',
        items: [
          'Gidilen yerde on beş gün veya daha fazla kalmaya niyet edilirse mukim olunur ve namazlar tam kılınır',
          'On beş günden az kalmaya niyet edilmişse, süre fiilen uzasa bile seferîlik devam eder',
          'Kendi memleketine dönen kişi, girer girmez mukim olur',
        ],
      },
      {
        heading: 'Namazların birleştirilmesi',
        paragraphs: [
          'Hanefî mezhebinde yolculuk sebebiyle iki namazın birleştirilerek kılınması (cem) caiz görülmez. Hac sırasında Arafat ve Müzdelife’deki uygulama bunun dışındadır.',
        ],
      },
      {
        heading: 'Kaçırılan namazlar',
        paragraphs: [
          'Seferî iken kaçırılan dört rekâtlı bir namaz, mukim olduktan sonra da iki rekât olarak kaza edilir. Mukimken kaçırılan namaz ise seferî iken dört rekât kaza edilir.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Kim seferî sayılır',
        paragraphs: [
          'Şâfiî mezhebine göre yaklaşık 81 kilometre (iki merhale) ve daha uzak bir yere gitmek üzere yola çıkan kişi seferî sayılır.',
          'Yolculuğun meşru bir amaçla yapılması gerekir; günah işlemek için çıkılan yolculukta seferîlik ruhsatlarından yararlanılmaz.',
        ],
      },
      {
        heading: 'Namazın kısaltılması bir ruhsattır',
        paragraphs: [
          'Bu, Hanefî mezhebinden temel farktır. Şâfiî mezhebinde dört rekâtlı farzları iki rekât kılmak zorunlu değil, tanınmış bir kolaylıktır; kişi dilerse tam kılar.',
          'Kısaltarak kılınacaksa buna namaza başlarken niyet edilmesi gerekir. Mukim bir imama uyulduğunda namaz kısaltılmaz, tam kılınır.',
        ],
      },
      {
        heading: 'Namazların birleştirilmesi (cem)',
        paragraphs: [
          'Şâfiî mezhebinde yolculukta iki namazın birleştirilerek kılınması caizdir. Hanefî mezhebinde bulunmayan bu kolaylık, uzun yolculuklarda en çok başvurulan uygulamadır.',
        ],
        items: [
          'Öğle ile ikindi birleştirilebilir',
          'Akşam ile yatsı birleştirilebilir',
          'Cem-i takdim: iki namaz da ilk namazın vaktinde kılınır',
          'Cem-i te’hir: iki namaz da ikinci namazın vaktinde kılınır',
          'Sabah namazı hiçbir namazla birleştirilmez',
        ],
      },
      {
        heading: 'Ne zaman mukim olunur',
        paragraphs: [
          'Gidilen yerde dört gün veya daha fazla kalmaya niyet edilirse mukim olunur. Varış ve dönüş günleri bu sayıya dâhil edilmez. Hanefî mezhebindeki on beş günlük süreden belirgin biçimde kısadır.',
        ],
      },
    ],
  },
};

export const KAZA: IlmihalTopicContent = {
  id: 'kaza',
  title: 'Kaza Namazı',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: false,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hangi namazlar kaza edilir',
        paragraphs: [
          'Vaktinde kılınamayan farz namazlar ve vitir namazı kaza edilir.',
          'Uyuyakalmak veya unutmak sebebiyle namazın kaçırılması günah değildir; hatırlandığında veya uyanıldığında kılınır. Özürsüz ve kasten terk etmek ise günahtır; kaza etmenin yanında tövbe de gerekir.',
        ],
      },
      {
        heading: 'Sünnetler kaza edilir mi',
        paragraphs: [
          'Sünnetler kural olarak kaza edilmez. Sabah namazının sünneti bunun istisnasıdır: farzıyla birlikte kaçırılmışsa, o günün öğle vakti girmeden önce farzla birlikte kaza edilir.',
        ],
      },
      {
        heading: 'Sıra gözetmek (tertip)',
        paragraphs: [
          'Hanefî mezhebinde kaza namazlarının kaçırılma sırasına göre kılınması vaciptir. Üzerinde kaza namazı olan kişi, o namazı kılmadan vaktin namazını kılarsa namazı geçerli olmayabilir.',
          'Ancak kaçırılan namaz sayısı altı vakte ulaştığında tertip düşer; artık sıra gözetme zorunluluğu kalmaz.',
        ],
      },
      {
        heading: 'Kaza namazı kılınmayan vakitler',
        items: [
          'Güneş doğarken',
          'Güneş tam tepedeyken (istivâ vakti)',
          'Güneş batarken',
        ],
      },
      {
        heading: 'Niyet nasıl edilir',
        paragraphs: [
          'Hangi namazın kaza edildiği belirlenerek niyet edilir. Çok sayıda kaza namazı olan kişi "kılamadığım ilk öğle namazının farzı" veya "kılamadığım son yatsı namazının farzı" diyerek sırayı takip edebilir.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hangi namazlar kaza edilir',
        paragraphs: [
          'Vaktinde kılınamayan farz namazlar kaza edilir.',
          'Namaz özürsüz ve kasten terk edilmişse vakit geçirilmeden, derhal kaza edilmesi gerekir. Uyku veya unutma gibi bir özürle kaçırılmışsa acele etme zorunluluğu yoktur; yine de geciktirmemek müstehaptır.',
        ],
      },
      {
        heading: 'Sünnetler kaza edilir mi',
        paragraphs: [
          'Şâfiî mezhebinde müekked sünnetler de kaza edilebilir. Vitir bu mezhepte sünnet sayıldığı için kazası da sünnettir. Hanefî mezhebinden bu yönüyle ayrılır.',
        ],
      },
      {
        heading: 'Sıra gözetmek (tertip)',
        paragraphs: [
          'Şâfiî mezhebinde kaza namazlarını sırayla kılmak sünnettir, vacip değildir. Sıra gözetilmeden kılınan kaza namazı geçerlidir. Hanefî mezhebindeki tertip zorunluluğu burada yoktur.',
        ],
      },
      {
        heading: 'Kerahet vakitleri',
        paragraphs: [
          'Şâfiî mezhebinde kaza namazı, bir sebebe bağlı namazlardan sayıldığı için kerahet vakitlerinde de kılınabilir. Bu da Hanefî mezhebinden bir farktır.',
        ],
      },
    ],
  },
};
