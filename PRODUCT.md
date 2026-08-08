# Product

## Register

product

## Users

Türkiye'de yaşayan, günde beş vakit namaz kılan veya kılmaya çalışan Müslümanlar. Yaş dağılımı geniş ve **üst tarafı ağır basıyor** — anne-babamızın telefonunda duracak bir uygulama.

Kullanım bağlamı parça parça ve tekrarlıdır: gün içinde 5-15 kez, çoğu sefer 3 saniyeden kısa. Kullanıcı uygulamayı bir şey *yapmak* için değil, tek bir soruyu cevaplamak için açar: **"Ezana ne kadar var?"** Geri kalan her şey (kıble, tesbih, dua, ilmihal) daha seyrek ama daha uzun oturumlardır.

Işık koşulları uçtan uca değişir: imsaktan önce zifiri karanlık oda, öğlede güneş altında dışarısı, yatsıda loş ev içi.

## Product Purpose

Dört ibadet aracını (namaz vakti, kıble, tesbih, dua) ve bir ilmihali tek uygulamada, **Diyanet doğruluğunda ve internetsiz** birleştirmek.

Kategorideki boşluk net: doğru vakit veren uygulamalar hantal ve çirkin, tasarımı iyi olanlar Diyanet vaktini vermiyor. Başarı, kullanıcının camide duyduğu ezanla uygulamadaki saatin **birebir tutması** ve bunu görmek için hiçbir şeyi beklememesidir.

İkinci amaç: gizlilik. Sunucu yok, hesap yok, konum cihazdan çıkmıyor. Bu mimari bir gerçek, pazarlama vaadi değil.

## Brand Personality

**Berrak, sakin, dürüst.**

Uygulama kendini göstermez, cevabı gösterir. Ses tonu sade Türkçe; ne resmî bir tebliğ dili ne de samimiyet taklidi. Dinî terimler doğru ve tam yazılır (Sübhânallâh, asr-ı sânî), uydurma sadeleştirme yapılmaz.

Duygusal hedef **berraklık** — huşu değil. Huşu kullanıcının kendi getirdiği şeydir; uygulamanın işi onun önüne çıkmamaktır.

## Anti-references

- **Muslim Pro** — ibadet ekranlarına tıkıştırılmış reklam, agresif premium baskısı, elli özellik hiçbiri parlak değil. Ayrıca konum verisi skandalı: güven bir kez kırılınca geri gelmiyor.
- **Ezan Vakti Pro / Diyanet Namaz Vaktim** — 2010'larda kalmış yoğun kart-tablo düzeni, gradyanlı başlıklar, ikon kalabalığı, minik dokunma hedefleri.
- **Cami silueti + yeşil-altın + geometrik süsleme** — kategorinin birinci refleksi. Bize ait değil.
- **Beyaz zemin + ince sans "temiz minimal"** — kategorinin ikinci refleksi, bir kat derinde duran klişe. Ondan da kaçınıyoruz.
- Dev sayı + küçük etiket + degrade vurgu (SaaS "hero metric" kalıbı).

## Design Principles

1. **Cevap en büyük şeydir.** Ekrandaki her öge "ezana ne kadar var" sorusuyla yer için yarışır. Kazanamayacaksa ekranda olmamalı.
2. **Gösterge paneli değil, tarife.** Gün bir zaman çizelgesidir; "şimdi" onun üzerinde işaretlidir. Kart yığını değil.
3. **Renk bilgidir, süs değil.** Yüzey rengi günün hangi vaktinde olduğumuzu söyler. Anlam taşımayan renk kullanılmaz.
4. **Büyük yazı bir taviz değil, düzenin kendisidir.** Tipografiyle kurulmuş hiyerarşi %135 ölçekte de ayakta kalır; kartlarla kurulmuş hiyerarşi kırılır.
5. **İbadet ekranı satılık değildir.** Kıble, tesbih ve dua ekranlarında reklam yok — bu kısıt değil, ürünün duruşu.

## Accessibility & Inclusion

Hedef **WCAG 2.2 AAA** (normal metin 7:1, büyük metin 4.5:1). AA taban değil tavan sayılmaz; AAA tutturulamayan yerde gerekçesi yazılır.

- Varsayılan gövde yazısı kategoriye göre büyük.
- **Okuma metinlerinde yazı boyutu VE yazı tipi seçilebilir olmalı — ikisi de zorunlu.** Yaşlı kullanıcıda bunlar iki ayrı problemdir: harflerin birbirine karışması (ı/i, rn/m, 3/8) boyut büyütmekle çözülmez, harf biçimiyle çözülür. Bu yüzden düşük görme için tasarlanmış bir yazı tipi seçeneği (Atkinson Hyperlegible) her zaman sunulur.
- **Arapça ve Latin metin ölçekleri birbirinden bağımsızdır.** Arapça harekeleriyle birlikte geldiği için aynı puntoda Latin metinden küçük okunur; tek ölçekle ikisini birden ayarlamak daima birini bozar. Arapça yazı tipi de ayrıca seçilir (klasik nesih / azami netlik).
- Okuma ayarları yalnızca Ayarlar'a gömülü değil, okuma ekranının kendi içinden de erişilebilir olmalı — kullanıcı yazıyı okurken büyütmek ister, ayarlara gidip geri dönmek istemez.
- Sistem yazı boyutu ayarına tam uyum; hiçbir metin sabit yükseklikli kaba hapsedilmez.
- Dokunma hedefleri en az 48×48 pt.
- Ekran okuyucu etiketleri Türkçe ve anlamlı; saatler "on altı kırk iki" diye okunacak şekilde etiketlenir, ham "16:42" bırakılmaz.
- Renk asla tek başına bilgi taşımaz — geçmiş/sıradaki vakit ayrımı renkle birlikte konum, ağırlık ve etiketle de belirtilir.
- `prefers-reduced-motion` karşılığı: geri sayım dışındaki tüm hareket kapanır.
- Gece modu (sıcak, kısık) mavi ışığa duyarlı kullanıcılar ve karanlıkta okuma için ayrı bir mod olarak tutulur.
