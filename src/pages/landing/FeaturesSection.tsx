import { LayoutIcon, ComponentIcon, MoveIcon, CodeIcon, SettingsIcon, PaletteIcon } from 'lucide-react';
import React from 'react';

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 lg:py-40 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950 overflow-hidden">
       {/* Subtle background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full filter blur-3xl opacity-40 -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-100/30 dark:bg-purple-900/10 rounded-full filter blur-3xl opacity-40 -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] leading-tight font-bold tracking-tighter mb-5 text-gray-900 dark:text-gray-100">
            Yaratıcılığınızı Serbest Bırakın
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Paddy Studio, fikirlerinizi koda dönüştürme zahmetinden kurtararak tasarıma odaklanmanızı sağlar.
          </p>
        </div>
        
        {/* Redesigned Features Grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature Card 1 */}
          <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:scale-[1.03]">
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                 <LayoutIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Sürükle & Bırak</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Elementleri anında tuvalinize taşıyın ve düzenleyin.
                </p>
              </div>
            </div>
          </div>
           {/* Feature Card 2 */}
           <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:scale-[1.03]">
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                 <ComponentIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Hazır Bileşenler</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                   Kullanıma hazır, özelleştirilebilir bileşenlerle başlayın.
                </p>
              </div>
            </div>
          </div>
           {/* Feature Card 3 */}
           <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:scale-[1.03]">
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                 <MoveIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Duyarlı Tasarım</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                   Tüm ekran boyutlarına otomatik uyum sağlayan tasarımlar.
                </p>
              </div>
            </div>
          </div>
          {/* Feature Card 4 */}
           <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:scale-[1.03]">
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                 <PaletteIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Stil Kontrolü</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                   Renklerden boşluklara, her detayı kolayca ayarlayın.
                </p>
              </div>
            </div>
          </div>
          {/* Feature Card 5 */}
           <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:scale-[1.03]">
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                 <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Anlık Düzenleme</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                   Özellikleri değiştirin, sonucu anında canlı görün.
                </p>
              </div>
            </div>
          </div>
          {/* Feature Card 6 */}
           <div className="group rounded-xl border border-gray-200/70 dark:border-gray-800/60 bg-white/50 dark:bg-gray-950/40 backdrop-blur-lg p-6 transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-950/60 hover:shadow-xl hover:scale-[1.03]">
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                 <CodeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">JSON Çıktısı</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                   Temiz ve yapısal JSON ile projelerinize entegre edin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}