import { draggableItems } from '@/lib/defaultComponents';
import { ComponentType } from '@/types';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { 
  Square, TypeIcon, MousePointerIcon, ImageIcon, DivideIcon, 
  RowsIcon, ColumnsIcon, BoxIcon, LucideProps, 
  SmileIcon, TerminalSquareIcon, CreditCardIcon, SpaceIcon,
  CheckSquareIcon, ListIcon, GalleryVerticalIcon, TableIcon, 
  BarChart4Icon, ContainerIcon, LayoutGridIcon, LineChartIcon,
  LinkIcon, PlayIcon
} from 'lucide-react';
import React from 'react';

interface DraggablePaletteItem {
  id: string;
  type: ComponentType;
  label: string;
  description?: string;
  category: 'layout' | 'basic' | 'form' | 'media' | 'advanced';
}

interface DraggableComponentProps {
  item: DraggablePaletteItem;
}

const getIconForType = (type: ComponentType): React.ComponentType<LucideProps> => {
  switch (type) {
    // Basic
    case 'Text': return TypeIcon;
    case 'Button': return MousePointerIcon;
    case 'Image': return ImageIcon;
    case 'Divider': return DivideIcon;
    case 'Icon': return SmileIcon;
    case 'Link': return LinkIcon;
    
    // Layout
    case 'Row': return RowsIcon;
    case 'Column': return ColumnsIcon;
    case 'Box': return BoxIcon;
    case 'Card': return CreditCardIcon;
    case 'Spacer': return SpaceIcon;
    case 'Container': return ContainerIcon;
    case 'Grid': return LayoutGridIcon;
    
    // Form
    case 'Input': return TerminalSquareIcon;
    case 'Checkbox': return CheckSquareIcon;
    case 'Select': return ListIcon;
    
    // Media
    case 'Video': return PlayIcon;
    case 'Carousel': return GalleryVerticalIcon;
    
    // Advanced
    case 'Table': return TableIcon;
    case 'ProgressBar': return LineChartIcon;
    case 'Chart': return BarChart4Icon;
    
    default: return Square;
  }
};

function DraggableComponent({ item }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: {
      type: item.type,
      label: item.label,
      isPaletteItem: true
    }
  });

  const Icon = getIconForType(item.type);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 p-2.5 rounded border border-transparent",
        "hover:bg-accent hover:border-border transition-colors duration-150",
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 shadow-lg z-10"
      )}
      title={item.description || `Drag to add ${item.label}`}
    >
      <div className="flex-none w-7 h-7 rounded bg-muted flex items-center justify-center text-muted-foreground">
        <Icon className="w-4 h-4" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm truncate">{item.label}</p>
      </div>
    </div>
  );
}

export function ComponentPalette() {
  // Kategorilere göre filtreleme
  const layoutItems = draggableItems.filter(item => item.category === 'layout');
  const basicItems = draggableItems.filter(item => item.category === 'basic');
  const formItems = draggableItems.filter(item => item.category === 'form');
  const mediaItems = draggableItems.filter(item => item.category === 'media');
  const advancedItems = draggableItems.filter(item => item.category === 'advanced');

  const categories = [
    {
      name: "Layout",
      items: layoutItems
    },
    {
      name: "Basic Elements",
      items: basicItems
    },
    {
      name: "Form",
      items: formItems
    },
    {
      name: "Media",
      items: mediaItems
    },
    {
      name: "Advanced",
      items: advancedItems
    }
  ];

  return (
    <div className="space-y-5 p-3">
      {categories.map(category => (
        <div key={category.name} className="mb-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {category.name}
          </h3>
          <div className="space-y-1.5">
            {(category.items as DraggablePaletteItem[]).map((item) => (
              <DraggableComponent key={item.type} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}