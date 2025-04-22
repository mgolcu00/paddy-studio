import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { KeyRound, Trash2, PlusCircle, Copy, UserCircle, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react"
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Timestamp } from 'firebase/firestore';
import { ApiKeyData, getApiKeys, generateApiKey, deleteApiKey } from '@/services/apiKeyService';

// Helper component for Settings sections
const SettingsSection = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <div className="py-6">
    <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
    {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
    <div className="space-y-4">{children}</div>
    <Separator className="mt-6"/>
  </div>
);

export function UserSettingsPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // State for API Keys and loading/action states
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [isFetchingKeys, setIsFetchingKeys] = useState(true);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // Fetch API Keys on mount
  useEffect(() => {
    fetchKeys();
  }, [currentUser]); // Re-fetch if user changes

  const fetchKeys = async () => {
    if (!currentUser?.id) {
      setIsFetchingKeys(false);
      return;
    }
    setIsFetchingKeys(true);
    try {
      const keys = await getApiKeys(currentUser.id);
      setApiKeys(keys);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast({ title: "API Anahtarları Yüklenemedi", variant: "destructive" });
    } finally {
      setIsFetchingKeys(false);
    }
  };

  // Updated key generation handler
  const handleGenerateKey = async () => {
    if (!currentUser?.id) return;
    setIsGeneratingKey(true);
    try {
      const { newKeyData, fullKey } = await generateApiKey(currentUser.id, newKeyName.trim() || undefined);
      setApiKeys(prevKeys => [newKeyData, ...prevKeys]); // Add new key to the top
      setGeneratedKey(fullKey); 
      setNewKeyName(''); 
      setShowNewKeyModal(true);
      toast({ title: "API Anahtarı Oluşturuldu", description: "Lütfen anahtarı güvenli bir yere kaydedin." });
    } catch (error) {
       console.error("Error generating API key:", error);
       toast({ title: "Anahtar Oluşturulamadı", variant: "destructive" });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  // Updated key deletion handler
  const handleDeleteKey = async (keyId: string, keyName?: string) => {
    if (!currentUser?.id) return;
    // Consider adding a loading state specific to the row being deleted
    try {
      await deleteApiKey(currentUser.id, keyId);
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== keyId));
      toast({ title: "API Anahtarı Silindi", description: `"${keyName || keyId}" anahtarı silindi.` });
    } catch (error) {
       console.error("Error deleting API key:", error);
       toast({ title: "Anahtar Silinemedi", variant: "destructive" });
    }
  };
  
  const copyToClipboard = (text: string | null, successMessage: string = "Panoya kopyalandı!") => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Kopyalandı!", description: successMessage });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast({ title: "Hata", description: "Metin kopyalanamadı.", variant: "destructive" });
    });
  };

  const formatDate = (timestamp?: Timestamp | null) => {
    if (!timestamp) return '-';
    try {
      return timestamp.toDate().toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return 'Geçersiz tarih'; }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 pb-16">
       {/* Page Header */}
      <div className="space-y-0.5">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hesap Ayarları</h1>
        <p className="text-muted-foreground">
          Profil bilgilerinizi, API anahtarlarınızı ve diğer hesap ayarlarınızı yönetin.
        </p>
      </div>
      <Separator />
      
      {/* Tabs Navigation */}
      <Tabs defaultValue="profile" className="">
        <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
          <TabsTrigger value="profile">
             <UserCircle className="mr-2 h-4 w-4"/> Profil
          </TabsTrigger>
          <TabsTrigger value="apiKeys">
             <KeyRound className="mr-2 h-4 w-4"/> API Anahtarları
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab Content */}
        <TabsContent value="profile" className="mt-6 space-y-8">
           {/* Profile Info Section */}
           <SettingsSection title="Profil Bilgileri" description="Genel hesap bilgileriniz.">
            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted/20">
              <Avatar className="h-20 w-20 border-2 border-primary/10">
                <AvatarImage src={undefined} alt="User Avatar" /> 
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-900 text-primary/80">
                  {currentUser?.displayName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-foreground">{currentUser?.displayName || currentUser?.email?.split('@')[0]}</p>
                <p className="text-md text-muted-foreground">{currentUser?.email}</p>
                 {/* TODO: Add button/modal to edit profile */} 
                 {/* <Button variant="outline" size="sm" className="mt-2">Profili Düzenle</Button> */} 
              </div>
            </div>
          </SettingsSection>

          {/* Security Section (Example: Password Change - Placeholder) */}
          <SettingsSection title="Güvenlik" description="Hesap güvenliği ayarlarınız.">
              <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                     <p className="font-medium">Şifre</p>
                     <p className="text-sm text-muted-foreground">Hesap şifrenizi değiştirmek için.</p>
                  </div>
                  <Button variant="outline" disabled>Şifreyi Değiştir</Button>
              </div>
          </SettingsSection>

          {/* Danger Zone */}
          <SettingsSection title="Tehlikeli Alan">
             <Card className="border-destructive/50 bg-destructive/5 dark:bg-destructive/10">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="h-5 w-5"/> Hesabı Sil</CardTitle>
                  <CardDescription className="text-destructive/90">
                     Bu işlem geri alınamaz. Tüm projeleriniz ve verileriniz kalıcı olarak silinecektir.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive">Hesabımı Kalıcı Olarak Sil</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu işlem geri alınamaz. Hesabınız, tüm projeleriniz ve ilgili veriler kalıcı olarak silinecektir.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          {/* TODO: Implement account deletion logic */} 
                          <AlertDialogAction onClick={() => toast({title: 'İşlev Henüz Eklenmedi', variant: 'destructive'})} >Evet, Hesabımı Sil</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                 </CardContent>
             </Card>
          </SettingsSection>

        </TabsContent>

        {/* API Keys Tab Content */}
        <TabsContent value="apiKeys" className="mt-6 space-y-8">
            <SettingsSection title="API Anahtarları Yönetimi" description="Harici uygulamaların hesabınıza erişmesi için anahtarlar oluşturun ve yönetin.">
               <Card>
                 <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle className="text-lg">Mevcut Anahtarlar</CardTitle>
                        <div className="flex gap-2 w-full sm:w-auto">
                           <Input 
                              placeholder="Anahtar Adı (Opsiyonel)" 
                              value={newKeyName} 
                              onChange={(e) => setNewKeyName(e.target.value)}
                              className="flex-1 sm:flex-initial sm:w-48"
                              disabled={isGeneratingKey}
                            />
                           <Button onClick={handleGenerateKey} disabled={isGeneratingKey}>
                              {isGeneratingKey ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                              ) : (
                                <PlusCircle className="mr-2 h-4 w-4" />
                              )}
                              Oluştur
                           </Button>
                        </div>
                     </div>
                 </CardHeader>
                 <CardContent>
                    {isFetchingKeys ? (
                       <div className="flex justify-center items-center py-16">
                         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                       </div>
                    ) : apiKeys.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Henüz API anahtarınız yok.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>İsim/Anahtar</TableHead>
                            <TableHead>Oluşturma</TableHead>
                            <TableHead>Son Kullanım</TableHead>
                            <TableHead className="text-right">Eylemler</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {apiKeys.map((key) => (
                            <TableRow key={key.id}>
                              <TableCell>
                                <div className="font-medium text-foreground">{key.name || 'İsimsiz Anahtar'}</div>
                                <code className="text-xs text-muted-foreground font-mono">{key.maskedKey}</code>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{formatDate(key.createdAt)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{formatDate(key.lastUsed)}</TableCell>
                              <TableCell className="text-right">
                                 <div className="flex justify-end gap-1">
                                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(key.maskedKey, `Maskelenmiş Anahtar (${key.name || key.id}) kopyalandı.`)} title="Maskelenmiş Anahtarı Kopyala">
                                        <Copy className="h-4 w-4"/>
                                     </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" title="Sil">
                                              <Trash2 className="h-4 w-4" />
                                           </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>API Anahtarını Sil?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              "<span className="font-semibold">{key.name || key.id}</span>" anahtarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>İptal</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteKey(key.id, key.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Evet, Sil</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                 </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                 </CardContent>
               </Card>
            </SettingsSection>

             {/* Modal to display newly generated key */}
            <AlertDialog open={showNewKeyModal} onOpenChange={setShowNewKeyModal}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-green-600"/> Yeni API Anahtarınız Oluşturuldu!</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu anahtarı şimdi güvenli bir yere kopyalayın. Bu pencereyi kapattıktan sonra anahtarı tekrar göremeyeceksiniz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4 p-3 rounded-md bg-muted font-mono text-sm break-all relative group">
                  <code>{generatedKey}</code>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="absolute top-1 right-1 h-7 w-7 opacity-50 group-hover:opacity-100 transition-opacity"
                     onClick={() => copyToClipboard(generatedKey, "Yeni API anahtarı panoya kopyalandı!")}
                   >
                      <Copy className="h-4 w-4"/>
                   </Button>
                </div>
                <AlertDialogFooter>
                  <Button onClick={() => { setShowNewKeyModal(false); setGeneratedKey(null); }}>Anladım, Kapattım</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

        </TabsContent>

      </Tabs>
    </div>
  );
} 