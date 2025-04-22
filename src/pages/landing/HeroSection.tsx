import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative py-28 md:py-36 lg:py-44 overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200/30 dark:bg-purple-600/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-600/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] leading-tight font-extrabold tracking-tighter text-gray-900 dark:text-gray-100">
              Hayalinizdeki Arayüzü <span className="text-purple-600">Kod Yazmadan</span> Tasarlayın
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-[600px]">
              Sezgisel sürükle-bırak editörümüzle çarpıcı kullanıcı arayüzlerini kolayca oluşturun, özelleştirin ve yayınlayın. Sıfır kod bilgisiyle profesyonel sonuçlar elde edin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-transform transform hover:scale-105 px-8 py-3">
                <Link to="/auth?mode=signup">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50 px-8 py-3">
                <Link to="#features">
                  <PlayCircle className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Nasıl Çalışır?
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative lg:ml-auto group w-full max-w-xl">
            <div className="absolute -inset-2 bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200 rounded-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 filter blur-xl -z-10" />
            <div className="relative p-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden transition-all duration-500 group-hover:shadow-purple-200/40 dark:group-hover:shadow-indigo-900/40">
              <div className="flex items-center justify-between p-3 bg-gray-100/70 dark:bg-gray-800/70 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 pr-2">Paddy Editor</div>
              </div>
              <div className="grid grid-cols-12 gap-4 p-6 h-[340px] bg-gradient-to-br from-white/20 to-transparent dark:from-gray-800/20">
                <div className="col-span-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3 space-y-3 opacity-90">
                  <div className="h-6 bg-gray-300/70 dark:bg-gray-600/70 rounded"></div>
                  <div className="h-6 bg-gray-300/70 dark:bg-gray-600/70 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-300/70 dark:bg-gray-600/70 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300/70 dark:bg-gray-600/70 rounded w-3/4"></div>
                   <div className="h-6 bg-gray-300/70 dark:bg-gray-600/70 rounded"></div>
                </div>
                <div className="col-span-6 bg-white/50 dark:bg-gray-700/40 rounded-lg p-4 border border-gray-200/40 dark:border-gray-600/50 shadow-inner flex flex-col justify-start items-center space-y-4 opacity-95">
                   <div className="h-16 w-full bg-gradient-to-r from-blue-100/60 to-indigo-100/60 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-md shadow-sm" />
                   <div className="h-24 w-4/5 bg-gray-100/60 dark:bg-gray-600/40 rounded-md flex items-center justify-center p-4">
                     <div className="h-10 w-full bg-purple-400/80 dark:bg-purple-600/60 rounded-md shadow"/>
                   </div>
                   <div className="h-12 w-full bg-gray-100/60 dark:bg-gray-600/40 rounded-md" />
                </div>
                <div className="col-span-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg p-3 space-y-2.5 opacity-90">
                    <div className="h-5 bg-gray-300/70 dark:bg-gray-600/70 rounded"></div>
                    <div className="h-5 bg-gray-300/70 dark:bg-gray-600/70 rounded w-5/6"></div>
                     <div className="h-4 bg-gray-400/70 dark:bg-gray-500/70 rounded-full w-1/2"></div>
                    <div className="h-5 bg-gray-300/70 dark:bg-gray-600/70 rounded"></div>
                    <div className="h-5 bg-gray-300/70 dark:bg-gray-600/70 rounded w-2/3"></div>
                    <div className="h-5 bg-gray-300/70 dark:bg-gray-600/70 rounded"></div>
                     <div className="h-4 bg-gray-400/70 dark:bg-gray-500/70 rounded-full w-1/3"></div>
                     <div className="h-5 bg-gray-300/70 dark:bg-gray-600/70 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}