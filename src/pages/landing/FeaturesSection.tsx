import { LayoutIcon, ComponentIcon, MoveIcon, CodeIcon, SettingsIcon, PaletteIcon, SmartphoneIcon, DatabaseIcon, CornerDownRightIcon, ZapIcon, GlobeIcon, ServerIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 lg:py-40 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950 overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full filter blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-100/30 dark:bg-purple-900/10 rounded-full filter blur-3xl opacity-40 -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4 tracking-wider">
            GÜÇLÜ ÖZELLİKLER
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] leading-tight font-bold tracking-tighter mb-5 text-gray-900 dark:text-gray-100">
            Yaratıcılığınızı <span className="text-purple-600 dark:text-purple-400">Serbest Bırakın</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Paddy Studio, fikirlerinizi koda dönüştürme zahmetinden kurtararak tasarıma odaklanmanızı sağlar.
          </p>
        </div>
        
        {/* Öne Çıkan Özellik */}
        <div className="relative mb-24 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 text-white z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Sürükle & Bırak Arayüzü</h3>
              <p className="text-white/80 mb-8">Kod bilgisi gerekmeden, görsel olarak tasarım yapın. Componentleri sürükleyin, düzenleyin ve anında sonucu görün.</p>
              <Button asChild className="bg-white hover:bg-white/90 text-purple-700 font-semibold">
                <Link to="/features">Daha Fazla Bilgi</Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-transparent md:hidden"></div>
              <img 
                src="https://placehold.co/600x400/A855F7/FFFFFF/png?text=Drag+%26+Drop+Interface" 
                alt="Sürükle & Bırak Arayüz" 
                className="object-cover w-full h-full" 
              />
            </div>
          </div>
          {/* Dekoratif elementler */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>
        </div>

        {/* Özellik Kartları - 3x3 Grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Özellik Kart 1 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <LayoutIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Sürükle & Bırak</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Elementleri anında tuvalinize taşıyın ve düzenleyin. Gerçek zamanlı önizleme ile tasarımınızı anında görün.
                </p>
              </div>
            </div>
          </div>

          {/* Özellik Kart 2 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <ComponentIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">50+ Hazır Bileşen</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Button, Image, Card gibi hazır UI bileşenlerinden oluşan geniş bir kütüphane ile hızlıca tasarım yapın.
                </p>
              </div>
            </div>
          </div>

          {/* Özellik Kart 3 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <SmartphoneIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Duyarlı Tasarım</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Mobil, tablet ve masaüstü görünümlerini tek tıkla önizleyin. Tüm cihazlarda mükemmel görünen arayüzler oluşturun.
                </p>
              </div>
            </div>
          </div>

          {/* Özellik Kart 4 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <PaletteIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Detaylı Stil Kontrolü</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Renk, yazı tipi, kenar yuvarlaklığı, gölgeler ve daha fazlasını kolayca özelleştirin. Marka kimliğinize uygun tasarımlar yaratın.
                </p>
              </div>
            </div>
          </div>

          {/* Özellik Kart 5 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Anlık Düzenleme</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Özellikleri değiştirin, sonucu anında canlı olarak görün. Tasarım süreci hiç bu kadar hızlı ve etkili olmamıştı.
                </p>
              </div>
            </div>
          </div>

          {/* Özellik Kart 6 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <CodeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Kolay Entegrasyon</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Temiz JSON çıktısı ile tasarımlarınızı herhangi bir projeye kolayca entegre edin. Java SDK desteği ile entegrasyonu basitleştirin.
                </p>
              </div>
            </div>
          </div>

          {/* Özellik Kart 7 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <DatabaseIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Veri Bağlama</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Bileşenlerinizi veri kaynaklarına kolayca bağlayın. Dinamik içerik görüntüleme, JSON veri bağlama ile basitleşir.
                </p>
              </div>
            </div>
          </div>

          {/* Özellik Kart 8 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <CornerDownRightIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Takım Çalışması</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Projelerinizi ekibinizle paylaşın, ortak çalışma yapın ve gerçek zamanlı değişiklikleri takip edin.
                </p>
              </div>
            </div>
          </div>

          {/* Özellik Kart 9 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.03]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <ZapIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Hızlı Prototipleme</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Fikirlerinizi dakikalar içinde işleyen prototiplere dönüştürün. Kullanıcı deneyimini önceden test edin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Yeni bölüm: İş Akışı Süreci */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 tracking-wider">
              KOLAY İŞ AKIŞI
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Sadece <span className="text-indigo-600 dark:text-indigo-400">Üç Adımda</span> Fikirden Ürüne
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Paddy Studio, karmaşık tasarım süreçlerini basitleştirir. Kodlama bilgisi gerektirmeden arayüzünüzü oluşturabilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Adım 1 */}
            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Bileşenleri Seçin</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hazır UI bileşenleri kütüphanesinden ihtiyacınız olanları sürükleyip bırakın.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 md:mt-8">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Özelleştirin</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stiller, içerik ve davranışları ihtiyaçlarınıza göre basitçe düzenleyin.
              </p>
            </div>

            {/* Adım 3 */}
            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 md:mt-16">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mb-4">3</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Entegre Edin</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bitmiş tasarımınızı JSON olarak dışa aktarın ve uygulamanıza kolayca entegre edin.
              </p>
            </div>

            {/* Bağlantı Çizgisi */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform -translate-y-8" />
          </div>
        </div>

        {/* Çağrı Düğmesi */}
        <div className="mt-24 text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Link to="/features">
              Tüm Özellikleri Keşfedin
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}