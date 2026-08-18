# VMS Frontend — React'e Geçiş

Bu klasör, orijinal Svelte 5 + Vite frontend'inin React + TypeScript + Vite
karşılığıdır. Backend (Quarkus) hiç dokunulmadı, aynı `/api` uçlarını kullanır.

## Klasör yapısı

```
src/
├── ui-kit/            ← BAĞIMSIZ, tekrar kullanılabilir bileşen modülü
│   ├── components/     Button, TextInput, Select, Checkbox, Card, Modal,
│   │                    DataGrid, Badge, Spinner, Alert, Pagination
│   └── index.ts         tek giriş noktası: import { Button } from '@ui'
├── lib/                apiClient (axios + JWT interceptor), auth (jwt-decode)
├── context/             AuthContext (Svelte'deki stores/auth.js karşılığı)
├── routes/               ProtectedRoute (role bazlı route koruması)
├── components/Layout/   Sidebar, AppLayout
└── pages/                Login, Visitors, Personal, Users, Reports,
                          Profile — hepsi tam işlevsel
```

## `ui-kit` neden ayrı bir modül?

- Hiçbir dosyası `pages/`, `lib/` ya da `context/`'e import etmiyor —
  tamamen bağımsız. İstersen olduğu gibi kopyalayıp başka bir React
  projesine yapıştırabilir, ya da `packages/ui-kit` adıyla bir npm
  workspace paketine çevirip birden fazla projede `@vms/ui-kit` olarak
  kullanabilirsin.
- Renk teması tek noktadan (`tailwind.config.js` → `primary` paleti)
  yönetiliyor, bileşenlerde sabit hex kodu yok.
- Her bileşen kendi klasöründe (`Button/Button.tsx` + `Button/index.ts`),
  yeni bileşen eklemek aynı deseni tekrar etmek kadar basit.

## Durum

Tüm sayfalar (Login, Visitors, Personal, Users, Reports, Profile) tam
işlevsel; backend endpoint'leriyle eşleştirilmiş; `npm run build`
(`tsc -b && vite build`) hatasız geçiyor.

**Kimlik/rol modeli notu:** JWT sadece `username` ve `roles` taşıyor,
numerik kullanıcı id'si taşımıyor. `AuthContext`, oturum açıldığında
ek olarak `GET /users/me` çağırıp dönen `id`'yi context'e ekliyor —
`UsersPage.tsx`'teki "kullanıcı kendi hesabını yönetemez" kontrolü
bu id'ye dayanıyor. Rol bazlı görünürlük kontrollerinde her yerde
`useAuth().hasRole(...)` kullanılıyor; sayfa içinde elle
`roles` dizisini string'e çevirip karşılaştırma yapılmıyor.

## Yeni bir bileşen eklerken

`src/ui-kit/components/<Name>/<Name>.tsx` oluştur, aynı klasöre bir
`index.ts` (`export * from './<Name>'`) ekle, sonra `src/ui-kit/index.ts`
içine bir satır ekle. Böylece hem bu proje hem de ileride ayıracağın
paket aynı yapıyı korur.
