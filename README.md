# Proje Adı (Örnek: Görsel Arayüz Oluşturucu)

Bu proje, kullanıcıların web arayüzlerini görsel olarak tasarlayıp oluşturmalarına olanak tanıyan web tabanlı bir uygulamadır. Sürükle-bırak arayüzü, bileşen paleti ve özellik düzenleyici gibi araçlarla geliştirme sürecini hızlandırmayı hedefler.

## Temel Özellikler

*   **Görsel Editör:**
    *   **Tuval (`Canvas`):** Arayüzlerin görsel olarak oluşturulduğu ana alan.
    *   **Bileşen Paleti (`ComponentPalette`):** Kullanılabilir UI bileşenlerinin listelendiği ve tuvale sürüklenebildiği bölüm.
    *   **Özellik Düzenleyici (`PropertyEditor`):** Seçili bileşenin özelliklerinin (metin, renk, boyut vb.) ayarlandığı panel.
    *   **Katman Görünümü (`LayerView`):** Arayüzdeki bileşenlerin hiyerarşik yapısını gösteren ve yönetilmesini sağlayan bölüm.
    *   **JSON Önizleme (`JsonPreview`):** Oluşturulan arayüzün JSON temsilini görme imkanı.
*   **Bileşen Kütüphanesi:** Proje, `shadcn/ui` tabanlı geniş bir hazır UI bileşenleri seti (`src/components/ui`) sunar. Ayrıca özel bileşenler (`src/components/ui-components`) de bulunmaktadır.
*   **Proje Yönetimi:** Kullanıcılar projeler oluşturabilir ve yönetebilir (`src/pages/project`).
*   **Kullanıcı Kimlik Doğrulama:** Firebase Auth kullanılarak güvenli kullanıcı girişi ve kaydı (`src/context/AuthContext`, `src/pages/auth`).
*   **Abonelik ve Faturalandırma:** Kullanıcıların abonelik planlarını yönetebileceği ve faturalandırma bilgilerini görebileceği sayfalar (`src/pages/dashboard/UserBillingPage`, `src/services/subscriptionService`, `src/services/pricingService`).
*   **Ayarlar:** Kullanıcı hesap ayarları ve API anahtarı yönetimi (`src/pages/dashboard/UserSettingsPage`, `src/services/apiKeyService`).
*   **Landing Page:** Uygulamanın özelliklerini ve faydalarını tanıtan bir karşılama sayfası (`src/pages/landing`).

## Kullanılan Teknolojiler

*   **Frontend:**
    *   React
    *   TypeScript
    *   Vite (Build aracı ve geliştirme sunucusu)
    *   Tailwind CSS (Stil için)
    *   shadcn/ui (UI Bileşen Kütüphanesi)
    *   React Router (Sayfa yönlendirme için - `App.tsx` içinde kullanıldığı varsayılıyor)
    *   React Context API (`AuthContext` için) veya başka bir state management kütüphanesi
*   **Backend/Servisler:**
    *   Firebase (Authentication, Firestore/Realtime Database - veri depolama için muhtemelen, Cloud Functions - backend logic için muhtemelen)
*   **Diğer:**
    *   ESLint (Kod kalitesi ve stil kontrolü)

## Proje Yapısı

Projenin ana kodları `src` klasörü altında bulunur:

```
src
├── App.tsx                 # Ana uygulama bileşeni ve yönlendirme (routing)
├── main.tsx                # Uygulamanın giriş noktası
├── index.css               # Global CSS stilleri
├── components/             # Tekrar kullanılabilir UI bileşenleri
│   ├── editor/             # Editörle ilgili bileşenler (Toolbar vb.)
│   ├── layout/             # Sayfa düzeni bileşenleri (ProtectedRoute, ThemeProvider vb.)
│   ├── ui/                 # shadcn/ui tabanlı temel UI bileşenleri
│   └── ui-components/      # Uygulamaya özel daha karmaşık UI bileşenleri (Canvas, PropertyEditor vb.)
├── context/                # React Context API ile global state yönetimi (örn. AuthContext)
├── hooks/                  # Özel React hook'ları (örn. use-toast)
├── lib/                    # Yardımcı fonksiyonlar, Firebase yapılandırması, varsayılan bileşen tanımları vb.
├── pages/                  # Uygulamanın farklı sayfaları
│   ├── auth/               # Kimlik doğrulama sayfası
│   ├── dashboard/          # Kullanıcı paneli sayfaları (Dashboard, Ayarlar, Faturalandırma)
│   ├── editor/             # Ana görsel editör sayfası
│   ├── landing/            # Karşılama sayfası ve bölümleri
│   ├── project/            # Proje genel bakış sayfası
│   └── static/             # Statik sayfalar (Fiyatlandırma, Hukuki, 404)
├── services/               # Backend API veya Firebase ile iletişim kuran servisler
├── types/                  # TypeScript tip tanımlamaları
└── vite-env.d.ts           # Vite için ortam değişkeni tipleri
```

## Başlarken

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Önkoşullar:**
    *   Node.js (LTS sürümü önerilir)
    *   npm veya yarn paket yöneticisi

2.  **Projeyi Klonlayın:**
    ```bash
    git clone <repository-url>
    cd <proje-dizini>
    ```

3.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    # veya
    yarn install
    ```

4.  **Ortam Değişkenleri:**
    *   `.env.local` adında bir dosya oluşturun (veya `.env` dosyasını kopyalayın).
    *   Bu dosyaya Firebase projenizin yapılandırma bilgilerini ve diğer gerekli API anahtarlarını ekleyin. `.env.local` dosyasının içeriği genellikle şuna benzer:
        ```
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        # Diğer gerekli API anahtarları...
        ```
    *   **Not:** Gerçek anahtarlarınızı asla Git reposuna commit etmeyin! `.gitignore` dosyasının `.env.local` gibi dosyaları içerdiğinden emin olun.

5.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    # veya
    yarn dev
    ```
    Uygulama genellikle `http://localhost:5173` (Vite varsayılanı) adresinde açılacaktır.

6.  **Production Build'i Oluşturun:**
    ```bash
    npm run build
    # veya
    yarn build
    ```
    Bu komut, deploy edilmeye hazır optimize edilmiş dosyaları `dist` klasörüne oluşturur.

## Katkıda Bulunma

(Eğer proje açık kaynaklıysa veya katkı kabul ediliyorsa buraya katkıda bulunma yönergeleri eklenebilir.)

## Lisans

(Projenin lisansı varsa burada belirtilebilir, örn. MIT Lisansı.)
