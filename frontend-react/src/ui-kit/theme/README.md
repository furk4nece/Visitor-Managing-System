# Tema

Bileşenler Tailwind class'ları + `primary-*` renk paletini kullanır
(bkz. `tailwind.config.js`). Başka bir projeye taşırken sadece:

1. `tailwind.config.js` içindeki `primary` renklerini o projenin marka
   rengine göre güncelle,
2. `ui-kit` klasörünü olduğu gibi kopyala.

Bileşenler hiçbir yerde sabit hex renk kullanmıyor, hepsi Tailwind
utility class'ları üzerinden gidiyor — böylece tema değişikliği tek
noktadan yönetiliyor.
