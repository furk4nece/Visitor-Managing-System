# Visitor Management System (VMS)

Visitor Management System (VMS), şirket ve kurumlarda ziyaretçi giriş-çıkış işlemlerini, personel yönetimini ve kullanıcı yetkilendirmelerini merkezi bir sistem üzerinden yönetmek amacıyla geliştirilmiş full-stack bir web uygulamasıdır.

Proje backend tarafında **Quarkus**, veritabanı olarak **PostgreSQL** kullanmaktadır.

Frontend tarafında projenin mevcut Svelte uygulamasının yanında, frontend modernizasyonu kapsamında geliştirilmeye başlanan **React + TypeScript** uygulaması da repository içerisinde bulunmaktadır.

> **Frontend Migration:** Projenin mevcut frontend'i Svelte ile geliştirilmiştir. Yeni frontend geliştirmeleri React + TypeScript kullanılarak gerçekleştirilmektedir. Bu nedenle repository içerisinde hem `frontend` hem de `frontend-react` klasörleri bulunmaktadır.

---

## İçindekiler

- [Özellikler](#özellikler)
- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Proje Yapısı](#proje-yapısı)
- [Gereksinimler](#gereksinimler)
- [Kurulum](#kurulum)
- [Rol Bazlı Yetkilendirme](#rol-bazlı-yetkilendirme)
- [Derleme](#derleme)
- [Yol Haritası](#yol-haritası)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

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
- Raporlamaların Excel'e çekilmesi

### Rol Bazlı Yetkilendirme

Sistemde üç temel kullanıcı rolü bulunmaktadır:

- `SUPER_ADMIN`
- `ADMIN`
- `RECEPTIONIST`

Her rolün erişebileceği ekranlar ve gerçekleştirebileceği işlemler farklıdır. Detaylar için [Rol Bazlı Yetkilendirme](#rol-bazlı-yetkilendirme) bölümüne bakınız.

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

### Svelte Frontend (`frontend/`)

Mevcut frontend uygulamasında:

- Svelte 5
- Vite
- Tailwind CSS
- Chart.js
- svelte-spa-router

kullanılmaktadır.

### React Frontend (`frontend-react/`)

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
│       │       ├── entity/       # Veritabanı varlıkları (User, Personal, Visitor)
│       │       ├── dto/          # İstek/yanıt veri transfer nesneleri
│       │       ├── resource/     # REST API uç noktaları
│       │       └── service/      # İş mantığı
│       │
│       └── resources/
│           ├── application.properties
│           └── META-INF/         # JWT imzalama anahtarları (repoda YOK, aşağıya bakın)
│
├── frontend/                     # Svelte istemcisi
│   └── src/
│       ├── components/           # Svelte bileşenleri (Login, Sidebar, Yönetim ekranları)
│       ├── lib/                  # API istemcisi ve JWT yardımcıları
│       └── stores/               # Svelte store'ları (auth durumu)
│
├── frontend-react/                # React istemcisi
│   ├── public/
│   ├── src/
│   │   ├── components/            # React bileşenleri
│   │   ├── pages/                 # Sayfa bileşenleri
│   │   ├── context/                # React context (auth durumu)
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
```

---

## Gereksinimler

- JDK 17+
- Maven (proje içindeki `mvnw` sarmalayıcısı yeterli, ayrıca kurmana gerek yok)
- Node.js 18+ ve npm
- PostgreSQL (yerel veya Docker üzerinde çalışan bir instance)

---

## Kurulum

### 1. Depoyu klonla

```bash
git clone https://github.com/furk4nece/Visitor-Managing-System.git
cd Visitor-Managing-System
```

### 2. Veritabanı bağlantısını ayarla

`src/main/resources/application.properties` dosyasını aç ve kendi PostgreSQL bilgilerinle doldur:

```properties
quarkus.datasource.reactive.url=postgresql://localhost:5433/vms
quarkus.datasource.username=postgres
quarkus.datasource.password=kendi_sifren
```

> Bu dosya `.gitignore` ile takip edilmediği için değişiklikleriniz repoya gitmez, güvenle doldurabilirsiniz.

### 3. JWT anahtar çiftini oluştur

Güvenlik nedeniyle `privateKey.pem` ve `publicKey.pem` dosyaları repoya dahil edilmemiştir. `src/main/resources/META-INF/` klasörü altına kendi anahtar çiftinizi oluşturup ekleyin:

```bash
openssl genrsa -out privateKey.pem 2048
openssl rsa -pubout -in privateKey.pem -out publicKey.pem
```

### 4. Backend'i çalıştır

```bash
./mvnw quarkus:dev
```

- API: `http://localhost:8080`
- Dev UI: `http://localhost:8080/q/dev/`

### 5. Frontend'i çalıştır

İki frontend de aynı portta çalıştığı için **aynı anda değil, tek seferde birini** ayağa kaldırman gerekir.

**Seçenek A — Svelte (`frontend/`):**

```bash
cd frontend
npm install
npm run dev
```

**Seçenek B — React (`frontend-react/`):**

```bash
cd frontend-react
npm install
npm run dev
```

Hangisini seçersen seç, uygulama aynı backend API'sine (`http://localhost:8080`) bağlanır.

---

## Rol Bazlı Yetkilendirme

Sistemde üç rol bulunur: **SUPER_ADMIN**, **ADMIN**, **RECEPTIONIST**.

### Ekran / işlem bazında erişim

| Ekran / İşlem | SUPER_ADMIN | ADMIN | RECEPTIONIST |
|---|:---:|:---:|:---:|
| Ziyaretçiler (görüntüleme, check-in/check-out) | ✅ | ✅ | ✅ |
| Personel — görüntüleme | ✅ | ✅ | ✅ |
| Personel — ekleme / düzenleme / silme | ✅ | ✅ | ❌ |
| Raporlar | ✅ | ✅ | ✅ |
| Kullanıcılar — görüntüleme | ✅ | ✅ | ❌ |
| Kullanıcılar — ekleme / düzenleme / silme | ✅ (aşağıya bakın) | ✅ (aşağıya bakın) | ❌ |
| Kendi profilini görüntüleme / güncelleme | ✅ | ✅ | ✅ |

### Kullanıcı yönetiminde rol bazlı kademe

Kullanıcı ekleme/düzenleme/silme işlemleri, hedef kullanıcının rolüne göre kademeli olarak sınırlandırılmıştır:

| İşlem | SUPER_ADMIN | ADMIN |
|---|---|---|
| Kullanıcı oluşturma | Her role (`RECEPTIONIST`, `ADMIN`, `SUPER_ADMIN`) sahip kullanıcı oluşturabilir | Sadece `RECEPTIONIST` rolüyle kullanıcı oluşturabilir |
| Kullanıcı düzenleme | Herhangi bir kullanıcıyı, herhangi bir role atayabilir | Sadece mevcut rolü `RECEPTIONIST` olan kullanıcıları düzenleyebilir; bu kullanıcıyı `RECEPTIONIST` veya `ADMIN` yapabilir, `SUPER_ADMIN` yapamaz |
| Kullanıcı silme | Kendisi hariç herkesi silebilir | Kendisi, başka bir `ADMIN` veya `SUPER_ADMIN` rolündeki kullanıcıları silemez; sadece `RECEPTIONIST` kullanıcıları silebilir |

Bu kurallar hem backend'de (`UserService`) hem her iki frontend'de de uygulanmıştır; frontend arayüz elemanlarını role göre gizler, backend ise API seviyesinde aynı kuralları zorunlu kılar.

---

## Derleme

### Backend

```bash
./mvnw package
```

Üretilen `quarkus-run.jar` dosyası şu şekilde çalıştırılır:

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

### Frontend

**Svelte:**

```bash
cd frontend
npm run build
```

**React:**

```bash
cd frontend-react
npm run build
```

---

## Yol Haritası

- [ ] React + TypeScript frontend'in tamamlanması ve Svelte frontend'in yerini alması
- [ ] Docker Compose ile tek komutla ayağa kaldırma
- [ ] E-posta bildirimleri (ziyaretçi check-in bildirimi)
- [ ] Ziyaretçi fotoğrafı / QR kod ile check-in
- [ ] Test kapsamının artırılması (unit / integration)

> Bu bölümü projenin gerçek planına göre güncelleyebilirsin.

---

## Katkıda Bulunma

Katkılar memnuniyetle karşılanır!

1. Bu repoyu fork'layın
2. Yeni bir branch oluşturun (`git checkout -b ozellik/harika-ozellik`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Harika özellik eklendi'`)
4. Branch'inizi push'layın (`git push origin ozellik/harika-ozellik`)
5. Bir Pull Request açın

---

## Lisans

Bu proje bir staj çalışması kapsamında geliştirilmiştir.
