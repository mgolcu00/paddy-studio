import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Laptop, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function CTASection() {
  const { currentUser } = useAuth();

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-gradient-to-tr from-indigo-600 via-purple-700 to-pink-600 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-gradient-radial from-white/10 via-white/5 to-transparent rounded-full filter blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-80 h-80 bg-gradient-radial from-white/10 via-white/5 to-transparent rounded-full filter blur-3xl opacity-40" />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-64 h-64 bg-gradient-radial from-cyan-500/20 via-cyan-500/10 to-transparent rounded-full filter blur-3xl opacity-30" />
      
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-shadow-md">
          {currentUser 
            ? "Projelerinizi Oluşturmaya Devam Edin" 
            : "Projenizi Bugün Başlatın"}
        </h2>
        
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
          {currentUser 
            ? "Paddy Studio ile tasarım sürecinizi hızlandırın ve kusursuz kullanıcı arayüzleri oluşturun."
            : "Paddy Studio'nun gücünü keşfedin ve kod yazmadan harika arayüzler oluşturmanın keyfini çıkarın. Ücretsiz deneyin!"}
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold mb-1">1000+</p>
            <p className="text-white/80 text-sm">Aktif Kullanıcı</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold mb-1">50+</p>
            <p className="text-white/80 text-sm">Hazır Bileşen</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold mb-1">3B+</p>
            <p className="text-white/80 text-sm">Görüntülenen Tasarım</p>
          </div>
        </div>
        
        {currentUser ? (
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-white/90 to-white text-purple-700 hover:from-white hover:to-white shadow-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl px-10 py-4 group"
            >
              <Link to="/console">
                <Laptop className="mr-2.5 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" /> 
                Dashboard'a Git
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="text-white border-white/50 bg-white/10 hover:bg-white/20 hover:border-white/80 backdrop-blur-sm transition-all duration-300 px-10 py-4 group"
            >
              <Link to="/console/editor">
                <Zap className="mr-2.5 h-5 w-5 transition-transform duration-300 group-hover:translate-y-[-2px]" />
                Yeni Proje Oluştur
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-white/90 to-white text-purple-700 hover:from-white hover:to-white shadow-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl px-10 py-4 group"
            >
              <Link to="/auth?mode=signup">
                <Sparkles className="mr-2.5 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" /> 
                Ücretsiz Hesap Oluştur
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="text-white border-white/50 bg-white/10 hover:bg-white/20 hover:border-white/80 backdrop-blur-sm transition-all duration-300 px-10 py-4 group"
            >
              <Link to="/pricing">
                Fiyatlandırma
                <ArrowRight className="ml-2.5 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
        
        <p className="mt-10 text-white/70 text-sm">
          <Clock className="inline-block mr-1 h-4 w-4 align-text-bottom" /> 
          {currentUser 
            ? "Son düzenleme: " + new Date().toLocaleDateString()
            : "Kurulumu sadece 2 dakika sürüyor"}
        </p>
      </div>
    </section>
  );
}