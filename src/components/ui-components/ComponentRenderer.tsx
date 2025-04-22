import {
  Component, 
  ComponentID, 
  // ComponentType, // Removed unused import
  // Import specific component types used in renderer logic
  // TextComponent, // Removed unused import
  // ButtonComponent, // Removed unused import
  // ImageComponent, // Removed unused import
  RowComponent,
  ColumnComponent,
  DividerComponent,
  // BoxComponent, // Removed unused import
  IconComponent,
  InputComponent,
  CardComponent,
  SpacerComponent,
  // We might need BaseProps if we access its properties directly
  // BaseProps, // Removed unused import
  LinkComponent,
  VideoComponent,
  // Yeni component'ler için tip tanımlarını ekleyelim
  ContainerComponent,
  GridComponent,
  CheckboxComponent,
  SelectComponent,
  CarouselComponent,
  TableComponent,
  ProgressBarComponent,
  // Updated props interfaces
  TypographyProps, 
  ButtonComponent as ButtonComponentType, // Rename to avoid conflict with Shadcn Button
  ImageComponent as ImageComponentType // Rename to avoid conflict?
} from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// Import Icons if IconComponent is used
import * as Icons from 'lucide-react'; 
import { useDroppable } from '@dnd-kit/core';
import React, { useState } from 'react'; // Import React for createElement if needed
import { Input } from '@/components/ui/input'; // Need Input for InputComponent
import { Label } from '@/components/ui/label'; // Need Label for InputComponent
// import { Card } from '@/components/ui/card';   // Removed unused import
import { AspectRatio } from "@/components/ui/aspect-ratio" // For Image aspect ratio
import { Checkbox } from "@/components/ui/checkbox"; // For Checkbox component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For Select component
import { Progress } from "@/components/ui/progress"; // For ProgressBar component
import { Table, TableBody, /* TableCaption, */ TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Removed unused import
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShadcnCard } from "@/components/ui/shadcn-card";

interface ComponentRendererProps {
  component: Component;
  onSelect?: (id: ComponentID) => void; // Use ComponentID
  isSelected?: boolean;
  isPreview?: boolean; // Add isPreview prop
}

export function ComponentRenderer({ 
  component, 
  onSelect, 
  isSelected = false,
  isPreview = false // Default isPreview to false
}: ComponentRendererProps) {
  
  // Only enable droppable for container components when not in preview mode
  const isContainer = component.type === 'Row' || component.type === 'Column' || component.type === 'Box' || component.type === 'Card';
  const { setNodeRef, isOver } = useDroppable({
    id: component.id,
    // Disable droppable functionality in preview mode or if not a container
    disabled: isPreview || !isContainer, 
    data: {
      type: component.type,
      parentId: component.id,
      isContainer: isContainer
    }
  });

  // Disable click handling in preview mode
  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation(); // Prevent event bubbling
    if (onSelect) {
      onSelect(component.id);
    }
  };

  const renderChildren = () => {
    // Type guard to ensure component has children property
    if (!('children' in component) || !component.children || component.children.length === 0) {
      return null;
    }

    return component.children.map((child) => (
      <ComponentRenderer 
        key={child.id} 
        component={child} 
        onSelect={onSelect} 
        isSelected={isSelected && child.id === component.id}
        isPreview={isPreview} // Pass down isPreview state
      />
    ));
  };

  // Helper to convert null/undefined to undefined for style props
  const maybeString = (value: string | null | undefined): string | undefined => value ?? undefined;
  const maybeNumber = (value: number | null | undefined): number | undefined => value ?? undefined;
  const maybeStringOrNumber = (value: string | number | null | undefined): string | number | undefined => value ?? undefined;

  const baseStyle: React.CSSProperties = {
    width: maybeStringOrNumber(component.props.width),
    height: maybeStringOrNumber(component.props.height),
    padding: maybeStringOrNumber(component.props.padding),
    margin: maybeStringOrNumber(component.props.margin),
    backgroundColor: maybeString(component.props.backgroundColor), // Expects string
    borderRadius: maybeStringOrNumber(component.props.borderRadius),
    border: maybeString(component.props.border), // Expects string
    boxShadow: maybeString(component.props.boxShadow), // Expects string
    opacity: maybeNumber(component.props.opacity), // Expects number
    ...component.props.style
  };

  const wrapperClasses = cn(
    'relative transition-all',
    isSelected && !isPreview && 'outline outline-2 outline-offset-2 outline-blue-500',
    isOver && !isPreview && 'bg-blue-100/50',
    !isPreview && 'cursor-pointer'
  );

  // Assign ref for droppable containers
  const containerRef = isContainer ? setNodeRef : undefined;
  
  // --- Component Rendering Logic --- 

  switch (component.type) {
    case 'Text': {
      const textProps = component.props as TypographyProps;
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick}
          style={{
            ...baseStyle,
            fontSize: maybeStringOrNumber(textProps.fontSize),
            fontWeight: maybeStringOrNumber(textProps.fontWeight),
            color: maybeString(textProps.color), // Expects string
            textAlign: maybeString(textProps.textAlign) as React.CSSProperties['textAlign'], // Expects specific strings
            letterSpacing: maybeStringOrNumber(textProps.letterSpacing),
            lineHeight: maybeStringOrNumber(textProps.lineHeight),
            textDecoration: maybeString(textProps.textDecoration), // Expects string
          }}
        >
          {textProps.text || 'Text Component'} 
        </div>
      );
    }

    case 'Button': {
      const buttonProps = component.props as ButtonComponentType['props'];
      // Cast icon component to any to avoid JSX type errors
      const ButtonIcon: any = buttonProps.icon ? (Icons[buttonProps.icon as keyof typeof Icons] || null) : null;
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick} 
          style={baseStyle}
        >
          <Button
            variant={buttonProps.variant}
            size={buttonProps.size}
            className={cn(
              (component.props.width || component.props.height) && 'w-full h-full' 
            )}
            style={{ margin: 0, padding: 0 }}
          >
            {ButtonIcon && buttonProps.size !== 'icon' && <ButtonIcon className="mr-2 h-4 w-4" strokeWidth={1.5} />}
            {(buttonProps.size !== 'icon' || !ButtonIcon) && (buttonProps.label || 'Button')}
            {ButtonIcon && buttonProps.size === 'icon' && <ButtonIcon className="h-4 w-4" strokeWidth={1.5} />}
          </Button>
        </div>
      );
    }

    case 'Image': {
      const imageProps = component.props as ImageComponentType['props'];
      const img = (
           <img
            src={imageProps.src || 'https://via.placeholder.com/300x200'} 
            alt={imageProps.alt || 'Image'}
            style={{
              display: 'block',
              width: '100%', // Image fills its container (AspectRatio or div)
              height: '100%',
              objectFit: imageProps.fit || 'cover',
              borderRadius: component.props.borderRadius || undefined, // Apply borderRadius to image itself?
            }}
          />
      );
      return (
        <div className={wrapperClasses} onClick={handleClick} style={baseStyle}>
          {/* Conditionally wrap with AspectRatio if prop is set */}
          {imageProps.aspectRatio ? (
            <AspectRatio ratio={eval(imageProps.aspectRatio) || 1} className="bg-muted">
               {img}
            </AspectRatio>
          ) : (
            img // Render image directly if no aspect ratio
          )}
        </div>
      );
    }

    case 'Icon': {
      const iconProps = component.props as IconComponent['props'];
      const IconComponent = Icons[iconProps.name as keyof typeof Icons]; 
      // Check if it's a valid component before rendering
      // Cast to any to bypass strict type checking for dynamic component
      const isValidIcon = IconComponent && typeof IconComponent === 'object'; 
      const ElementToRender: any = isValidIcon ? IconComponent : Icons.HelpCircle; 

      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick}
          style={baseStyle} 
        >
          {/* Use the correctly typed element */}
          <ElementToRender 
            size={parseInt(iconProps.size || '24')}
            color={iconProps.color}
            strokeWidth={1.5}
          />
        </div>
      );
    }

    case 'Input': {
      const inputProps = component.props as InputComponent['props'];
      const inputId = `${component.id}-input`;
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick} 
          style={baseStyle} // Apply base styles (width, margin, etc.)
        >
          {/* Render label if provided */} 
          {inputProps.label && (
            <Label htmlFor={inputId} className="mb-1.5 text-sm font-medium block">
              {inputProps.label}
            </Label>
          )}
          <Input 
            id={inputId}
            type={inputProps.inputType || 'text'}
            placeholder={inputProps.placeholder}
            // In a real app, value/onChange would be handled differently
            // For renderer, just display the input visually
            readOnly // Make read-only in the renderer preview
            className={cn(
              'w-full', // Ensure input takes available width within its container
              // Add any other specific input styles if needed
            )}
            style={{
              // Remove baseStyle conflicting properties if necessary
              // e.g., padding might be controlled by Shadcn Input itself
              padding: undefined, 
              margin: undefined,
              height: undefined,
              border: undefined,
              borderRadius: undefined,
              backgroundColor: undefined
            }}
          />
        </div>
      );
    }

    case 'Card': {
      return (
        <div
          ref={containerRef}
          className={wrapperClasses}
          onClick={handleClick}
          style={baseStyle}
        >
          {renderChildren() || (
            !isPreview && isContainer && 
            <div className="flex items-center justify-center text-xs text-muted-foreground h-20 border border-dashed">
              Drop components here
            </div>
          )}
        </div>
      );
    }
      
    case 'Spacer': {
      const spacerProps = component.props as SpacerComponent['props'];
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick}
          style={{
            ...baseStyle, // Apply base styles like margin, opacity, etc.
            height: spacerProps.height || '20px', 
            width: '100%',
            // Explicitly clear potentially unwanted inherited styles
            backgroundColor: 'transparent', 
            border: 'none',
            boxShadow: 'none' 
          }}
        />
      );
    }

    case 'Divider': {
      const dividerProps = component.props as DividerComponent['props'];
      return (
        <div 
          className={wrapperClasses}
          onClick={handleClick} 
          style={baseStyle} // Apply base styles like margin
        >
          <div
            style={{
              // Use props for thickness and color
              height: dividerProps.thickness || '1px',
              backgroundColor: dividerProps.color || '#e0e0e0',
              width: '100%', // Assuming horizontal divider by default
            }}
          />
        </div>
      );
    }
      
    case 'Row': {
      const rowProps = component.props as RowComponent['props'];
      return (
        <div 
          ref={containerRef}
          className={cn(wrapperClasses, 'flex', isContainer && !isPreview && 'min-h-[40px] p-1 border border-dashed border-transparent hover:border-blue-300')} // Basic container styles
          onClick={handleClick}
          style={{
            ...baseStyle,
            gap: rowProps.gap,
            justifyContent: rowProps.justify,
            alignItems: rowProps.align,
          }}
        >
          {renderChildren() || (
             // Show placeholder only when interactive and empty
            !isPreview && isContainer && 
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground p-2">Drop here</div>
          )}
        </div>
      );
    }

    case 'Column': {
      const colProps = component.props as ColumnComponent['props'];
      return (
        <div 
          ref={containerRef}
          className={cn(wrapperClasses, 'flex flex-col', isContainer && !isPreview && 'min-h-[40px] p-1 border border-dashed border-transparent hover:border-blue-300')} // Basic container styles
          onClick={handleClick}
          style={{
            ...baseStyle,
            gap: colProps.gap,
            alignItems: colProps.align, // Justify content is less common for columns, but could be added
          }}
        >
           {renderChildren() || (
             // Show placeholder only when interactive and empty
            !isPreview && isContainer && 
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground p-2">Drop here</div>
          )}
        </div>
      );
    }
      
    case 'Box': {
      // Box is a generic container
      return (
        <div 
          ref={containerRef}
          className={cn(wrapperClasses, isContainer && !isPreview && 'min-h-[40px] p-1 border border-dashed border-transparent hover:border-blue-300')} // Basic container styles
          onClick={handleClick}
          style={baseStyle}
        >
           {renderChildren() || (
             // Show placeholder only when interactive and empty
            !isPreview && isContainer && 
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground p-2">Drop here</div>
          )}
        </div>
      );
    }

    case 'Link': {
      const linkProps = component.props as LinkComponent['props'];
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick}
          style={{
            ...baseStyle,
            fontSize: maybeStringOrNumber(linkProps.fontSize),
            fontWeight: maybeStringOrNumber(linkProps.fontWeight),
            color: maybeString(linkProps.color) || 'blue',
            textAlign: maybeString(linkProps.textAlign) as React.CSSProperties['textAlign'],
            textDecoration: maybeString(linkProps.textDecoration) || 'underline',
          }}
        >
          <a 
            href={linkProps.href} 
            target={linkProps.target || '_self'}
            rel={linkProps.rel}
            onClick={(e) => e.preventDefault()} // Prevent navigation in editor/preview
          >
            {linkProps.text || 'Link text'}
          </a>
        </div>
      );
    }

    case 'Video': {
      const videoProps = component.props as VideoComponent['props'];
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick} 
          style={baseStyle}
        >
          {/* YouTube için özel işleme */}
          {videoProps.src && videoProps.src.includes('youtube.com/embed') ? (
            <iframe
              src={videoProps.src}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', minHeight: '200px' }}
            />
          ) : (
            /* Normal video elementiyle render */
            <video
              src={videoProps.src}
              controls={videoProps.controls !== false}
              autoPlay={videoProps.autoplay || false}
              muted={videoProps.muted || false}
              loop={videoProps.loop || false}
              poster={videoProps.poster || undefined}
              style={{ width: '100%', height: '100%', minHeight: '200px' }}
            />
          )}
        </div>
      );
    }

    case 'Container': {
      const containerProps = component.props as ContainerComponent['props'];
      return (
        <div 
          ref={containerRef}
          className={cn(wrapperClasses, 'container mx-auto')} 
          onClick={handleClick} 
          style={{
            ...baseStyle,
            maxWidth: maybeStringOrNumber(containerProps.maxWidth),
            marginLeft: containerProps.centered ? 'auto' : undefined,
            marginRight: containerProps.centered ? 'auto' : undefined,
          }}
        >
          {renderChildren()}
        </div>
      );
    }

    case 'Grid': {
      const gridProps = component.props as GridComponent['props'];
      return (
        <div 
          ref={containerRef}
          className={wrapperClasses} 
          onClick={handleClick} 
          style={{
            ...baseStyle,
            display: 'grid',
            gridTemplateColumns: typeof gridProps.columns === 'string' ? gridProps.columns : 'repeat(3, 1fr)',
            gridTemplateRows: typeof gridProps.rows === 'string' ? gridProps.rows : 'auto',
            gap: typeof gridProps.gap === 'string' ? gridProps.gap : '16px',
            gridColumnGap: typeof gridProps.columnGap === 'string' ? gridProps.columnGap : undefined,
            gridRowGap: typeof gridProps.rowGap === 'string' ? gridProps.rowGap : undefined,
            gridAutoFlow: typeof gridProps.autoFlow === 'string' ? gridProps.autoFlow : undefined
          }}
        >
          {renderChildren()}
        </div>
      );
    }

    case 'Checkbox': {
      const checkboxProps = component.props as CheckboxComponent['props'];
      const checkboxId = `${component.id}-checkbox`;
      return (
        <div
          className={wrapperClasses + ' flex items-center space-x-2'}
          onClick={handleClick} 
          style={baseStyle} 
        >
          <Checkbox 
            id={checkboxId}
            checked={checkboxProps.checked ?? false}
            aria-label={checkboxProps.label || 'Checkbox'} 
          />
          {checkboxProps.label && (
            <Label 
              htmlFor={checkboxId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {checkboxProps.label}
            </Label>
          )}
        </div>
      );
    }

    case 'Select': {
      const selectProps = component.props as SelectComponent['props'];
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick} 
          style={baseStyle}
        >
          {selectProps.label && (
            <Label className="mb-2 block text-sm font-medium">
              {selectProps.label}
            </Label>
          )}
          <Select disabled={selectProps.disabled} defaultValue={selectProps.defaultValue ?? undefined}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={selectProps.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {selectProps.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              )) || (
                <>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      );
    }

    case 'Carousel': {
      const carouselProps = component.props as CarouselComponent['props'];
      // Basit bir carousel implementations yapıyoruz, gerçek bir carousel kütüphanesi olmadan
      const hasChildren = 'children' in component && Array.isArray(component.children) && component.children.length > 0;
      const [activeSlide, setActiveSlide] = useState(0);
      const totalSlides = hasChildren && component.children ? component.children.length : 3;
      
      // İleri/Geri butonları için fonksiyonlar
      const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveSlide((current) => (current + 1) % totalSlides);
      };
      
      const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveSlide((current) => (current - 1 + totalSlides) % totalSlides);
      };
      
      return (
        <div 
          ref={containerRef}
          className={cn(wrapperClasses, 'relative overflow-hidden')} 
          onClick={handleClick} 
          style={baseStyle}
        >
          {/* Carousel içeriği */}
          <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            {hasChildren && component.children ? (
              // Eğer children varsa onları render ediyoruz
              component.children.map((child, index) => (
                <div key={child.id} className="min-w-full flex-shrink-0">
                  <ComponentRenderer 
                    component={child} 
                    onSelect={onSelect} 
                    isSelected={isSelected && index === activeSlide}
                    isPreview={isPreview}
                  />
                </div>
              ))
            ) : (
              // Yoksa placeholder gösteriyoruz
              <>
                <div className="min-w-full flex-shrink-0 bg-gray-100 h-40 flex items-center justify-center">Slide 1</div>
                <div className="min-w-full flex-shrink-0 bg-gray-200 h-40 flex items-center justify-center">Slide 2</div>
                <div className="min-w-full flex-shrink-0 bg-gray-300 h-40 flex items-center justify-center">Slide 3</div>
              </>
            )}
          </div>
          
          {/* Carousel kontrol butonları */}
          {carouselProps.showArrows !== false && (
            <>
              <button 
                onClick={prevSlide} 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-70 hover:opacity-100"
                style={{ zIndex: 10 }}
              >
                <Icons.ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide} 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-70 hover:opacity-100"
                style={{ zIndex: 10 }}
              >
                <Icons.ChevronRight size={20} />
              </button>
            </>
          )}
          
          {/* Gösterge noktaları */}
          {carouselProps.showDots !== false && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveSlide(i); }}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i === activeSlide ? "bg-primary" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'Table': {
      const tableProps = component.props as TableComponent['props'];
      const columns = tableProps.columns || [
        { key: 'column1', title: 'Column 1', width: '33%' },
        { key: 'column2', title: 'Column 2', width: '33%' },
        { key: 'column3', title: 'Column 3', width: '33%' }
      ];
      
      // Örnek veri - gerçek uygulamada veri kaynağından gelecek
      const dummyData = [
        { column1: 'Row 1, Cell 1', column2: 'Row 1, Cell 2', column3: 'Row 1, Cell 3' },
        { column1: 'Row 2, Cell 1', column2: 'Row 2, Cell 2', column3: 'Row 2, Cell 3' },
      ];
      
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick} 
          style={baseStyle}
        >
          <Table className={tableProps.bordered ? 'border border-border' : ''}>
            <TableHeader>
              <TableRow className={tableProps.striped ? 'bg-muted/50' : ''}>
                {columns.map((column) => (
                  <TableHead key={column.key} style={{ width: column.width }}>
                    {column.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyData.map((row, i) => (
                <TableRow key={i} className={tableProps.striped && i % 2 === 1 ? 'bg-muted/50' : ''}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{row[column.key as keyof typeof row]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination gösterimi - Gerçek bir pagination değil, sadece görünüm */}
          {tableProps.pagination && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="px-4">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          )}
        </div>
      );
    }

    case 'ProgressBar': {
      const progressProps = component.props as ProgressBarComponent['props'];
      const value = progressProps.value !== null && progressProps.value !== undefined ? progressProps.value : 50;
      const max = progressProps.max !== null && progressProps.max !== undefined ? progressProps.max : 100;
      const percentage = Math.min(100, Math.max(0, (value / max) * 100));
      
      return (
        <div 
          className={wrapperClasses} 
          onClick={handleClick} 
          style={baseStyle}
        >
          <div className="space-y-2 w-full">
            {progressProps.showLabel && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
              </div>
            )}
            <Progress 
              value={percentage} 
              className={cn(
                progressProps.size === 'sm' ? 'h-2' : 
                progressProps.size === 'lg' ? 'h-4' : 'h-3',
                progressProps.shape === 'pill' ? 'rounded-full' :
                progressProps.shape === 'flat' ? 'rounded-none' : 'rounded-md'
              )}
              // İleri seviye özelleştirme için stil kullanımı
              style={{
                backgroundColor: progressProps.color ? `${progressProps.color}33` : undefined, // Arka plan rengi daha açık
                '--progress-color': progressProps.color || undefined, // CSS değişkeni olarak renk
              } as React.CSSProperties}
            />
          </div>
        </div>
      );
    }

    default:
      // Exhaustiveness check - this should ideally not happen with typed components
      // const _exhaustiveCheck: never = component;
      return <div className="text-red-500 text-xs p-1">Unknown Type: {(component as any).type}</div>;
  }
}