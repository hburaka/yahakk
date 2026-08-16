# Durum

**Son güncelleme:** 16 Ağustos 2026

Bu dosya "bir ay sonra döndüğümde ne yapıyordum" sorusunun cevabı.
Ürün kararları `PRODUCT.md`'de, tasarım kuralları `DESIGN.md`'de.

---

## Tek cümlede

**imanlio** yayına hazır. Production `.aab` alındı, Play Console'a
yüklenmeyi bekliyor. Kod tarafında bekleyen iş yok; kalanlar hesap
açma, görsel üretme ve içerik onayı gibi insan işleri.

---

## Şu an nerede

| | |
|---|---|
| Kod | Bitti. 104 test, tip ve lint temiz |
| İçerik | 20 ilmihal konusu, 46 dua, 99 esmâ, 14 zikir şablonu |
| Paket | `com.imanlio.app` — **ilk gönderimden sonra değişmez** |
| EAS | `@hburakas-team/imanlio` (`f184775d-5cf7-432c-b63b-e91e57a4d7c6`) |
| Depo | `github.com/hburaka/imanlio` — **public** |
| Gizlilik politikası | https://hburaka.github.io/imanlio/gizlilik-politikasi/ |
| Son derleme | production `.aab`, 15 Ağustos 2026, versionCode 2 |

Yayın kapısı: `npm run release-check` → **0 engel, 2 uyarı**

---

## Sırada ne var

Numaralar öncelik sırası. İlk üçü olmadan mağazaya gidilmez.

1. **Ekran görüntüleri ve öne çıkan görsel.** Play Console en az 2
   ekran görüntüsü (1080×1920 ideal) ve 1024×500 öne çıkan görsel
   istiyor. Bunları uygulamayı çalıştırıp çekmek gerekiyor.

2. **Internal testing.** `.aab`'yi önce Internal testing kanalına
   yükle, kendi telefonuna kur, beş ekranı da gez. Bu derleme ilk kez
   gerçek AdMob kimlikleriyle ve ProGuard açıkken üretildi; ProGuard
   yalnızca release'te ortaya çıkan hatalara yol açabiliyor.

3. **Data Safety formu.** Play Console'da zorunlu. Özet
   `docs/magaza-metni.md` sonunda. **Kritik nokta:** "veri toplamıyoruz"
   derken AdMob'u ayrıca beyan etmek gerekiyor; Google, reklam
   SDK'sının topladığını senin beyanın sayıyor.

4. **İmza anahtarını yedekle.** `npx eas-cli credentials` →
   Android → production → Keystore → Download. Kaybedilirse uygulama
   bir daha güncellenemez.

5. **RevenueCat** (isteğe bağlı). Anahtar yokken "Uygulamayı destekle"
   bölümü arayüzde hiç görünmüyor, yani reklamlar kaldırılamıyor.
   Sonradan eklenebilir; `app.json` → `extra.revenueCatAndroidKey`.

6. **Ezan sesi** (isteğe bağlı). Telifi net bir kayıt lazım, iOS için
   30 saniyeden kısa. Şu an telefonun varsayılan bildirim sesi
   kullanılıyor. Ses seçimi altyapısı hazır, sadece dosya yok.

---

## Açık soru

`28d8d45` commit'inde 66 dinî metnin `reviewed` bayrağı `true`ya
çevrildi ve taslak uyarıları kaldırıldı. Uygulama artık içeriğin ehil
biri tarafından kontrol edildiğini söylüyor.

**Bu onayın gerçekten alınıp alınmadığı burada kayıtlı değil.** Geniş
yayına çıkmadan önce teyit edilmeli. Bayrağı geri çevirmek tek satır:
`reviewed: false` yapıldığında uyarılar kendiliğinden geri gelir
(`src/app/ilmihal/[id].tsx` ve `src/app/dua/[id].tsx`).

---

## Bilmen gereken tuzaklar

Bunlar bir kez canımızı yaktı, tekrar yakmasın.

**`react-native-google-mobile-ads` 16.3.4'te sabit.** 16.4.0,
`play-services-ads` 25.4.0 istiyor ve o Kotlin 2.3 ile derlenmiş; Expo
SDK 57 Kotlin 2.1 kullanıyor, derleme düşüyor. Kotlin'i yükseltmek de
çözmüyor, bu sefer `expo-modules-core` kırılıyor. Expo Kotlin 2.3'e
geçene kadar yükseltilmeyecek.

**Native yapılandırma değiştiyse önce prebuild.**
`npx expo prebuild --platform android --clean` çalıştırıp üretilen
`AndroidManifest.xml`'i gözle kontrol et, sonra `android/` klasörünü
sil. Prebuild 30 saniye, derleme 25 dakika ve aylık kotadan yiyor.
Bu kural uygulanmadığı için bir oturumda üç derleme boşa gitti.

**Derleme düşerse tahmin yürütme, log indir.**
`eas build:view <id> --json` çıktısındaki `logFiles[0]` tam Gradle
metnini veriyor. Panelde görünen "unknown gradle error" hiçbir şey
söylemiyor.

**Sekmeler unmount olmuyor.** Başka sekmeye geçildiğinde ekran arka
planda mount kalıyor, `useEffect` temizleme fonksiyonu çalışmıyor.
Sensör veya zamanlayıcı kullanan her kanca `useIsFocused()` ile
kapatılmalı. Bu yüzden kıble titreşimi ekrandan çıkınca devam ediyordu
ve sallayarak sayma yanlış ekranda sayıyordu.

**Geliştirmede asla gerçek AdMob kimliği kullanma.** Kendi reklamına
tıklamak sayılıyor ve hesap askıya alınıyor. Kod bunu zorluyor:
`__DEV__` iken her zaman test kimliği.

---

## Nasıl devam edilir

```bash
npm install
npm run verify          # typecheck + lint + test
npm run release-check    # yayın kapısı
npx expo start --tunnel  # dev client ile telefonda çalıştır
```

Derleme:

```bash
npx eas-cli build --profile preview --platform android     # test APK
npx eas-cli build --profile production --platform android  # mağaza .aab
```

---

## Nerede ne var

| Dosya | İçerik |
|---|---|
| `PRODUCT.md` | Kullanıcı kim, hangi ilkeler, neyden kaçınıyoruz |
| `DESIGN.md` | Renk, tipografi, buton dili, başlık hiyerarşisi |
| `docs/magaza-metni.md` | Play Console metinleri, Data Safety özeti |
| `docs/gizlilik-politikasi.md` | Yayınlanan gizlilik politikası |
| `scripts/release-check.mjs` | Yayın öncesi kontrol listesi |
| `scripts/compare-diyanet.mjs` | Vakit doğruluğu ölçümü |

Kodda alışılmadık bir karar gördüğünde gerekçesi genelde hemen
üstündeki yorumda. Bu proje boyunca "neden böyle" sorusunun cevabı
koda yazıldı, ayrı bir yere değil.
