import { Component } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface JsonPreviewProps {
  components: Component[];
}

export function JsonPreview({ components }: JsonPreviewProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  
  // Daha okunabilir JSON formatı için
  const jsonString = JSON.stringify(components, null, 2);
  
  // Kopyalama fonksiyonu
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        setHasCopied(true);
        toast({
          title: "Kopyalandı!",
          description: "JSON başarıyla panoya kopyalandı."
        });
        
        // 2 saniye sonra ikonu sıfırla
        setTimeout(() => {
          setHasCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast({
          title: "Kopyalama başarısız!",
          description: "JSON panoya kopyalanamadı.",
          variant: "destructive"
        });
      });
  }, [jsonString, toast]);

  return (
    <div className="space-y-2 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">JSON Önizleme</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 px-2 text-xs"
        >
          {hasCopied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 mr-1.5 text-green-500" />
              <span>Kopyalandı</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>Kopyala</span>
            </>
          )}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 rounded-md border">
        <div className="p-1">
          <pre 
            className={cn(
              "block w-full overflow-x-auto rounded-sm p-4",
              "text-sm font-mono leading-relaxed",
              "bg-slate-950 text-slate-50 dark:bg-slate-900",
              "shadow-inner"
            )}
          >
            <code>{jsonString}</code>
          </pre>
        </div>
      </ScrollArea>
      
      <div className="text-xs text-muted-foreground">
        {components.length} bileşen, yaklaşık {new Blob([jsonString]).size} bayt
      </div>
    </div>
  );
}