const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      /**
       * Varsayılan kural JSX metninde kesme işaretini de yasaklıyor.
       * Türkçe'de ek ayırmak için kesme işareti zorunlu ("Faz 1'de",
       * "Kâbe'ye", "Diyanet'in") ve arayüz metinlerinin tamamı Türkçe;
       * hepsini &apos; yazmak kaynağı okunmaz hale getirirdi.
       *
       * Kuralı kapatmıyoruz — yalnızca JSX'i gerçekten bozabilen
       * karakterleri (`>` ve `}`) yasaklı bırakıyoruz.
       */
      'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    },
  },
  {
    ignores: [
      'dist/*',
      '.expo/*',
      // drizzle-kit tarafından üretilen migration paketi
      'drizzle/*',
    ],
  },
]);
