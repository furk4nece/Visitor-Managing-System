# Visitor Management System (VMS)

**Visitor Management System (VMS)**, şirket ve kurumlarda ziyaretçi giriş-çıkış süreçlerini dijital olarak yönetmek, personel bilgilerini takip etmek ve kullanıcıların yetkilerini rol bazlı olarak kontrol etmek amacıyla geliştirilmiş full-stack bir web uygulamasıdır.

Proje; **Quarkus tabanlı REST API**, **PostgreSQL veritabanı** ve modern **React + TypeScript** frontend mimarisi kullanılarak geliştirilmiştir.

---

##  Özellikler

###  Ziyaretçi Yönetimi

- Ziyaretçi kaydı oluşturma
- Ziyaretçi check-in işlemi
- Ziyaretçi check-out işlemi
- Aktif ziyaretçileri görüntüleme
- Geçmiş / pasif ziyaretçileri görüntüleme
- Ziyaretçi giriş tarih ve saatlerinin takibi
- Ziyaretçi kayıtlarının yönetilmesi

###  Personel Yönetimi

- Personel listesini görüntüleme
- Personel ekleme
- Personel bilgilerini düzenleme
- Personel silme
- Ziyaret edilecek personelin yönetimi

###  Kullanıcı ve Yetkilendirme Sistemi

Sistem JWT tabanlı kimlik doğrulama ve rol bazlı yetkilendirme kullanır.

Desteklenen roller:

- `SUPER_ADMIN`
- `ADMIN`
- `RECEPTIONIST`

Her rolün sistem içerisindeki erişim yetkileri farklıdır.

###  Dashboard ve Raporlama

Dashboard üzerinden:

- Aktif ziyaretçi sayısı
- Ziyaretçi girişleri
- Ziyaretçi trafiği
- Personel bazlı ziyaret istatistikleri
- Grafiksel raporlar

görüntülenebilir.

###  Profil Yönetimi

Kullanıcılar kendi profil bilgilerini görüntüleyebilir ve güncelleyebilir.

###  Modern React Arayüzü

Frontend aşağıdaki teknolojiler kullanılarak geliştirilmiştir:

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- JWT authentication

Arayüzde tekrar kullanılabilir UI bileşenleri kullanılarak daha düzenli ve sürdürülebilir bir frontend mimarisi oluşturulmuştur.

---

##  Kullanılan Teknolojiler

### Backend

| Teknoloji | Kullanım |
|---|---|
| Java | Backend geliştirme |
| Quarkus | REST API ve uygulama altyapısı |
| Hibernate Reactive with Panache | ORM / veritabanı işlemleri |
| PostgreSQL | Veritabanı |
| SmallRye JWT | Kimlik doğrulama ve yetkilendirme |
| Jakarta REST | REST API |
| Maven | Dependency ve build yönetimi |

### Frontend

| Teknoloji | Kullanım |
|---|---|
| React | Kullanıcı arayüzü |
| TypeScript | Tip güvenli JavaScript |
| Vite | Frontend build ve development server |
| Tailwind CSS | UI / styling |
| Axios | HTTP API istekleri |
| React Router | Sayfa ve route yönetimi |
| Chart.js | Grafik ve raporlama |

---

##  Proje Yapısı

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
├── frontend-react/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── .gitignore
├── .dockerignore
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

##  Gereksinimler

Projeyi çalıştırmak için aşağıdaki yazılımların kurulu olması gerekir:

- **JDK 17+**
- **Node.js 18+**
- **npm**
- **PostgreSQL**
- Git

Maven ayrıca kurulmak zorunda değildir. Proje içerisinde Maven Wrapper bulunmaktadır.

---

#  Kurulum

## 1. Repository'yi klonla

```bash
git clone https://github.com/furk4nece/Visitor-Managing-System.git
cd Visitor-Managing-System
```

---

## 2. PostgreSQL veritabanını oluştur

PostgreSQL üzerinde `vms` isimli bir veritabanı oluştur.

Örneğin:

```sql
CREATE DATABASE vms;
```

Ardından backend'in veritabanı bağlantı bilgilerini kendi ortamına göre yapılandır.

`src/main/resources/application.properties`

```properties
quarkus.datasource.reactive.url=postgresql://localhost:5433/vms
quarkus.datasource.username=postgres
quarkus.datasource.password=YOUR_PASSWORD
```

> Kullanılan PostgreSQL portu kendi sistemindeki yapılandırmaya göre değiştirilmelidir.

---

## 3. JWT anahtarlarını oluştur

JWT authentication için gerekli anahtarların oluşturulması gerekir.

`src/main/resources/META-INF/` klasörü içerisinde:

```bash
openssl genrsa -out privateKey.pem 2048
```

Ardından:

```bash
openssl rsa -pubout -in privateKey.pem -out publicKey.pem
```

oluşturulmalıdır.

> `privateKey.pem` gibi gizli anahtarlar kesinlikle GitHub repository'sine gönderilmemelidir.

---

#  Backend'i çalıştırma

Proje ana dizinindeyken:

### Windows

```bash
mvnw.cmd quarkus:dev
```

### Linux / macOS

```bash
./mvnw quarkus:dev
```

Backend varsayılan olarak:

```text
http://localhost:8080
```

adresinde çalışır.

Quarkus Dev UI:

```text
http://localhost:8080/q/dev/
```

---

#  React Frontend'i çalıştırma

Yeni React frontend klasörüne geç:

```bash
cd frontend-react
```

Bağımlılıkları yükle:

```bash
npm install
```

Development server'ı başlat:

```bash
npm run dev
```

Frontend varsayılan olarak:

```text
http://localhost:5173
```

adresinde çalışır.

---

#  Backend - Frontend İletişimi

React frontend, backend REST API ile HTTP üzerinden iletişim kurar.

API temel adresi:

```text
/api/v1
```

Development ortamında Vite proxy kullanılarak istekler Quarkus backend'e yönlendirilir.

Örnek:

```text
React
  │
  │ HTTP /api/v1/...
  ▼
Vite Proxy
  │
  ▼
Quarkus
  │
  ▼
PostgreSQL
```

Axios client üzerinden JWT token kullanılarak authenticated API istekleri gerçekleştirilir.

---

#  Rol Bazlı Yetkilendirme

Sistemde üç temel kullanıcı rolü bulunmaktadır:

| İşlem | SUPER_ADMIN | ADMIN | RECEPTIONIST |
|---|:---:|:---:|:---:|
| Ziyaretçileri görüntüleme | ✅ | ✅ | ✅ |
| Check-in / Check-out | ✅ | ✅ | ✅ |
| Personel görüntüleme | ✅ | ✅ | ✅ |
| Personel ekleme | ✅ | ✅ | ❌ |
| Personel düzenleme | ✅ | ✅ | ❌ |
| Personel silme | ✅ | ✅ | ❌ |
| Kullanıcıları görüntüleme | ✅ | ✅ | ❌ |
| Kullanıcı oluşturma | ✅ | ✅ | ❌ |
| Kullanıcı düzenleme | ✅ | Yetkiye göre | ❌ |
| Kullanıcı silme | ✅ | Yetkiye göre | ❌ |
| Raporları görüntüleme | ✅ | ✅ | ✅ |
| Kendi profilini yönetme | ✅ | ✅ | ✅ |

### Kullanıcı yönetimi

Kullanıcı yönetiminde ayrıca hiyerarşik yetkilendirme uygulanır.

`ADMIN` kullanıcılarının diğer `ADMIN` veya `SUPER_ADMIN` kullanıcılarını silmesi engellenir.

`SUPER_ADMIN` ise sistem içerisindeki diğer kullanıcılar üzerinde daha geniş yetkilere sahiptir.

Bu kontroller hem frontend hem de backend tarafında uygulanmaktadır.

> Frontend tarafındaki butonların gizlenmesi tek başına güvenlik mekanizması değildir. Asıl yetkilendirme backend API seviyesinde gerçekleştirilmelidir.

---

# 🖥️ Frontend Sayfaları

React frontend içerisinde temel olarak aşağıdaki bölümler bulunmaktadır:

- Login
- Dashboard
- Ziyaretçiler
- Personeller
- Kullanıcı Yönetimi
- Profil
- Raporlar

Arayüzde role göre kullanıcıların erişebileceği sayfalar ve işlemler sınırlandırılır.

---

#  API Yapısı

Backend REST API aşağıdaki temel kaynaklar üzerinden çalışır:

```text
/api/v1
```

Örneğin:

```text
/api/v1/auth
/api/v1/users
/api/v1/personals
/api/v1/visitors
```

API endpoint'leri JWT authentication ile korunmaktadır.

---

#  Güvenlik

Projede aşağıdaki güvenlik mekanizmaları kullanılmaktadır:

- JWT Authentication
- Role Based Access Control
- Backend API authorization
- Frontend route protection
- Protected API requests
- Gizli JWT private key'lerinin repository dışında tutulması
- Veritabanı bilgilerinin ortam bazlı yapılandırılması

**Önemli:** Gerçek şifre, private key, token veya production secret bilgileri GitHub repository'sine eklenmemelidir.

---

#  Build

Backend'i production için build etmek:

```bash
./mvnw package
```

Windows:

```bash
mvnw.cmd package
```

Oluşturulan uygulama:

```text
target/quarkus-app/quarkus-run.jar
```

ile çalıştırılabilir.

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

React frontend için:

```bash
cd frontend-react
npm run build
```

---

#  Geliştirme Planı

Projeye ilerleyen aşamalarda aşağıdaki özelliklerin eklenmesi planlanmaktadır:

- [ ] Daha gelişmiş dashboard
- [ ] Gelişmiş ziyaretçi filtreleme
- [ ] Detaylı raporlama
- [ ] Ziyaretçi geçmişi
- [ ] PDF / Excel rapor çıktıları
- [ ] Daha gelişmiş kullanıcı yetkilendirme
- [ ] Audit log sistemi
- [ ] Docker ile kolay kurulum
- [ ] Production deployment
- [ ] Otomatik testler

---

#  Proje

Bu proje bir **staj çalışması** kapsamında geliştirilmiştir.

Amaç; modern web teknolojileri kullanılarak şirket içerisindeki ziyaretçi, personel ve kullanıcı yönetiminin tek bir sistem üzerinden gerçekleştirilmesidir.

---

##  Lisans

Bu proje eğitim ve staj amacıyla geliştirilmiştir.
