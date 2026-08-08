module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Drizzle migration'ları .sql dosyaları olarak import ediliyor.
      // Bu plugin olmadan Metro onları JavaScript sanıp parse etmeye
      // çalışıyor ve "Missing semicolon" hatası veriyor.
      ['inline-import', { extensions: ['.sql'] }],
    ],
  };
};
