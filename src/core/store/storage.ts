import { createMMKV, type MMKV } from 'react-native-mmkv';

/**
 * Senkron key-value deposu — tema tercihi, seçili ilçe, onboarding
 * durumu gibi açılışta anında lazım olan küçük ayarlar için.
 *
 * Senkron olması önemli: tema tercihi asenkron okunsaydı uygulama
 * her açılışta bir kare yanlış temayla çizilip "flash" ederdi.
 *
 * Hacimli veriler (yıllık namaz vakitleri, tesbih oturumları, dua
 * favorileri) buraya değil SQLite'a yazılır — bkz. src/core/db.
 */
export const storage: MMKV = createMMKV({ id: 'yahakk-settings' });

export const StorageKeys = {
  themePreference: 'theme.preference',
  /** Latin (Türkçe) okuma metni ölçeği */
  readingScale: 'theme.readingScale',
  /** Latin okuma yazı tipi */
  readingFont: 'theme.readingFont',
  /** Arapça ölçeği — Latin'den bağımsız, bkz. arabicScales */
  arabicScale: 'theme.arabicScale',
  /** Arapça yazı tipi */
  arabicFont: 'theme.arabicFont',
  madhab: 'settings.madhab',
  /** İkindi: asr-ı evvel (Diyanet) / asr-ı sânî (Hanefî) */
  asrMethod: 'settings.asrMethod',
  /** Hesaplama metodu — yalnızca Diyanet anlık görüntüsü yokken kullanılır */
  calculationMethod: 'settings.calculationMethod',
  /** Yüksek enlem kuralı — Türkiye'de etkisi yok */
  highLatitudeRule: 'settings.highLatitudeRule',
  /** İftar ihtiyat payı — akşam vaktine eklenen dakika */
  maghribMargin: 'settings.maghribMargin',
  /** Sahur ihtiyat payı — imsaktan çıkarılan dakika */
  fajrMargin: 'settings.fajrMargin',
  selectedLocationId: 'location.selectedId',
  /**
   * Tesbih ekranında seçili olan. `t:<şablon>` tekil zikir,
   * `s:<set>` zincirli set anlamına gelir.
   */
  selectedZikirId: 'tesbih.selectedZikirId',
  /** Seçili hedef sayı — zikir değişince şablonun varsayılanına döner */
  zikirTarget: 'tesbih.target',
  /** Zincirli sette kaçıncı adımda kalındığı */
  zikirSetStep: 'tesbih.setStep',
  /**
   * Sallayarak sayma açık mı.
   *
   * Varsayılan KAPALI ve bu bilinçli. Yanlış sayım sessiz bir hata:
   * kullanıcı zikri çektiğini sanır, çekmemiştir. Açan kişi ne yaptığını
   * bilmeli. Algılama yön değişimi arayarak yürüyüş ve darbeleri eliyor
   * (bkz. shake.ts) ama sıfır risk diye bir şey yok.
   */
  tesbihShake: 'tesbih.shake',
  /** Tesbihte sayma kipi (kontroller gizli, ekranın tamamı hedef) */
  tesbihFullscreen: 'tesbih.fullscreen',
  /**
   * Kıblede titreşimle yön bulma açık mı.
   *
   * Varsayılan açık: bu ekrana zaten kıbleyi aramak için giriliyor,
   * rehberlik istenen şeyin ta kendisi. Titreşim yalnızca bu ekran
   * açıkken çalışıyor, arka planda değil.
   */
  qiblaHaptics: 'qibla.haptics',
  /**
   * Varsayılan favoriler bir kez eklendi mi.
   *
   * Bayrak olmadan, tüm favorilerini silen kullanıcının karşısına
   * varsayılanlar tekrar çıkardı — sildiği şey geri gelirdi.
   */
  favoritesSeeded: 'tesbih.favoritesSeeded',
  onboardingCompleted: 'onboarding.completed',
  /** ATT izni kaç açılıştır ertelendi — 2-3. açılışta sorulacak */
  launchCount: 'app.launchCount',
} as const;
