import type { IlmihalTopicContent } from '../types';

/**
 * ⚠️ TASLAK — ehil biri tarafından gözden geçirilmedi.
 * Diyanet İşleri Başkanlığı İlmihali esas alınmıştır.
 *
 * Zekât bölümü.
 *
 * ⚠️ Bu bölümde bilinçli olarak hesap makinesi ve güncel altın/gümüş
 * fiyatı YOK. Nisabın parasal karşılığı her gün değişir; uygulamaya
 * gömülen bir rakam kısa sürede yanlış olur ve kişi eksik zekât verir.
 * Bunun yerine yöntem anlatılıyor, güncel rakam için müftülüğe
 * yönlendiriliyor. Bu karar ileride "hesap makinesi ekleyelim" diye
 * gözden geçirilirse, fiyatın nereden ve ne sıklıkta geleceği ile
 * yanlış olduğunda ne olacağı önce çözülmeli.
 */

export const ZEKATIN_ESASLARI: IlmihalTopicContent = {
  id: 'zekatin-esaslari',
  title: 'Zekâtın Esasları',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: false,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Zekât, İslam’ın beş temel esasından biridir ve şartlarını taşıyan her Müslümana farzdır.',
          'Belirli bir zenginlik ölçüsüne (nisab) ulaşan malın, belirlenen oranda ve belirlenen kişilere verilmesidir.',
        ],
      },
      {
        heading: 'Kimlere farzdır',
        paragraphs: [
          'Hanefî mezhebinde zekâtın farz olması için kişinin akıllı ve ergenlik çağına ulaşmış olması gerekir. Bu sebeple küçük çocuğun ve akıl hastasının malından zekât gerekmez.',
        ],
        items: [
          'Müslüman olmak',
          'Hür olmak',
          'Akıllı ve ergenlik çağına ulaşmış olmak',
          'Nisab miktarı mala sahip olmak',
          'Malın temel ihtiyaçlardan ve borçtan fazla olması',
          'Mala sahip olduktan sonra üzerinden bir kamerî yıl geçmesi',
          'Malın artıcı nitelikte olması',
        ],
      },
      {
        heading: 'Zekâta tabi mallar',
        items: [
          'Altın, gümüş ve para',
          'Ticaret malları',
          'Toprak ürünleri (öşür) — bunda bir yıl geçme şartı aranmaz, hasat zamanı verilir',
          'Otlakta beslenen hayvanlar',
        ],
      },
      {
        heading: 'Kimlere verilir',
        paragraphs: [
          'Zekâtın verileceği yerler Tevbe sûresinin 60. âyetinde sekiz sınıf olarak belirlenmiştir.',
        ],
        items: [
          'Fakirler ve düşkünler',
          'Zekât toplamakla görevlendirilenler',
          'Kalpleri İslam’a ısındırılmak istenenler',
          'Esaretten kurtulmak isteyenler',
          'Borçlular',
          'Allah yolunda olanlar',
          'Yolda kalmışlar',
        ],
      },
      {
        heading: 'Dağıtım kuralı',
        paragraphs: [
          'Hanefî mezhebinde zekâtın bu sınıflardan yalnızca birine, hatta tek bir kişiye verilmesi yeterlidir. Hepsine dağıtma zorunluluğu yoktur.',
        ],
      },
      {
        heading: 'Kimlere verilmez',
        items: [
          'Anne, baba, dede ve nineye',
          'Çocuk ve torunlara',
          'Eşe',
          'Zengin olanlara',
          'Zekâtın mülkiyete geçirilmesi gerekir; cami, yol, köprü gibi yerlere doğrudan zekât verilmez',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Zekât, İslam’ın beş temel esasından biridir ve şartlarını taşıyanlara farzdır.',
        ],
      },
      {
        heading: 'Kimlere farzdır',
        paragraphs: [
          'Bu, Hanefî mezhebinden önemli bir farktır. Şâfiî mezhebinde zekât malın kendisine bağlı bir yükümlülük sayıldığı için, küçük çocuğun ve akıl hastasının malından da zekât gerekir; velisi onların malından öder.',
        ],
        items: [
          'Müslüman olmak',
          'Hür olmak',
          'Nisab miktarı mala sahip olmak',
          'Mala sahip olduktan sonra üzerinden bir kamerî yıl geçmesi',
        ],
      },
      {
        heading: 'Zekâta tabi mallar',
        items: [
          'Altın, gümüş ve para',
          'Ticaret malları',
          'Toprak ürünleri — hasat zamanı verilir',
          'Otlakta beslenen hayvanlar',
        ],
      },
      {
        heading: 'Dağıtım kuralı',
        paragraphs: [
          'Şâfiî mezhebinde zekât, âyette sayılan sınıflardan mevcut olanların hepsine dağıtılır. Her sınıftan en az üç kişiye verilmesi esas alınır.',
          'Hanefî mezhebindeki gibi tek bir kişiye verilmesiyle yetinilmez. Uygulamada bu iş çoğunlukla güvenilir kurumlar aracılığıyla yapılır.',
        ],
      },
      {
        heading: 'Kimlere verilmez',
        items: [
          'Anne, baba, dede ve nineye',
          'Çocuk ve torunlara',
          'Eşe',
          'Zengin olanlara',
        ],
      },
    ],
  },
};

export const NISAB: IlmihalTopicContent = {
  id: 'nisab',
  title: 'Nisab ve Hesaplama',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: false,
  byMadhab: {
    hanefi: [
      {
        heading: 'Nisab nedir',
        paragraphs: [
          'Nisab, zekâtın farz olması için gereken asgari zenginlik ölçüsüdür. Bu ölçünün altında kalan kişiye zekât farz olmaz.',
        ],
      },
      {
        heading: 'Nisab miktarları',
        paragraphs: [
          'Klasik ölçü altında yirmi miskal, gümüşte iki yüz dirhemdir. Gram karşılıkları kaynaklar arasında az da olsa farklılık gösterir; Türkiye’de yaygın olarak altında 80,18 gram, gümüşte 561 gram esas alınır.',
        ],
        items: [
          'Altın: yaklaşık 80,18 gram',
          'Gümüş: yaklaşık 561 gram',
          'Para, banka mevduatı ve ticaret malı: altın veya gümüş nisabının parasal karşılığına göre değerlendirilir',
        ],
      },
      {
        heading: 'Altın ve gümüş birlikte hesaplanır',
        paragraphs: [
          'Hanefî mezhebinde tek başına nisaba ulaşmayan altın, gümüş, para ve ticaret malı bir araya getirilerek hesaplanır. Toplam nisaba ulaşıyorsa zekât gerekir.',
        ],
      },
      {
        heading: 'Bir yıl geçmesi',
        paragraphs: [
          'Nisab miktarı mala sahip olduktan sonra üzerinden bir kamerî yıl geçmesi gerekir.',
          'Hanefî mezhebinde yılın başında ve sonunda nisab varsa zekât gerekir; yıl içindeki iniş çıkışlara bakılmaz. Bu, pratikte önemli bir kolaylıktır.',
        ],
      },
      {
        heading: 'Oran',
        paragraphs: [
          'Altın, gümüş, para ve ticaret mallarında zekât oranı kırkta birdir, yani yüzde 2,5.',
        ],
      },
      {
        heading: 'Nasıl hesaplanır',
        steps: [
          {
            title: 'Zekâta tabi varlıkları topla',
            body: 'Nakit para, banka mevduatı, altın ve gümüş, ticaret malı ve tahsili beklenen alacaklar toplanır.',
          },
          {
            title: 'Borçları düş',
            body: 'Vadesi gelmiş borçlar toplamdan çıkarılır.',
          },
          {
            title: 'Temel ihtiyaçları ayır',
            body: 'Oturulan ev, giyilen elbise, kullanılan araç, ev eşyası ve mesleğe ait aletler zekâta tabi değildir; hesaba katılmaz.',
          },
          {
            title: 'Nisabla karşılaştır',
            body: 'Kalan tutar, güncel altın veya gümüş fiyatına göre nisab karşılığına ulaşıyorsa zekât gerekir.',
          },
          {
            title: 'Kırkta birini hesapla',
            body: 'Zekâta tabi tutarın yüzde 2,5’i zekât olarak ayrılır.',
          },
        ],
      },
      {
        heading: 'Güncel rakam için',
        paragraphs: [
          'Bu uygulama altın ve gümüş fiyatı vermez. Nisabın parasal karşılığı her gün değiştiği için buraya yazılacak bir rakam kısa sürede yanlış olur ve eksik zekâta yol açar.',
          'Hesaplama sırasında o günkü altın veya gümüş fiyatını ve Diyanet’in ilan ettiği güncel nisab tutarını esas alın. Tereddüt hâlinde müftülüğe danışın.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Nisab miktarları',
        paragraphs: [
          'Klasik ölçü altında yirmi miskal, gümüşte iki yüz dirhemdir. Şâfiî kaynaklarında gram karşılığı genellikle altında 84-85 gram, gümüşte 595 gram olarak verilir. Hanefî kaynaklarındaki rakamlardan farkı, miskal ve dirhemin gram çevriminden kaynaklanır.',
        ],
        items: [
          'Altın: yaklaşık 84,8 gram',
          'Gümüş: yaklaşık 595 gram',
        ],
      },
      {
        heading: 'Altın ve gümüş ayrı hesaplanır',
        paragraphs: [
          'Bu, Hanefî mezhebinden temel farktır. Şâfiî mezhebinde altın ve gümüş birbirine eklenmez; her biri kendi başına nisaba ulaşmalıdır.',
          'Nisaba ulaşmayan altın ile nisaba ulaşmayan gümüş toplanarak zekât gerekli hâle getirilmez.',
        ],
      },
      {
        heading: 'Nisab yıl boyunca sürmelidir',
        paragraphs: [
          'Şâfiî mezhebinde nisabın yıl boyunca kesintisiz devam etmesi gerekir. Yıl içinde mal nisabın altına düşerse geçen süre sayılmaz ve yeniden nisaba ulaşıldığı andan itibaren yıl yeniden başlar.',
          'Hanefî mezhebinde yalnızca yılın başı ve sonuna bakıldığı düşünülürse, bu daha sıkı bir şarttır.',
        ],
      },
      {
        heading: 'Oran',
        paragraphs: [
          'Altın, gümüş, para ve ticaret mallarında zekât oranı kırkta birdir, yani yüzde 2,5.',
        ],
      },
      {
        heading: 'Güncel rakam için',
        paragraphs: [
          'Bu uygulama altın ve gümüş fiyatı vermez. Nisabın parasal karşılığı her gün değiştiği için sabit bir rakam kısa sürede yanlış olur.',
          'Hesaplama sırasında o günkü fiyatı esas alın ve tereddüt hâlinde müftülüğe danışın.',
        ],
      },
    ],
  },
};

export const FITRE: IlmihalTopicContent = {
  id: 'fitre',
  title: 'Fitre',
  source: 'Diyanet İşleri Başkanlığı İlmihali',
  reviewed: false,
  byMadhab: {
    hanefi: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Fitre (sadaka-i fıtr), Ramazan Bayramı’na kavuşan ve nisab miktarı mala sahip olan Müslümana vaciptir.',
          'Zekâttan farkı, malın üzerinden bir yıl geçmesi ve artıcı nitelikte olması şartlarının aranmamasıdır. Bayram sabahı nisab miktarı malı bulunan kişiye vacip olur.',
        ],
      },
      {
        heading: 'Kimin adına verilir',
        items: [
          'Kişi kendisi için verir',
          'Ergenlik çağına gelmemiş çocukları için verir',
          'Hanefî mezhebinde eş için fitre vermek gerekmez; eşin kendi nisabı varsa kendisi verir',
          'Ergenlik çağına gelmiş çocuk kendi fitresinden sorumludur',
        ],
      },
      {
        heading: 'Ne zaman verilir',
        items: [
          'Bayram sabahı fecrin doğuşuyla vacip olur',
          'Ramazan içinde önceden verilmesi caizdir',
          'Bayram namazından önce verilmesi müstehaptır — ihtiyaç sahibi bayrama hazırlanabilsin diye',
          'Bayram geçtikten sonraya kalırsa borç düşmez, yine de verilmesi gerekir',
        ],
      },
      {
        heading: 'Miktarı',
        paragraphs: [
          'Fitre, buğday, arpa, hurma ve kuru üzüm gibi temel gıda maddeleri üzerinden belirlenir. Buğdaydan yarım sâ’, diğerlerinden bir sâ’ ölçüsündedir.',
          'Hanefî mezhebinde bunların yerine parasal karşılığının verilmesi caizdir; Türkiye’de yaygın uygulama budur.',
          'Diyanet İşleri Başkanlığı her yıl güncel fitre miktarını ilan eder. Esas alınacak rakam odur; bu uygulama tutar bilgisi vermez.',
        ],
      },
      {
        heading: 'Kimlere verilir',
        paragraphs: [
          'Zekât verilebilecek kişilere verilir. Anne, baba, çocuk, torun ve eşe fitre verilmez.',
        ],
      },
    ],
    safii: [
      {
        heading: 'Hükmü',
        paragraphs: [
          'Şâfiî mezhebinde fitre farzdır. Hanefî mezhebinde vacip sayılmasından terim olarak ayrılır.',
          'Daha önemli fark yükümlülük eşiğindedir: Şâfiî mezhebinde nisab şartı aranmaz. Bayram günü ve gecesi kendisinin ve bakmakla yükümlü olduğu kişilerin ihtiyacından fazlasına sahip olan herkese fitre gerekir.',
        ],
      },
      {
        heading: 'Kimin adına verilir',
        paragraphs: [
          'Şâfiî mezhebinde kişi, nafakası kendisine ait olan herkesin fitresini vermekle yükümlüdür. Bu, Hanefî mezhebinden belirgin biçimde geniştir.',
        ],
        items: [
          'Kendisi için',
          'Eşi için',
          'Küçük çocukları için',
          'Nafakasını üstlendiği muhtaç anne ve babası için',
        ],
      },
      {
        heading: 'Miktarı ve nasıl verileceği',
        paragraphs: [
          'Kişi başına bir sâ’ (yaklaşık 2,75-3 kilogram) o beldenin temel gıda maddesi verilir. Türkiye’de bu genellikle buğdaydır.',
          'Şâfiî mezhebinde fitrenin gıda maddesi olarak verilmesi esastır; parasal karşılığının verilmesi mezhepte kabul görmez. Hanefî mezhebinde para olarak verilebilmesi yönüyle ayrılır. Bu fark uygulamada doğrudan hissedilir.',
        ],
      },
      {
        heading: 'Ne zaman verilir',
        items: [
          'Ramazanın son günü güneşin batmasıyla farz olur',
          'Ramazan içinde önceden verilmesi caizdir',
          'Bayram namazından önce verilmesi sünnettir',
          'Bayram gününün sonuna kadar geciktirilmesi doğru değildir; geciktirilse de borç düşmez, kaza edilir',
        ],
      },
      {
        heading: 'Kimlere verilir',
        paragraphs: [
          'Zekât verilebilecek sınıflara verilir. Nafakasından sorumlu olunan kişilere fitre verilmez.',
        ],
      },
    ],
  },
};
