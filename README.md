# Visitor Management System (VMS)

Şirket içi ziyaretçi giriş-çıkış takibi, personel yönetimi ve raporlama için geliştirilmiş full-stack bir uygulama. Backend **Quarkus (reactive)**, frontend **Svelte + Vite** ile yazılmıştır.

## Özellikler

- **Ziyaretçi Yönetimi** — ziyaretçi check-in / check-out, aktif ziyaretçi listesi, çıkış loglama
- **Personel Yönetimi** — şirket personelinin (ziyaret edilen kişilerin) kayıtlarının tutulması
- **Kullanıcı Yönetimi** — sistem kullanıcıları ve rol ataması (sadece ADMIN)
- **Raporlama** — en çok ziyaret edilen personel grafiği ve haftalık ziyaretçi trafiği grafiği
- **Rol Bazlı Yetkilendirme** — JWT ile kimlik doğrulama, `ADMIN` ve `RECEPTIONIST` rolleri için farklı erişim seviyeleri
- **Profil Yönetimi** — kullanıcının kendi profil bilgilerini görüntülemesi ve güncellemesi

## Kullanılan Teknolojiler

**Backend**
- Quarkus (Supersonic Subatomic Java Framework)
- Hibernate Reactive with Panache
- Reactive PostgreSQL Client
- SmallRye JWT (kimlik doğrulama / yetkilendirme)
- Jakarta REST (JAX-RS)

**Frontend**
- Svelte 5 + Vite
- Tailwind CSS
- Chart.js (raporlama grafikleri)
- svelte-spa-router

## Proje Yapısı

```
vms/
├── src/main/java/com/example/fullstack/
│   ├── entity/       # Veritabanı varlıkları (User, Personal, Visitor)
│   ├── dto/          # İstek/yanıt veri transfer nesneleri
│   ├── resource/      # REST API uç noktaları
│   └── service/       # İş mantığı
├── src/main/resources/
│   ├── application.properties
│   └── META-INF/       # JWT imzalama anahtarları (repoda YOK, aşağıya bakın)
└── frontend/
    └── src/
        ├── components/  # Svelte bileşenleri (Login, Sidebar, Yönetim ekranları)
        ├── lib/         # API istemcisi ve JWT yardımcıları
        └── stores/      # Svelte store'ları (auth durumu)
```

## Gereksinimler

- JDK 17+
- Maven (proje içindeki `mvnw` sarmalayıcısı yeterli, ayrıca kurmana gerek yok)
- Node.js 18+ ve npm
- PostgreSQL (yerel veya Docker üzerinde çalışan bir instance)

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

API `http://localhost:8080` adresinde ayağa kalkar. Dev UI: `http://localhost:8080/q/dev/`

### 5. Frontend'i çalıştır

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

## Rol Bazlı Yetkilendirme

| Rol | Yetkiler |
|---|---|
| **ADMIN** | Tüm modüllere tam erişim (kullanıcı, personel, ziyaretçi ekleme/silme/güncelleme, raporları görüntüleme) |
| **RECEPTIONIST** | Ziyaretçi check-in/check-out işlemleri, personel listesini **sadece görüntüleme**, raporları görüntüleme |

## Derleme

```bash
./mvnw package
```

Üretilen `quarkus-run.jar` dosyası şu şekilde çalıştırılır:

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

## Lisans

Bu proje bir staj çalışması kapsamında geliştirilmiştir.
