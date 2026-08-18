# Visitor Management System (VMS)

Visitor Management System (VMS), şirket ve kurumlarda ziyaretçi giriş-çıkış işlemlerini, personel yönetimini ve kullanıcı yetkilendirmelerini merkezi bir sistem üzerinden yönetmek amacıyla geliştirilmiş full-stack bir web uygulamasıdır.

Proje backend tarafında Quarkus, veritabanı olarak PostgreSQL kullanmaktadır.

Frontend tarafında projenin mevcut Svelte uygulamasının yanında, frontend modernizasyonu kapsamında geliştirilmeye başlanan React + TypeScript uygulaması da repository içerisinde bulunmaktadır.

> **Frontend Migration:** Projenin mevcut frontend'i Svelte ile geliştirilmiştir. Yeni frontend geliştirmeleri React + TypeScript kullanılarak gerçekleştirilmektedir. Bu nedenle repository içerisinde hem `frontend` hem de `frontend-react` klasörleri bulunmaktadır.

---

## Özellikler

### Ziyaretçi Yönetimi

- Ziyaretçi kaydı oluşturma
- Ziyaretçi giriş (Check-in) işlemi
- Ziyaretçi çıkış (Check-out) işlemi
- Aktif ziyaretçileri görüntüleme
- Pasif ve geçmiş ziyaretçileri görüntüleme
- Ziyaretçi giriş tarih ve saatlerini takip etme
- Ziyaretçi kayıtlarını yönetme

### Personel Yönetimi

- Personel listesini görüntüleme
- Personel ekleme
- Personel bilgilerini düzenleme
- Personel silme
- Ziyaret edilecek personellerin yönetimi

### Kullanıcı Yönetimi

- Sistem kullanıcılarını görüntüleme
- Kullanıcı oluşturma
- Kullanıcı bilgilerini düzenleme
- Kullanıcı silme
- Rol bazlı kullanıcı yönetimi

### Dashboard ve Raporlama

- Aktif ziyaretçi takibi
- Ziyaretçi girişlerinin görüntülenmesi
- En çok ziyaret edilen personeller
- Haftalık ziyaretçi trafiği
- Grafik tabanlı raporlama

### Rol Bazlı Yetkilendirme

Sistemde üç temel kullanıcı rolü bulunmaktadır:

- `SUPER_ADMIN`
- `ADMIN`
- `RECEPTIONIST`

Her rolün erişebileceği ekranlar ve gerçekleştirebileceği işlemler farklıdır.

### Profil Yönetimi

Kullanıcılar kendi profil bilgilerini görüntüleyebilir ve güncelleyebilir.

---

## Kullanılan Teknolojiler

### Backend

| Teknoloji | Kullanım |
|---|---|
| Java | Backend geliştirme |
| Quarkus | REST API ve uygulama altyapısı |
| Hibernate Reactive with Panache | ORM |
| Reactive PostgreSQL Client | Veritabanı bağlantısı |
| PostgreSQL | Veritabanı |
| SmallRye JWT | Authentication / Authorization |
| Jakarta REST | REST API |
| Maven | Build ve dependency yönetimi |

### Svelte Frontend

Mevcut frontend uygulamasında:

- Svelte 5
- Vite
- Tailwind CSS
- Chart.js
- svelte-spa-router

kullanılmaktadır.

### React Frontend

Yeni frontend geliştirmesinde:

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- JWT Authentication

kullanılmaktadır.

---

## Proje Yapısı

```text
Visitor-Managing-System/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/fullstack/
│       │       ├── entity/
│       │       ├── dto/
│       │       ├── resource/
│       │       └── service/
│       │
│       └── resources/
│           ├── application.properties
│           └── META-INF/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── lib/
│       └── stores/
│
├── frontend-react/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── .mvn/
├── .dockerignore
├── .gitignore
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
