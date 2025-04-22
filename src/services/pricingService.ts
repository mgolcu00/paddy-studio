import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PricingPlan } from '@/types';

// Fiyatlandırma planlarını getir
export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    const plansRef = collection(db, 'pricingPlans');
    const plansQuery = query(plansRef, where('available', '==', true));
    const querySnapshot = await getDocs(plansQuery);
    
    const plans: PricingPlan[] = [];
    querySnapshot.forEach((doc) => {
      plans.push({
        id: doc.id,
        ...doc.data()
      } as PricingPlan);
    });
    
    // Fiyata göre sırala (küçükten büyüğe)
    return plans.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    throw new Error('Fiyatlandırma planları yüklenemedi');
  }
}

// Belirli bir planın detaylarını getir
export async function getPricingPlanById(planId: string): Promise<PricingPlan | null> {
  try {
    const planRef = doc(db, 'pricingPlans', planId);
    const planDoc = await getDoc(planRef);
    
    if (planDoc.exists()) {
      return {
        id: planDoc.id,
        ...planDoc.data()
      } as PricingPlan;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching pricing plan ${planId}:`, error);
    throw new Error('Fiyatlandırma planı detayları yüklenemedi');
  }
}

// Default planları oluşturmak için (Admin tarafında kullanılabilir)
export const defaultPricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Ücretsiz',
    description: 'Başlangıç için mükemmel. Temel özellikleri keşfedin.',
    price: 0,
    features: [
      '3 projeye kadar',
      'Temel bileşenler',
      'Topluluk desteği',
      'JSON dışa aktarma'
    ],
    limitations: {
      projects: 3,
      storage: 1,
      teamMembers: 1,
      apiCalls: 100
    },
    available: true
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Profesyoneller ve küçük ekipler için',
    price: 99,
    yearlyPrice: 990, // Yıllık %17 indirim
    features: [
      'Sınırsız proje',
      'Gelişmiş bileşenler',
      'Öncelikli e-posta desteği',
      'Özel temalar',
      'Ekip işbirliği',
      'API erişimi'
    ],
    limitations: {
      projects: 'unlimited',
      storage: 10,
      teamMembers: 5,
      apiCalls: 10000
    },
    popular: true,
    badge: 'Popüler',
    available: true,
    trialDays: 14
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    description: 'Büyük ekipler ve organizasyonlar için',
    price: 299,
    yearlyPrice: 2990, // Yıllık %17 indirim
    features: [
      'Pro plandaki her şey',
      'Gelişmiş güvenlik',
      'Özel entegrasyonlar',
      'Özel API limitleri',
      'Özel destek yöneticisi',
      'Öncelikli destek',
      'SSO kimlik doğrulama'
    ],
    limitations: {
      projects: 'unlimited',
      storage: 100,
      teamMembers: 'unlimited',
      apiCalls: 'unlimited'
    },
    available: true,
    trialDays: 30
  }
]; 