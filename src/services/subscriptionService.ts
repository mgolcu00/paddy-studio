import { doc, getDoc, updateDoc, collection, getDocs, query, where, orderBy, limit, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubscriptionInfo, Invoice, PaymentHistory, User, BillingDetails } from '@/types';

// Kullanıcının abonelik bilgilerini getir
export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    const userData = userDoc.data() as User;
    return userData.subscription || null;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw new Error('Abonelik bilgileri yüklenemedi');
  }
}

// Kullanıcının faturalarını getir
export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  try {
    const invoicesRef = collection(db, 'invoices');
    const invoicesQuery = query(
      invoicesRef, 
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(invoicesQuery);
    
    const invoices: Invoice[] = [];
    querySnapshot.forEach((doc) => {
      invoices.push({
        id: doc.id,
        ...doc.data()
      } as Invoice);
    });
    
    return invoices;
  } catch (error) {
    console.error('Error fetching user invoices:', error);
    throw new Error('Faturalar yüklenemedi');
  }
}

// Kullanıcının ödeme geçmişini getir
export async function getUserPaymentHistory(userId: string): Promise<PaymentHistory[]> {
  try {
    const paymentsRef = collection(db, 'payments');
    const paymentsQuery = query(
      paymentsRef, 
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(paymentsQuery);
    
    const payments: PaymentHistory[] = [];
    querySnapshot.forEach((doc) => {
      payments.push({
        id: doc.id,
        ...doc.data()
      } as PaymentHistory);
    });
    
    return payments;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw new Error('Ödeme geçmişi yüklenemedi');
  }
}

// Aboneliği iptal et
export async function cancelSubscription(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    const userData = userDoc.data() as User;
    
    if (!userData.subscription) {
      throw new Error('Aktif abonelik bulunamadı');
    }
    
    // Aboneliği güncelle - iptal bayraklarını ayarla
    await updateDoc(userRef, {
      'subscription.cancelAtPeriodEnd': true
    });
    
    // Gerçek bir ödeme sağlayıcısı kullanıldığında burada ödeme sağlayıcısı API'sine 
    // aboneliği iptal etmek için istek gönderilir (örn. Stripe, PayPal)
    
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Abonelik iptal edilemedi');
  }
}

// Abonelik planını değiştir
export async function changePlan(userId: string, newPlanId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    // Kullanıcının mevcut abonelik bilgilerini al
    const userData = userDoc.data() as User;
    const currentSubscription = userData.subscription;
    
    // Yeni plan için güncelleme - burada bir ödeme sağlayıcısı olsaydı
    // önce ödeme sağlayıcısı API'si ile plan değişikliği yapılır, sonra DB güncellenir
    
    // Mevcut abonelik varsa, güncelleyelim
    if (currentSubscription) {
      const now = Date.now();
      await updateDoc(userRef, {
        'subscription.planId': newPlanId,
        'subscription.currentPeriodStart': now,
        // Örnek olarak 30 gün sonra
        'subscription.currentPeriodEnd': now + (30 * 24 * 60 * 60 * 1000),
        'subscription.cancelAtPeriodEnd': false
      });
    } else {
      // Yeni abonelik oluştur
      const now = Date.now();
      await updateDoc(userRef, {
        subscription: {
          planId: newPlanId,
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: now + (30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error changing subscription plan:', error);
    throw new Error('Plan değişikliği yapılamadı');
  }
}

// Fatura bilgilerini güncelle
export async function updateBillingDetails(
  userId: string, 
  billingDetails: BillingDetails
): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      billingDetails
    });
    
    return true;
  } catch (error) {
    console.error('Error updating billing details:', error);
    throw new Error('Fatura bilgileri güncellenemedi');
  }
}

// Ödeme yöntemi ekle/güncelle
export async function updatePaymentMethod(
  userId: string,
  paymentMethodData: BillingDetails['paymentMethod']
): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    // Kullanıcının mevcut fatura bilgilerini al
    const userData = userDoc.data() as User;
    const billingDetails = userData.billingDetails || {};
    
    // Ödeme yöntemini güncelle
    await updateDoc(userRef, {
      'billingDetails.paymentMethod': paymentMethodData
    });
    
    return true;
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw new Error('Ödeme yöntemi güncellenemedi');
  }
}

// Abonelik yenileme işlemi 
// Bu işlev genellikle bir Cloud Function veya benzeri bir otomatik işlemci tarafından çağrılır
export async function processSubscriptionRenewal(
  userId: string,
  subscriptionId: string
): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    const userData = userDoc.data() as User;
    const subscription = userData.subscription;
    
    if (!subscription || subscription.cancelAtPeriodEnd) {
      console.log('Subscription is canceled or does not exist');
      return false;
    }
    
    // Gerçek uygulamada burada ödeme işlemi gerçekleştirilir
    // Ödeme başarılı olursa abonelik bilgileri güncellenir
    
    const now = Date.now();
    const nextPeriodEnd = now + (30 * 24 * 60 * 60 * 1000); // 30 gün
    
    await updateDoc(userRef, {
      'subscription.currentPeriodStart': now,
      'subscription.currentPeriodEnd': nextPeriodEnd,
      'subscription.lastPaymentDate': now
    });
    
    // Fatura oluştur
    const invoiceData = {
      userId,
      subscriptionId,
      planId: subscription.planId,
      date: now,
      amount: 99, // Örnek değer, gerçek uygulamada plan fiyatı kullanılır
      status: 'paid',
      items: [
        {
          description: `${subscription.planId} Plan - Aylık Abonelik`,
          amount: 99
        }
      ]
    };
    
    await addDoc(collection(db, 'invoices'), invoiceData);
    
    // Ödeme kaydı oluştur
    const paymentData = {
      userId,
      date: now,
      amount: 99,
      status: 'succeeded',
      paymentMethod: userData.billingDetails?.paymentMethod || {
        type: 'card'
      }
    };
    
    await addDoc(collection(db, 'payments'), paymentData);
    
    return true;
  } catch (error) {
    console.error('Error processing subscription renewal:', error);
    throw new Error('Abonelik yenileme işlemi başarısız oldu');
  }
}

// Örnek/test için kullanılabilecek örnek faturalar
export const sampleInvoices: Invoice[] = [
  {
    id: 'inv_12345678',
    userId: 'test-user',
    subscriptionId: 'sub_12345',
    planId: 'pro',
    date: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 gün önce
    amount: 99,
    status: 'paid',
    pdfUrl: 'https://example.com/invoice-1.pdf',
    items: [
      {
        description: 'Pro Plan - Aylık Abonelik',
        amount: 99
      }
    ]
  },
  {
    id: 'inv_23456789',
    userId: 'test-user',
    subscriptionId: 'sub_12345',
    planId: 'pro',
    date: Date.now() - (60 * 24 * 60 * 60 * 1000), // 60 gün önce
    amount: 99,
    status: 'paid',
    pdfUrl: 'https://example.com/invoice-2.pdf',
    items: [
      {
        description: 'Pro Plan - Aylık Abonelik',
        amount: 99
      }
    ]
  }
]; 