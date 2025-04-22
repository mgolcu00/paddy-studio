import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CreditCard, Package, Zap, Receipt, Clock, FileText, Download, CheckCircle, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubscriptionInfo, Invoice, PaymentHistory, PricingPlan, BillingDetails } from '@/types';
import { getUserSubscription, getUserInvoices, getUserPaymentHistory, cancelSubscription, updateBillingDetails } from '@/services/subscriptionService';
import { getPricingPlans, getPricingPlanById } from '@/services/pricingService';

export function UserBillingPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({});
  const [loading, setLoading] = useState(true);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const [savingBillingDetails, setSavingBillingDetails] = useState(false);
  const [allPlans, setAllPlans] = useState<PricingPlan[]>([]);

  // Kullanıcı verilerini yükle
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        // Paralel olarak tüm verileri getir
        const [subscriptionData, invoicesData, paymentsData, plansData] = await Promise.all([
          getUserSubscription(currentUser.id),
          getUserInvoices(currentUser.id),
          getUserPaymentHistory(currentUser.id),
          getPricingPlans()
        ]);

        setSubscription(subscriptionData);
        setInvoices(invoicesData);
        setPayments(paymentsData);
        setAllPlans(plansData);

        // Mevcut planın detaylarını getir
        if (subscriptionData?.planId) {
          const planDetails = await getPricingPlanById(subscriptionData.planId);
          setCurrentPlan(planDetails);
        }

        // Fatura bilgilerini yükle
        if (currentUser.billingDetails) {
          setBillingDetails(currentUser.billingDetails);
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri yüklenirken hata oluştu:', error);
        toast({ 
          title: 'Veri yüklenemedi', 
          description: 'Lütfen daha sonra tekrar deneyin.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Aboneliği iptal et
  const handleCancelSubscription = async () => {
    if (!currentUser?.id || !subscription) return;

    setCancelingSubscription(true);
    try {
      await cancelSubscription(currentUser.id);
      
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true,
        status: 'canceled'
      });

      toast({ 
        title: 'Abonelik iptal edildi', 
        description: 'Aboneliğiniz dönem sonunda sonlandırılacaktır.'
      });
    } catch (error) {
      console.error('Abonelik iptal edilirken hata oluştu:', error);
      toast({ 
        title: 'İşlem başarısız', 
        description: 'Lütfen daha sonra tekrar deneyin.',
        variant: 'destructive'
      });
    } finally {
      setCancelingSubscription(false);
    }
  };

  // Fatura bilgilerini güncelle
  const handleUpdateBillingDetails = async () => {
    if (!currentUser?.id) return;

    setSavingBillingDetails(true);
    try {
      await updateBillingDetails(currentUser.id, billingDetails);
      
      toast({ 
        title: 'Bilgiler güncellendi', 
        description: 'Fatura bilgileriniz kaydedildi.'
      });
    } catch (error) {
      console.error('Fatura bilgileri güncellenirken hata oluştu:', error);
      toast({ 
        title: 'Güncelleme başarısız', 
        description: 'Lütfen daha sonra tekrar deneyin.',
        variant: 'destructive'
      });
    } finally {
      setSavingBillingDetails(false);
    }
  };

  // Tarih formatı
  const formatDate = (timestamp?: number | null) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Abonelik durumu metni ve rengi
  const getSubscriptionStatusInfo = () => {
    if (!subscription) return { text: 'Aktif Abonelik Yok', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' };

    switch (subscription.status) {
      case 'active':
        return { text: 'Aktif', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' };
      case 'trialing':
        return { text: 'Deneme', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' };
      case 'past_due':
        return { text: 'Ödeme Gecikti', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
      case 'canceled':
        return { text: 'İptal Edildi', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' };
      case 'unpaid':
        return { text: 'Ödenmedi', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' };
      default:
        return { text: 'Pasif', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' };
    }
  };

  const statusInfo = getSubscriptionStatusInfo();

  // Fiyat formatı
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Kullanıcıya uygun planları göster
  const getAvailablePlans = () => {
    if (!allPlans.length) return [];
    return allPlans.filter(plan => plan.available && plan.id !== subscription?.planId);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Bilgiler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto">
      {/* Sayfa Başlığı */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Abonelik ve Faturalandırma</h1>
        <p className="text-muted-foreground mt-2">
          Abonelik planınızı yönetin ve ödeme bilgilerinizi görüntüleyin
        </p>
      </div>
      
      {/* Sekmeler */}
      <Tabs defaultValue="subscription" className="mb-8">
        <TabsList className="w-full max-w-md grid grid-cols-3 mb-8">
          <TabsTrigger value="subscription" className="text-base">
            <CreditCard className="mr-2 h-4 w-4" /> Abonelik
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-base">
            <Receipt className="mr-2 h-4 w-4" /> Fatura Bilgileri
          </TabsTrigger>
          <TabsTrigger value="history" className="text-base">
            <Clock className="mr-2 h-4 w-4" /> Geçmiş
          </TabsTrigger>
        </TabsList>

        {/* Abonelik Sekmesi */}
        <TabsContent value="subscription" className="mt-6">
          {/* Mevcut Plan */}
          <Card className="mb-8 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Mevcut Planınız</CardTitle>
                {subscription && (
                  <Badge className={`${statusInfo.bgColor} ${statusInfo.color} px-3 py-1 text-sm`}>
                    {statusInfo.text}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              {!subscription ? (
                <div className="text-center py-10 space-y-4">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/70" />
                  <div>
                    <h3 className="text-xl font-medium">Aktif bir aboneliğiniz bulunmuyor</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Şu anda ücretsiz planı kullanıyorsunuz. Daha fazla özellik için premium plana geçebilirsiniz.
                    </p>
                  </div>
                  <Button className="mt-4" size="lg" asChild>
                    <a href="/pricing">Planları İncele</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-muted/30 p-6 rounded-xl">
                      <div className="text-muted-foreground mb-1">Plan</div>
                      <div className="text-2xl font-bold">{currentPlan?.name || subscription.planId}</div>
                      {currentPlan?.price !== undefined && (
                        <div className="mt-1 text-primary font-medium">{formatPrice(currentPlan.price)} / ay</div>
                      )}
                    </div>
                    
                    <div className="bg-muted/30 p-6 rounded-xl">
                      <div className="text-muted-foreground mb-1">Durum</div>
                      <div className="text-2xl font-bold">
                        {subscription.status === 'active' ? 'Aktif Abonelik' : statusInfo.text}
                        {subscription.cancelAtPeriodEnd && (
                          <Badge variant="outline" className="ml-2 text-orange-600">
                            Yenilenmeyecek
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-6 rounded-xl">
                      <div className="text-muted-foreground mb-1">Yenileme Tarihi</div>
                      <div className="text-2xl font-bold">{formatDate(subscription.currentPeriodEnd)}</div>
                      <div className="mt-1 text-muted-foreground">
                        <Calendar className="inline-block h-4 w-4 mr-1" /> 
                        {subscription.cancelAtPeriodEnd 
                          ? "Bu tarihte sonlanacak" 
                          : "Otomatik yenilenecek"}
                      </div>
                    </div>
                  </div>

                  {currentPlan && (
                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Özellikler</h3>
                        <ul className="space-y-3">
                          {currentPlan.features.slice(0, 6).map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0" /> 
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {currentPlan.limitations && (
                        <div>
                          <h3 className="text-lg font-medium mb-4">Kaynaklar</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center bg-muted/40 p-4 rounded-lg">
                              <Package className="h-6 w-6 text-primary/80 mr-3" />
                              <div>
                                <div className="text-sm text-muted-foreground">Projeler</div>
                                <div className="text-lg font-medium">
                                  {currentPlan.limitations.projects === 'unlimited' ? 'Sınırsız' : currentPlan.limitations.projects}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center bg-muted/40 p-4 rounded-lg">
                              <Database className="h-6 w-6 text-primary/80 mr-3" />
                              <div>
                                <div className="text-sm text-muted-foreground">Depolama</div>
                                <div className="text-lg font-medium">
                                  {currentPlan.limitations.storage} GB
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            {subscription && (
              <CardFooter className="pt-4 flex justify-end space-x-4">
                {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-destructive">
                        Aboneliği İptal Et
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Aboneliği iptal etmek istediğinizden emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Aboneliğiniz {formatDate(subscription.currentPeriodEnd)} tarihine kadar devam edecek, ancak otomatik olarak yenilenmeyecektir.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleCancelSubscription}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={cancelingSubscription}
                        >
                          {cancelingSubscription ? 'İptal Ediliyor...' : 'İptal Et'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                <Button asChild>
                  <a href="/pricing">
                    {subscription.status === 'canceled' ? 'Yeni Plan Seç' : 'Planı Değiştir'}
                  </a>
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Diğer Planlar */}
          {getAvailablePlans().length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-5">Diğer Planlar</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {getAvailablePlans().slice(0, 3).map(plan => (
                  <Card key={plan.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                        <span className="text-muted-foreground ml-1 text-sm">/ ay</span>
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={plan.popular ? "default" : "outline"} 
                        className="w-full"
                        asChild
                      >
                        <a href={`/pricing?plan=${plan.id}`}>Bu Planı Seç</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Fatura Bilgileri Sekmesi */}
        <TabsContent value="billing" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Fatura Bilgileri</CardTitle>
              <CardDescription>
                Faturalarınızda görünecek bilgileri düzenleyin
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="grid gap-6 max-w-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad / Şirket Adı</Label>
                    <Input 
                      id="name" 
                      value={billingDetails.name || ''} 
                      onChange={e => setBillingDetails({...billingDetails, name: e.target.value})}
                      placeholder="Fatura adı"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Şirket (Opsiyonel)</Label>
                    <Input 
                      id="company" 
                      value={billingDetails.company || ''} 
                      onChange={e => setBillingDetails({...billingDetails, company: e.target.value})}
                      placeholder="Şirket adı"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address_line1">Adres</Label>
                  <Input 
                    id="address_line1" 
                    value={billingDetails.address?.line1 || ''} 
                    onChange={e => setBillingDetails({
                      ...billingDetails, 
                      address: {...billingDetails.address, line1: e.target.value}
                    })}
                    placeholder="Adres"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input 
                      id="city" 
                      value={billingDetails.address?.city || ''} 
                      onChange={e => setBillingDetails({
                        ...billingDetails, 
                        address: {...billingDetails.address, city: e.target.value}
                      })}
                      placeholder="Şehir"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Posta Kodu</Label>
                    <Input 
                      id="postal_code" 
                      value={billingDetails.address?.postalCode || ''} 
                      onChange={e => setBillingDetails({
                        ...billingDetails, 
                        address: {...billingDetails.address, postalCode: e.target.value}
                      })}
                      placeholder="Posta kodu"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">Ülke</Label>
                    <Input 
                      id="country" 
                      value={billingDetails.address?.country || ''} 
                      onChange={e => setBillingDetails({
                        ...billingDetails, 
                        address: {...billingDetails.address, country: e.target.value}
                      })}
                      placeholder="Ülke"
                      defaultValue="Türkiye"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vat">Vergi No (Opsiyonel)</Label>
                    <Input 
                      id="vat" 
                      value={billingDetails.vatNumber || ''} 
                      onChange={e => setBillingDetails({...billingDetails, vatNumber: e.target.value})}
                      placeholder="Vergi numarası"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Ödeme Yöntemi</h3>
                
                {billingDetails.paymentMethod ? (
                  <div className="flex items-center justify-between rounded-lg border p-4 max-w-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-muted/60 p-2 rounded-md">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {billingDetails.paymentMethod.brand || 'Kart'} **** {billingDetails.paymentMethod.last4 || '0000'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Son Kullanma: {billingDetails.paymentMethod.expiryMonth || '00'}/{billingDetails.paymentMethod.expiryYear || '00'}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Düzenle</Button>
                  </div>
                ) : (
                  <Button>Ödeme Yöntemi Ekle</Button>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-4">
              <Button 
                onClick={handleUpdateBillingDetails}
                disabled={savingBillingDetails}
              >
                {savingBillingDetails ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Ödeme Geçmişi Sekmesi */}
        <TabsContent value="history" className="mt-6">
          <div className="grid gap-8">
            {/* Faturalar */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Faturalar</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tarih</TableHead>
                          <TableHead>Tutar</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead className="text-right">PDF</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.slice(0, 5).map(invoice => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{formatDate(invoice.date)}</TableCell>
                            <TableCell>{formatPrice(invoice.amount)}</TableCell>
                            <TableCell>
                              <Badge variant={invoice.status === 'paid' ? 'outline' : 'destructive'} className={
                                invoice.status === 'paid' 
                                  ? 'text-green-600 border-green-600/30 bg-green-100/50 dark:bg-green-900/20' 
                                  : ''
                              }>
                                {invoice.status === 'paid' ? 'Ödendi' : 'Ödenmedi'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {invoice.pdfUrl && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" title="PDF İndir">
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
                    <h3 className="text-lg font-medium">Henüz fatura bulunmuyor</h3>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Ödeme Geçmişi */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Ödeme Geçmişi</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tarih</TableHead>
                          <TableHead>Yöntem</TableHead>
                          <TableHead>Tutar</TableHead>
                          <TableHead>Durum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.slice(0, 5).map(payment => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{formatDate(payment.date)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>
                                  {payment.paymentMethod.brand ? `${payment.paymentMethod.brand} **** ${payment.paymentMethod.last4}` : payment.paymentMethod.type}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{formatPrice(payment.amount)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                payment.status === 'succeeded' ? 'text-green-600 border-green-600/30 bg-green-100/50 dark:bg-green-900/20' :
                                payment.status === 'pending' ? 'text-yellow-600 border-yellow-600/30 bg-yellow-100/50 dark:bg-yellow-900/20' :
                                'text-red-600 border-red-600/30 bg-red-100/50 dark:bg-red-900/20'
                              }>
                                {payment.status === 'succeeded' ? 'Başarılı' :
                                 payment.status === 'pending' ? 'Beklemede' :
                                 payment.status === 'refunded' ? 'İade' : 'Başarısız'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
                    <h3 className="text-lg font-medium">Henüz ödeme işlemi bulunmuyor</h3>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Yardımcı ikonlar
function Database({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
} 