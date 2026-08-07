# Visitor Management System (VMS)

Şirket içi ziyaretçi giriş-çıkış takibi, personel yönetimi ve raporlama için geliştirilmiş full-stack bir uygulama. Backend **Quarkus (reactive)**, frontend **Svelte + Vite** ile yazılmıştır.

## Özellikler

- **Ziyaretçi Yönetimi** — ziyaretçi check-in / check-out, aktif ziyaretçi listesi, çıkış loglama
- **Personel Yönetimi** — şirket personelinin (ziyaret edilen kişilerin) kayıtlarının tutulması, `ADMIN` ve `SUPER_ADMIN` için ekleme/düzenleme/silme
- **Kullanıcı Yönetimi** — sistem kullanıcılarının listelenmesi, oluşturulması, düzenlenmesi ve silinmesi (`ADMIN` ve `SUPER_ADMIN`, yetki seviyesi role göre kademeli)
- **Raporlama** — en çok ziyaret edilen personel grafiği ve haftalık ziyaretçi trafiği grafiği
- **Rol Bazlı Yetkilendirme** — JWT ile kimlik doğrulama, `SUPER_ADMIN`, `ADMIN` ve `RECEPTIONIST` rolleri için farklı erişim seviyeleri
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

Sistemde üç rol bulunur: **SUPER_ADMIN**, **ADMIN**, **RECEPTIONIST**.

### Ekran / işlem bazında erişim

| Ekran / İşlem | SUPER_ADMIN | ADMIN | RECEPTIONIST |
|---|:---:|:---:|:---:|
| Ziyaretçiler (görüntüleme, check-in/check-out) | ✅ | ✅ | ✅ |
| Personel — görüntüleme | ✅ | ✅ | ✅ |
| Personel — ekleme / düzenleme / silme | ✅ | ✅ | ❌ |
| Raporlar | ✅ | ✅ | ✅ |
| Kullanıcılar — görüntüleme | ✅ | ✅ | ❌ |
| Kullanıcılar — ekleme, düzenleme, silme | ✅ (aşağıya bakın) | ✅ (aşağıya bakın) | ❌ |
| Kendi profilini görüntüleme / güncelleme | ✅ | ✅ | ✅ |

### Kullanıcı yönetiminde rol bazlı kademe

Kullanıcı ekleme/düzenleme/silme işlemleri, hedef kullanıcının rolüne göre kademeli olarak sınırlandırılmıştır:

| İşlem | SUPER_ADMIN | ADMIN |
|---|---|---|
| Kullanıcı oluşturma | Her role (`RECEPTIONIST`, `ADMIN`, `SUPER_ADMIN`) sahip kullanıcı oluşturabilir | Sadece `RECEPTIONIST` rolüyle kullanıcı oluşturabilir |
| Kullanıcı düzenleme | Herhangi bir kullanıcıyı, herhangi bir role atayabilir | Sadece mevcut rolü `RECEPTIONIST` olan kullanıcıları düzenleyebilir; bu kullanıcıyı `RECEPTIONIST` veya `ADMIN` yapabilir, `SUPER_ADMIN` yapamaz |
| Kullanıcı silme | Kendisi hariç herkesi silebilir | Kendisi, başka bir `ADMIN` veya `SUPER_ADMIN` rolündeki kullanıcıları silemez; sadece `RECEPTIONIST` kullanıcıları silebilir |

Bu kurallar hem backend'de (`UserService`) hem frontend'de (`KullaniciYonetimi.svelte`) uygulanmıştır; frontend arayüz elemanlarını role göre gizler, backend ise API seviyesinde aynı kuralları zorunlu kılar.

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
