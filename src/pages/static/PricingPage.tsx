import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckIcon, ArrowRight, CreditCard, Package, Zap, HelpCircle, Crown } from 'lucide-react';
import { Footer } from '@/pages/landing/Footer';
import { useAuth } from '@/context/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PricingPlan } from '@/types';
import { getPricingPlans } from '@/services/pricingService';
import { defaultPricingPlans } from '@/services/pricingService';

export function PricingPage() {
  const { currentUser } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(defaultPricingPlans);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getPricingPlans();
        if (plans && plans.length > 0) {
          setPricingPlans(plans);
        }
      } catch (error) {
        console.error('Fiyatlandırma planları yüklenemedi:', error);
        // Hata durumunda varsayılan planları kullan
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const calculateSavings = (plan: PricingPlan) => {
    if (!plan.yearlyPrice || plan.price === 0) return 0;
    const monthlyCost = plan.price * 12;
    return Math.round(((monthlyCost - plan.yearlyPrice) / monthlyCost) * 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPlanButtonText = (plan: PricingPlan) => {
    if (plan.price === 0) return 'Ücretsiz Başla';
    if (plan.trialDays) return `${plan.trialDays} Gün Dene`;
    return 'Hemen Başla';
  };

  const getPlanColor = (planId: string) => {
    switch(planId) {
      case 'free':
        return {
          light: 'from-blue-50 to-blue-100/50',
          medium: 'bg-blue-100',
          border: 'border-blue-200',
          text: 'text-blue-700',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      case 'pro':
        return {
          light: 'from-purple-50 to-purple-100/50',
          medium: 'bg-purple-100',
          border: 'border-purple-200',
          text: 'text-purple-700',
          button: 'bg-purple-600 hover:bg-purple-700 text-white'
        };
      case 'enterprise':
        return {
          light: 'from-amber-50 to-amber-100/50',
          medium: 'bg-amber-100',
          border: 'border-amber-200',
          text: 'text-amber-700',
          button: 'bg-amber-600 hover:bg-amber-700 text-white'
        };
      default:
        return {
          light: 'from-sky-50 to-sky-100/50',
          medium: 'bg-sky-100',
          border: 'border-sky-200',
          text: 'text-sky-700',
          button: 'bg-sky-600 hover:bg-sky-700 text-white'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-6 px-4 md:px-6 border-b bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/10 dark:to-indigo-950/10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Paddy Studio</Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Özellikler
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-primary font-semibold transition-colors">
              Fiyatlandırma
            </Link>
            <Link to="/docs" className="text-sm font-medium hover:text-primary transition-colors">
              Dökümantasyon
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                <Link to="/console">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/auth?mode=login">Giriş Yap</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  <Link to="/auth?mode=signup">Kaydol</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-violet-100 via-indigo-50 to-background dark:from-violet-950/20 dark:via-indigo-950/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Projenize Uygun Plan
              </h1>
              <p className="text-xl text-muted-foreground mb-16 max-w-[80%] mx-auto">
                İhtiyaçlarınıza en uygun abonelik planını seçin ve hemen kullanmaya başlayın.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex justify-center items-center space-x-6 mb-20">
                <span className={`text-lg font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Aylık Ödeme
                </span>
                <div className="relative">
                  <Switch 
                    checked={isYearly} 
                    onCheckedChange={setIsYearly} 
                    id="billing-toggle"
                    className="scale-150 data-[state=checked]:bg-green-600"
                  />
                  <Badge variant="outline" className="absolute -right-4 -top-4 text-xs py-0.5 px-2 text-green-600 border-green-600/30 bg-green-100/70 dark:bg-green-900/30 font-semibold">
                    %20 İndirim
                  </Badge>
                </div>
                <span className={`text-lg font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Yıllık Ödeme
                </span>
              </div>
              
              {/* Pricing Cards */}
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {pricingPlans.map((plan) => {
                  const colors = getPlanColor(plan.id);
                  return (
                    <div 
                      key={plan.id}
                      className={`relative bg-gradient-to-b ${colors.light} rounded-2xl border-2 ${plan.popular ? `${colors.border} shadow-xl` : 'border-transparent shadow-lg'} transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-md flex items-center">
                          <Crown className="h-4 w-4 mr-1.5" />
                          EN POPÜLER
                        </div>
                      )}
                      
                      <div className="p-8 pt-12 flex-1 flex flex-col">
                        <h3 className={`text-3xl font-bold mb-2 ${colors.text}`}>{plan.name}</h3>
                        <p className="text-muted-foreground mb-8 text-lg">{plan.description}</p>
                        
                        <div className="mb-8">
                          <span className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-700">
                            {formatPrice(isYearly && plan.yearlyPrice ? (plan.yearlyPrice / 12) : plan.price)}
                          </span>
                          <span className="text-muted-foreground ml-2 text-xl">/ ay</span>
                          
                          {isYearly && plan.yearlyPrice && plan.price > 0 && (
                            <div className="mt-3 text-base text-green-600 font-semibold bg-green-100/70 py-1 px-3 rounded-full inline-block">
                              {calculateSavings(plan)}% tasarruf (yıllık ödemede)
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          size="lg"
                          className={`mb-10 text-lg py-6 ${colors.button} ${plan.popular ? 'shadow-md' : ''}`}
                          asChild
                        >
                          <Link to={currentUser ? "/console/billing" : "/auth?mode=signup"}>
                            {getPlanButtonText(plan)}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                        
                        <div className="space-y-5 mt-auto">
                          <h4 className="text-xl font-semibold">Özellikler:</h4>
                          <ul className="space-y-5">
                            {plan.features.slice(0, 5).map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <div className={`${colors.medium} p-1 rounded-full mr-3 mt-0.5 flex-shrink-0`}>
                                  <CheckIcon className={`h-5 w-5 ${colors.text}`} />
                                </div>
                                <span className="text-lg">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {plan.limitations && (
                        <div className={`px-8 py-6 ${colors.medium} border-t rounded-b-2xl`}>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center">
                              <Package className={`h-6 w-6 ${colors.text} mr-3`} />
                              <span className="text-lg font-medium">
                                {plan.limitations.projects === 'unlimited' 
                                  ? 'Sınırsız proje' 
                                  : `${plan.limitations.projects} proje`}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Zap className={`h-6 w-6 ${colors.text} mr-3`} />
                              <span className="text-lg font-medium">
                                {plan.limitations.storage} GB Depolama
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-violet-50/50 dark:to-violet-950/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Sıkça Sorulan Sorular</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Planlar ve özellikler hakkında merak edilenler
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-6">
                <AccordionItem value="item-1" className="border-2 border-violet-200/50 rounded-xl px-8 shadow-sm">
                  <AccordionTrigger className="text-xl py-6">Planlar arasında nasıl geçiş yapabilirim?</AccordionTrigger>
                  <AccordionContent className="text-lg pb-6">
                    Hesap ayarlarınızdaki "Abonelik" bölümünden dilediğiniz zaman plan değişikliği yapabilirsiniz. Üst seviye bir plana geçiş yaptığınızda, mevcut ödemenizden kalan tutar yeni plan için kredi olarak kullanılır.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-2 border-violet-200/50 rounded-xl px-8 shadow-sm">
                  <AccordionTrigger className="text-xl py-6">Ücretsiz plan her zaman ücretsiz kalacak mı?</AccordionTrigger>
                  <AccordionContent className="text-lg pb-6">
                    Evet, ücretsiz planımız her zaman ücretsiz olarak kalacaktır. Belirli sınırlamalara sahip olsa da, platformumuzu denemek ve küçük projeler için mükemmel bir seçenektir.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-2 border-violet-200/50 rounded-xl px-8 shadow-sm">
                  <AccordionTrigger className="text-xl py-6">İstediğim zaman iptal edebilir miyim?</AccordionTrigger>
                  <AccordionContent className="text-lg pb-6">
                    Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde, ödeme döneminizin sonuna kadar tüm premium özelliklere erişiminiz devam eder.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-2 border-violet-200/50 rounded-xl px-8 shadow-sm">
                  <AccordionTrigger className="text-xl py-6">Ekip üyeleri eklemek için ne yapmalıyım?</AccordionTrigger>
                  <AccordionContent className="text-lg pb-6">
                    Pro ve Kurumsal planlarımızda, projelerinize ekip üyeleri ekleyebilirsiniz. Dashboard'daki "Ekip" bölümünden davet göndererek yeni üyeler ekleyebilirsiniz.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Hemen Başlayın</h2>
            <p className="text-white/90 max-w-3xl mx-auto mb-12 text-xl">
              İhtiyaçlarınıza en uygun planı seçin ve hemen kullanmaya başlayın.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90 text-xl py-7 px-10 shadow-lg" asChild>
                <Link to="/auth?mode=signup">
                  <Zap className="mr-2 h-6 w-6" />
                  Ücretsiz Başla
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-xl py-7 px-10 shadow-lg" asChild>
                <Link to="/contact">
                  <HelpCircle className="mr-2 h-6 w-6" />
                  Destek Al
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Yardımcı ikonlar
function Users({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Database({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}