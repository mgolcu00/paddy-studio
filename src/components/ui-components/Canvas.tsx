import { useState, useEffect } from 'react';
import { Component, ComponentID } from '@/types';
import { ComponentRenderer } from './ComponentRenderer';
import { useDroppable } from '@dnd-kit/core';
import { SmartphoneIcon, TabletIcon, MonitorIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CanvasProps {
  components: Component[];
  selectedComponentId: ComponentID | null;
  onComponentSelect: (id: ComponentID) => void;
  onComponentsChange: (components: Component[]) => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const viewportSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 }
};

// Mobil cihaz görünümü için stilleri tanımlıyoruz
const deviceStyles: Record<ViewportSize, { container: string, frame: string }> = {
  mobile: {
    container: 'rounded-[32px] border-[14px] border-black relative overflow-hidden shadow-xl',
    frame: 'before:absolute before:inset-0 before:z-10 before:block before:pointer-events-none before:rounded-[18px] before:border before:border-black/20'
  },
  tablet: {
    container: 'rounded-[24px] border-[12px] border-black relative overflow-hidden shadow-xl',
    frame: 'before:absolute before:inset-0 before:z-10 before:block before:pointer-events-none before:rounded-[12px] before:border before:border-black/20'
  },
  desktop: {
    container: 'rounded-md shadow-lg border border-border overflow-hidden',
    frame: ''
  }
};

export function Canvas({ 
  components, 
  selectedComponentId, 
  onComponentSelect,
  onComponentsChange
}: CanvasProps) {
  const [canvasComponents, setCanvasComponents] = useState<Component[]>(components);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('mobile');
  const [showGrid, setShowGrid] = useState(true);
  
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: {
      type: 'canvas',
      isContainer: true
    }
  });

  useEffect(() => {
    setCanvasComponents(components);
  }, [components]);

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex items-center justify-center gap-2 p-2 border-b">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewportSize === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewportSize('mobile')}
            >
              <SmartphoneIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mobil Görünüm</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewportSize === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewportSize('tablet')}
            >
              <TabletIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tablet Görünüm</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewportSize === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewportSize('desktop')}
            >
              <MonitorIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Masaüstü Görünüm</TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-border mx-2" />

        <Button
          variant={showGrid ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
        >
          Izgara
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <div className="mx-auto flex flex-col items-center justify-start">
          {/* Mobil görünüm için cihaz başlığı */}
          {viewportSize === 'mobile' && (
            <div className="bg-black text-white text-xs rounded-t-lg px-4 py-1 mb-1 z-20">
              Mobil Önizleme
            </div>
          )}
          
          {/* Tablet görünüm için cihaz başlığı */}
          {viewportSize === 'tablet' && (
            <div className="bg-black text-white text-xs rounded-t-lg px-4 py-1 mb-1 z-20">
              Tablet Önizleme
            </div>
          )}
          
          {/* Ana cihaz çerçevesi */}
          <div 
            className={cn(
              'mx-auto bg-white transition-all duration-200',
              deviceStyles[viewportSize].container,
              deviceStyles[viewportSize].frame
            )}
            style={{
              width: viewportSize === 'mobile' 
                ? viewportSizes.mobile.width + 28 // Border hesaba katılacak şekilde
                : viewportSize === 'tablet'
                  ? viewportSizes.tablet.width + 24 // Border hesaba katılacak şekilde
                  : viewportSizes[viewportSize].width,
              height: viewportSize === 'mobile'
                ? viewportSizes.mobile.height + 28 // Border hesaba katılacak şekilde
                : viewportSize === 'tablet'
                  ? viewportSizes.tablet.height + 24 // Border hesaba katılacak şekilde
                  : viewportSizes[viewportSize].height,
            }}
          >
            {/* Mobil cihaz için üst çentik */}
            {viewportSize === 'mobile' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[28px] bg-black z-10 rounded-b-xl"></div>
            )}
            
            <div 
              ref={setNodeRef}
              className={cn(
                'h-full w-full transition-colors relative overflow-auto',
                isOver && 'bg-primary/5 border-2 border-dashed border-primary/20',
                !isOver && canvasComponents.length === 0 && 'border-2 border-dashed border-muted',
                !isOver && canvasComponents.length > 0 && 'border-transparent',
                showGrid && 'bg-grid-pattern'
              )}
            >
              <div className="p-4 min-h-full">
                {canvasComponents.length === 0 ? (
                  <div className="h-full flex items-center justify-center min-h-[200px]">
                    <p className="text-sm text-muted-foreground">Bileşenleri buraya sürükleyin</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {canvasComponents.map((component) => (
                      <ComponentRenderer
                        key={component.id}
                        component={component}
                        onSelect={onComponentSelect}
                        isSelected={selectedComponentId === component.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}