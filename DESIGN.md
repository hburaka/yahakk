# Design

## Visual Theme

**Tarife, gösterge paneli değil.**

Ana ekran bir dashboard değil, bir sefer tarifesidir. Gün dikey bir zaman çizelgesi olarak durur; "şimdi" o çizelgenin üzerinde işaretlidir. Sıradaki vakit sola dayalı, editöryel dizilir. Kart yok, çerçeve yok, ikon kalabalığı yok — hiyerarşinin tamamı yazı boyutu, ağırlık ve boşlukla kurulur.

Gerekçe: kullanıcı günde 5-15 kez, çoğu sefer 3 saniyeden kısa süreyle tek bir soruyu sorar. Cevap ekrandaki en büyük şey olmalıdır. Ayrıca erişilebilirlik hedefi AAA ve varsayılan yazı büyük; tipografiyle kurulmuş düzen %135 ölçekte ayakta kalır, kartlarla kurulmuş düzen kırılır.

### Kaçınılan iki refleks
1. **Yeşil + altın + cami silueti + geometrik süsleme.** Kategorinin birinci refleksi.
2. **Beyaz zemin + ince sans "temiz minimal".** Birincisinden kaçınanların düştüğü ikinci refleks.

Çıkış yolu: arayüz akromatiktir (mürekkep ekseni), **ekrandaki tek renk günün vaktidir.**

## Color

**Strateji: Restrained.** Nötr mürekkep tabanı + tek kromatik rol, o da sabit değil: içinde bulunulan namaz vaktinin gök rengi.

Renk asla dekorasyon değildir. Yüzeydeki tek renkli öge, sayıyı okumadan günün neresinde olduğunu söyler.

### Nötr taban
Saf siyah ve saf beyaz kullanılmaz. Nötraller o anki vakit rengine doğru çok hafif kırılır (chroma ≤ 0.01), böylece yüzey soğuk-steril durmaz.

| Rol | Açık | Koyu | Gece |
|---|---|---|---|
| background | kağıt beyazı, sıcak | mürekkep, nötr-soğuk | çok kısık, sıcak siyah |
| text | neredeyse siyah | neredeyse beyaz | kısık kehribar |

### Vakit renkleri (tek kromatik rol)
Gökyüzünden türetilir, dinî ikonografiden değil.

| Vakit dilimi | His | Yön |
|---|---|---|
| Gece (yatsı → imsak) | derin, sessiz | lacivert-çivit |
| İmsak → güneş | şafak sökümü | çivit → menekşe |
| Güneş → öğle | açılan gün | soluk altın |
| Öğle → ikindi | tepe nokta | neredeyse renksiz, nötr sıcak |
| İkindi → akşam | alçalan güneş | kehribar |
| Akşam → yatsı | gurup | kızıl-gül |

Kural: metin renkleri her zaman paletin nötr ekseninden gelir. Vakit rengi yalnızca ray, işaretçi, aktif satır vurgusu ve ince yüzey kırılması olarak görünür — **hiçbir zaman metnin kendi rengi olmaz.** Böylece kontrast oranı vakitten bağımsız olarak AAA kalır.

### Durum renkleri
`success` / `danger` / `warning` semantik ve sabittir, vakit rengiyle karışmaz.

## Typography

Tek aile: sistem yazı tipi (`system-ui` / SF Pro / Roboto). Ürün arayüzünde display font kullanılmaz.

- **Taban gövde 17pt** (kategori standardından büyük). Kullanıcı yaş dağılımı üst tarafı ağır bastığı için taban büyütüldü.
- Ölçek oranı ~1.25; hiyerarşi ağırlık kontrastıyla desteklenir.
- **Saatler ve sayaçlar `tabular-nums` ile dizilir.** Geri sayım her saniye değişiyor; orantılı rakamlarla sayı zıplar. Tarife metaforunun da temeli budur.
- Arapça metin ayrı ölçekte: 28pt gövde, satır aralığı 52 — harekeler standart satır aralığında üst üste biniyor.
- Dua ve ilmihal metinlerine kullanıcı okuma ölçeği (0.9×–1.35×) uygulanır; arayüz etiketlerine uygulanmaz.

## Layout

- **Sola dayalı.** Ortalanmış düzen tarife hissini bozar ve uzun Türkçe vakit adlarında ("Güneş", "İkindi") hizayı dağıtır.
- Kart kullanılmaz. Ayrım boşlukla, gerekirse saç teli inceliğinde ayraçla yapılır.
- Ritim değişkendir: sıradaki vakit bloğu ile tarife listesi arasındaki boşluk, liste satırları arasındakinin üç katıdır.
- Dokunma hedefleri en az 48×48 pt.
- Hiçbir metin sabit yükseklikli kaba konmaz — sistem yazı boyutu büyüdüğünde kap büyür.

## Components

Her etkileşimli bileşende: default, pressed, focused, disabled durumları tanımlı.

- **Vakit satırı**: sol vakit adı, sağ saat. Geçmiş vakitler soluk; sıradaki vakit kalın + vakit rengi işaretçi. Renk tek başına bilgi taşımaz — sıradaki satır ayrıca ağırlık ve ekran okuyucu etiketiyle de belirtilir.
- **Geri sayım**: tabular, tek renk, degrade yok. SaaS "hero metric" kalıbından kaçınmak için sola dayalı ve vakit adıyla ortak temel çizgide.
- **Boş/hata durumları**: arayüzü öğreten metin, "veri yok" değil.
- Yükleme: içerik yerinde iskelet, ortada spinner değil.

## Motion

- 150–250 ms, ease-out (quart/quint). Bounce ve elastic yok.
- Hareket yalnızca durum bildirir: vakit geçişi, kalibrasyon uyarısı, tesbih artışı.
- Geri sayım dışındaki tüm hareket, sistem "hareketi azalt" ayarında kapanır.
- Sayfa açılış koreografisi yok. Kullanıcı 3 saniyeliğine giriyor.

## Ekran bazında notlar

- **Vakitler**: yukarıdaki tarife düzeni.
- **Kıble**: tek büyük pusula, çevresinde hiçbir şey yok. Hizalandığında yüzey vakit rengine boyanır + haptik. Doğruluk düşükse pusula soluklaşır ve kalibrasyon çağrısı öne çıkar — yanlış yön göstermektense hiç göstermemek yeğdir.
- **Tesbih**: ekranın neredeyse tamamı dokunma hedefi. Sayı devasa ve tabular. Hedefe ilerleme ince bir ray olarak kenarda; halka/progress ring değil (tarife dilinin devamı).
- **Reklam**: Kıble, Tesbih ve Dua/İlmihal detay ekranlarında reklam bileşeni render edilemez (AdGate).
