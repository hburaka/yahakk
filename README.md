# imanlio

Namaz vakitleri, kıble, tesbih, dua ve ilmihal. Tek uygulamada, Türkçe.

**Sunucu yok. Hesap yok. Konum cihazdan çıkmıyor.** Bu bir vaat değil,
mimarinin sonucu: veriyi saklayacağımız bir yer yok.

- Uygulama: Android (Play Store'a hazırlanıyor)
- Gizlilik politikası: https://hburaka.github.io/imanlio/gizlilik-politikasi/

---

## Ne yapıyor

**Vakitler** cihazda astronomik hesapla bulunuyor, internet gerekmiyor.
Ankara ve İstanbul için 122 gün Diyanet'in yayınladığı vakitlerle
karşılaştırıldı: en büyük sapma 2 dakika, ortalama sıfır. Ölçüm
`scripts/compare-diyanet.mjs` ile tekrarlanabilir.

**Kıble** gerçek kuzeye göre, manyetik sapma düzeltilerek. Titreşimle
yön bulma var: telefonu çevirdikçe titreşim sıklaşıyor, ekrana bakmadan
kıble bulunabiliyor.

**Tesbih** ekranın tamamını sayma alanı yapıyor. Zincirli tesbihat
setleri otomatik ilerliyor, yarım kalan zikir kaldığı yerden devam
ediyor. Sallayarak sayma ve tam ekran sayma kipi var.

**Dua ve ilmihal** Hanefî ve Şâfiî için ayrı ayrı. Fark yüzeysel değil:
Şâfiî'de imama uyan Fâtiha'yı kendi okur, Hanefî'de susup dinler.
Tek metinle anlatmak okuyucunun yarısına yanlış bilgi vermek olurdu.

**İbadet ekranında reklam yok.** Kıble, tesbih, dua ve ilmihal
ekranlarında hiçbir koşulda reklam gösterilmiyor; ezan vaktinin on
dakika öncesi ve sonrası da reklamsız. Bu koda gömülü ve testle
korunan bir kural, tercih değil.

---

## Geliştirme

Expo SDK 57 · React Native 0.86 · TypeScript · expo-router

```bash
npm install
npm run verify           # typecheck + lint + test
npx expo start --tunnel  # dev client ile telefonda çalıştır
```

Reklam ve satın alma native modül gerektiriyor, Expo Go çalışmaz —
dev build şart.

```bash
npx eas-cli build --profile preview --platform android
```

---

## Belgeler

| | |
|---|---|
| [DURUM.md](DURUM.md) | **Buradan başla.** Proje nerede, sırada ne var, hangi tuzaklar var |
| [PRODUCT.md](PRODUCT.md) | Kullanıcı kim, hangi ilkeler |
| [DESIGN.md](DESIGN.md) | Renk, tipografi, buton dili |

---

## Dinî içerik hakkında

İlmihal metinleri Diyanet İşleri Başkanlığı İlmihali esas alınarak
yazıldı. Arapça dua ve âyet metinleri Kur'an-ı Kerîm ve klasik hadis
külliyatındandır, kamu malıdır. Türkçe anlamlar telifli bir mealden
alınmadı; sade biçimde kendimiz yazdık.

Her ekranda kaynak künyesi ve "Bu bilgide hata var" düğmesi var.
Hatayı en iyi okuyan bulur; bildirim için: hburaka@gmail.com

## Lisans

Kod açık, dinî metinlerin kaynakları uygulamada ayrıca belirtiliyor.
