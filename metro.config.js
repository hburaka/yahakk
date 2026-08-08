const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Drizzle migration'ları .sql dosyası olarak paketleniyor; Metro'nun
// bunları kaynak dosya gibi çözebilmesi için uzantıyı eklemek gerekiyor.
config.resolver.sourceExts.push('sql');

module.exports = config;
