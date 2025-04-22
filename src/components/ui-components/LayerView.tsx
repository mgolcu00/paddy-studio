import React from 'react';
import {
  Component, 
  ComponentID, 
  // Import specific container types used in type assertion
  RowComponent,
  ColumnComponent,
  BoxComponent,
  CardComponent 
} from '@/types';
import { ChevronDownIcon, ChevronRightIcon, GripVerticalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DndContext, DragEndEvent, closestCenter, UniqueIdentifier } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext, 
  verticalListSortingStrategy, 
  arrayMove
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

// Helper type for flattened components
interface FlattenedComponent {
  id: ComponentID;
  depth: number;
  parentId: ComponentID | 'canvas-root';
  component: Component;
}

// Helper function to flatten the component tree
function flattenComponents(
  components: Component[],
  parentId: ComponentID | 'canvas-root' = 'canvas-root',
  depth = 0
): FlattenedComponent[] {
  return components.reduce((acc, component) => {
    acc.push({ id: component.id, depth, parentId, component });
    if ('children' in component && Array.isArray(component.children) && component.children.length > 0) {
       // Important: Recursively flatten children
      acc.push(...flattenComponents(component.children, component.id, depth + 1));
    }
    return acc;
  }, [] as FlattenedComponent[]);
}

interface LayerViewProps {
  components: Component[];
  selectedComponentId: ComponentID | null;
  onSelect: (id: ComponentID) => void;
}

interface LayerItemProps {
  component: Component;
  level?: number;
  isSelected: boolean;
  selectedComponentId: ComponentID | null;
  onSelect: (id: ComponentID) => void;
  isExpanded: boolean;
  onToggle: () => void;
  onReorder?: (components: Component[]) => void;
}

function LayerItem({ 
  component, 
  level = 0, 
  isSelected, 
  onSelect,
  isExpanded,
  onToggle
}: LayerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${level * 1}rem`,
    zIndex: isDragging ? 10 : 'auto',
    position: 'relative',
  };

  const hasChildren = 'children' in component && Array.isArray(component.children) && component.children.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-1.5 rounded hover:bg-accent text-sm',
        isSelected && 'bg-accent font-medium',
        isDragging && 'opacity-50 shadow-md'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
      {...attributes}
    >
      <button
        {...listeners}
        className="cursor-move p-0.5 text-muted-foreground hover:text-foreground"
        aria-label="Drag to reorder"
      >
        <GripVerticalIcon className="h-4 w-4" />
      </button>

      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-0.5 hover:bg-muted rounded-sm"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronDownIcon className="h-3.5 w-3.5" />
          ) : (
            <ChevronRightIcon className="h-3.5 w-3.5" />
          )}
        </button>
      ) : (
        <span className="w-[18px]"></span>
      )}

      <span className="flex-1 truncate select-none">{component.type}</span>
    </div>
  );
}

interface LayerItemWithStateProps extends Omit<LayerItemProps, 'isExpanded' | 'onToggle'> {}

function LayerItemWithState(props: LayerItemWithStateProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderNested = () => {
    const isContainerWithChildren = 
      'children' in props.component && 
      Array.isArray(props.component.children) &&
      props.component.children.length > 0;
      
    if (!isExpanded || !isContainerWithChildren) {
      return null;
    }
    
    const containerComponent = props.component as RowComponent | ColumnComponent | BoxComponent | CardComponent;
    
    // Ensure children is not undefined before mapping (although covered by isContainerWithChildren)
    if (!containerComponent.children) {
        return null;
    }
    
    const childrenIds = containerComponent.children.map(child => child.id);

    return (
      <div className="pl-4 border-l border-border/50 ml-[9px] pt-0.5">
        <SortableContext items={childrenIds} strategy={verticalListSortingStrategy}>
          {/* Map over the guaranteed children array */}
          {containerComponent.children.map((child: Component) => (
            <LayerItemWithState
              key={child.id}
              component={child}
              level={(props.level || 0) + 1}
              selectedComponentId={props.selectedComponentId}
              isSelected={child.id === props.selectedComponentId} 
              onSelect={props.onSelect}
              onReorder={props.onReorder} 
            />
          ))}
        </SortableContext>
      </div>
    );
  };
  
  return (
    <>
      <LayerItem
        {...props}
        isSelected={props.component.id === props.selectedComponentId}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {renderNested()}
    </>
  );
}

// Internal component for each sortable layer item
interface SortableLayerItemProps {
  item: FlattenedComponent;
  selectedComponentId: ComponentID | null;
  onSelect: (id: ComponentID) => void;
}

function SortableLayerItem({ item, selectedComponentId, onSelect }: SortableLayerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data: { type: 'layer', source: 'layerView', component: item.component } }); // Pass data for context

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginLeft: `${item.depth * 1.5}rem`, // Indentation based on depth
  };

  const isSelected = item.id === selectedComponentId;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center justify-between p-1.5 rounded text-sm cursor-pointer hover:bg-muted/80 mb-1 group',
        isSelected && 'bg-primary/10 text-primary hover:bg-primary/20',
        isDragging && 'shadow-md bg-background z-10 relative' // Add styling for dragging item
      )}
      onClick={() => onSelect(item.id)}
    >
      <div className="flex items-center gap-2 overflow-hidden">
         {/* Drag Handle - appears on hover/focus */}
         <button
            {...attributes}
            {...listeners}
            className={cn(
                "p-0.5 rounded opacity-50 group-hover:opacity-100 focus:opacity-100 focus:ring-1 focus:ring-primary cursor-grab active:cursor-grabbing",
                 isSelected ? "text-primary" : "text-muted-foreground"
             )}
            aria-label="Katmanı sürükle"
            title="Yeniden sıralamak için sürükle"
         >
            <GripVerticalIcon className="h-4 w-4" />
         </button>
         {/* Component Type/Name */}
         <span className="truncate" title={item.component.type}> {/* Use type as placeholder name */}
             {/* Check if props and displayName exist before accessing */}
             {/* Display displayName if it's a non-empty string, otherwise fallback to type */}
             {(item.component.props && typeof (item.component.props as any).displayName === 'string' && (item.component.props as any).displayName)
                 ? (item.component.props as any).displayName
                 : item.component.type
             }
          </span>
      </div>
       {/* Optional: Add icons or badges here */}
    </div>
  );
}

export function LayerView({ components, selectedComponentId, onSelect }: LayerViewProps) {
   // Flatten the component tree to get a list suitable for SortableContext
   const flattenedItems = React.useMemo(() => flattenComponents(components), [components]);
   const itemIds = React.useMemo(() => flattenedItems.map(item => item.id), [flattenedItems]);

  if (!components || components.length === 0) {
    return <p className="text-muted-foreground text-sm text-center mt-4">Sayfada henüz bileşen yok.</p>;
  }

  return (
     <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
       <div className="space-y-1 pr-1"> {/* Add some padding for scrollbar */}
         {flattenedItems.map((item) => (
           <SortableLayerItem
             key={item.id}
             item={item}
             selectedComponentId={selectedComponentId}
             onSelect={onSelect}
           />
         ))}
       </div>
     </SortableContext>
  );
}