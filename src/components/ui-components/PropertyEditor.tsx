import React from 'react';
import {
  Component,
  ComponentID,
  TextComponent,
  ButtonComponent,
  ImageComponent,
  RowComponent,
  ColumnComponent,
  DividerComponent,
  BoxComponent,
  BaseProps,
  TypographyProps,
  ActionProps,
  Justify,
  Alignment,
  ComponentType,
  IconComponent,
  InputComponent,
  CardComponent,
  SpacerComponent
} from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash as TrashIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface PropertyEditorProps {
  component: Component | null;
  onChange: (updatedComponent: Component) => void;
  onDelete: (id: ComponentID) => void;
}

export function PropertyEditor({ component, onChange, onDelete }: PropertyEditorProps) {
  if (!component) {
    return (
      <div className="p-4 text-sm text-center text-muted-foreground">
        Select a component to edit its properties.
      </div>
    );
  }

  const handleChange = (property: string, value: any) => {
    const updatedComponent = JSON.parse(JSON.stringify(component));
    updatedComponent.props[property] = value;
    onChange(updatedComponent);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium">Properties</h3>
        <p className="text-sm text-muted-foreground">{component.type} Component</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-sm mb-2">Layout</h4>
          <div className="space-y-2">
            <Label htmlFor={`${component.id}-width`}>Width</Label>
            <Input 
              id={`${component.id}-width`}
              value={component.props.width || ''} 
              onChange={(e) => handleChange('width', e.target.value)} 
              placeholder="e.g., 100px, 100%, auto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${component.id}-height`}>Height</Label>
            <Input 
              id={`${component.id}-height`}
              value={component.props.height || ''} 
              onChange={(e) => handleChange('height', e.target.value)} 
              placeholder="e.g., 50px, auto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${component.id}-margin`}>Margin</Label>
            <Input 
              id={`${component.id}-margin`}
              value={component.props.margin || ''} 
              onChange={(e) => handleChange('margin', e.target.value)} 
              placeholder="e.g., 10px, 5px 10px"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${component.id}-padding`}>Padding</Label>
            <Input 
              id={`${component.id}-padding`}
              value={component.props.padding || ''} 
              onChange={(e) => handleChange('padding', e.target.value)} 
              placeholder="e.g., 10px, 5px 10px"
            />
          </div>
        </div>
        
        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium text-sm mb-2">Appearance</h4>
          <div className="space-y-2">
            <Label htmlFor={`${component.id}-bgColor`}>Background Color</Label>
            <Input 
              id={`${component.id}-bgColor`}
              type="color"
              value={component.props.backgroundColor || '#ffffff'} 
              onChange={(e) => handleChange('backgroundColor', e.target.value)} 
              className="h-8 p-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${component.id}-borderRadius`}>Border Radius</Label>
            <Input 
              id={`${component.id}-borderRadius`}
              value={component.props.borderRadius || ''} 
              onChange={(e) => handleChange('borderRadius', e.target.value)} 
              placeholder="e.g., 5px, 50%"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${component.id}-border`}>Border</Label>
            <Input 
              id={`${component.id}-border`}
              value={component.props.border || ''} 
              onChange={(e) => handleChange('border', e.target.value)} 
              placeholder="e.g., 1px solid #ccc"
            />
          </div>
        </div>

        <Separator />
        
        {(() => {
          switch (component.type) {
            case 'Text':
              const textProps = component.props as TextComponent['props'];
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Text</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-text`}>Content</Label>
                    <Input 
                      id={`${component.id}-text`}
                      value={textProps.text || ''} 
                      onChange={(e) => handleChange('text', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-fontSize`}>Font Size</Label>
                    <Input 
                      id={`${component.id}-fontSize`}
                      value={textProps.fontSize || ''} 
                      onChange={(e) => handleChange('fontSize', e.target.value)} 
                      placeholder="e.g., 16px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-fontWeight`}>Font Weight</Label>
                    <Select 
                      value={textProps.fontWeight || 'normal'}
                      onValueChange={(value) => handleChange('fontWeight', value)}
                    >
                      <SelectTrigger id={`${component.id}-fontWeight`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-color`}>Color</Label>
                    <Input 
                      id={`${component.id}-color`}
                      type="color"
                      value={textProps.color || '#000000'} 
                      onChange={(e) => handleChange('color', e.target.value)} 
                      className="h-8 p-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-textAlign`}>Text Align</Label>
                    <Select 
                      value={textProps.textAlign || 'left'}
                      onValueChange={(value) => handleChange('textAlign', value)}
                    >
                      <SelectTrigger id={`${component.id}-textAlign`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            case 'Button':
              const buttonProps = component.props as ButtonComponent['props'];
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Button</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-label`}>Label</Label>
                    <Input 
                      id={`${component.id}-label`}
                      value={buttonProps.label || ''} 
                      onChange={(e) => handleChange('label', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-variant`}>Variant</Label>
                    <Select 
                      value={buttonProps.variant || 'default'}
                      onValueChange={(value) => handleChange('variant', value)}
                    >
                      <SelectTrigger id={`${component.id}-variant`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-size`}>Size</Label>
                    <Select 
                      value={buttonProps.size || 'default'}
                      onValueChange={(value) => handleChange('size', value)}
                    >
                      <SelectTrigger id={`${component.id}-size`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-onClick`}>OnClick Action</Label>
                    <Input 
                      id={`${component.id}-onClick`}
                      value={buttonProps.onClick || ''} 
                      onChange={(e) => handleChange('onClick', e.target.value)} 
                      placeholder="Action ID or route"
                    />
                  </div>
                </div>
              );
            case 'Image':
              const imageProps = component.props as ImageComponent['props'];
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Image</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-src`}>Source URL</Label>
                    <Input 
                      id={`${component.id}-src`}
                      value={imageProps.src || ''} 
                      onChange={(e) => handleChange('src', e.target.value)} 
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-alt`}>Alt Text</Label>
                    <Input 
                      id={`${component.id}-alt`}
                      value={imageProps.alt || ''} 
                      onChange={(e) => handleChange('alt', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-fit`}>Object Fit</Label>
                    <Select 
                      value={imageProps.fit || 'cover'}
                      onValueChange={(value) => handleChange('fit', value)}
                    >
                      <SelectTrigger id={`${component.id}-fit`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="contain">Contain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            case 'Row':
              const rowProps = component.props as RowComponent['props'];
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Row Layout</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-gap`}>Gap</Label>
                    <Input 
                      id={`${component.id}-gap`}
                      value={rowProps.gap || ''} 
                      onChange={(e) => handleChange('gap', e.target.value)} 
                      placeholder="e.g., 10px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-justify`}>Justify</Label>
                    <Select 
                      value={rowProps.justify || 'start'}
                      onValueChange={(value: Justify) => handleChange('justify', value)}
                    >
                      <SelectTrigger id={`${component.id}-justify`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="start">Start</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="end">End</SelectItem>
                        <SelectItem value="space-between">Space Between</SelectItem>
                        <SelectItem value="space-around">Space Around</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-align`}>Align</Label>
                    <Select 
                      value={rowProps.align || 'start'}
                      onValueChange={(value: Alignment) => handleChange('align', value)}
                    >
                      <SelectTrigger id={`${component.id}-align`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="start">Start</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="end">End</SelectItem>
                        <SelectItem value="space-between">Space Between</SelectItem>
                        <SelectItem value="space-around">Space Around</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            case 'Column':
              const colProps = component.props as ColumnComponent['props'];
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Column Layout</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-gap`}>Gap</Label>
                    <Input 
                      id={`${component.id}-gap`}
                      value={colProps.gap || ''} 
                      onChange={(e) => handleChange('gap', e.target.value)} 
                      placeholder="e.g., 10px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-align`}>Align</Label>
                    <Select 
                      value={colProps.align || 'start'}
                      onValueChange={(value: Alignment) => handleChange('align', value)}
                    >
                      <SelectTrigger id={`${component.id}-align`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="start">Start</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="end">End</SelectItem>
                        <SelectItem value="space-between">Space Between</SelectItem>
                        <SelectItem value="space-around">Space Around</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            case 'Divider':
              const dividerProps = component.props as DividerComponent['props'];
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Divider</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-thickness`}>Thickness</Label>
                    <Input 
                      id={`${component.id}-thickness`}
                      value={dividerProps.thickness || ''} 
                      onChange={(e) => handleChange('thickness', e.target.value)} 
                      placeholder="e.g., 1px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-color`}>Color</Label>
                    <Input 
                      id={`${component.id}-color`}
                      type="color"
                      value={dividerProps.color || '#e0e0e0'} 
                      onChange={(e) => handleChange('color', e.target.value)} 
                      className="h-8 p-1"
                    />
                  </div>
                </div>
              );
            case 'Box':
              return <p className="text-sm text-muted-foreground">Box uses common Layout and Appearance properties.</p>;
            case 'Icon':
              const iconProps = component.props as IconComponent['props'];
              const iconNames = Object.keys(Icons).filter(key => 
                typeof Icons[key as keyof typeof Icons] === 'object' && key !== 'createLucideIcon'
              );
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Icon</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-iconName`}>Icon Name</Label>
                    <Select 
                      value={iconProps.name}
                      onValueChange={(value) => handleChange('name', value)}
                    >
                      <SelectTrigger id={`${component.id}-iconName`}><SelectValue placeholder="Select an icon" /></SelectTrigger>
                      <SelectContent className="max-h-60">
                        {iconNames.map(name => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-iconSize`}>Size</Label>
                    <Input 
                      id={`${component.id}-iconSize`}
                      value={iconProps.size || ''} 
                      onChange={(e) => handleChange('size', e.target.value)} 
                      placeholder="e.g., 24px"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-iconColor`}>Color</Label>
                    <Input 
                      id={`${component.id}-iconColor`}
                      type="color"
                      value={iconProps.color || '#333333'} 
                      onChange={(e) => handleChange('color', e.target.value)} 
                      className="h-8 p-1"
                    />
                  </div>
                </div>
              );
            case 'Input':
              const inputProps = component.props as InputComponent['props'];
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Input</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-inputLabel`}>Label Text</Label>
                    <Input 
                      id={`${component.id}-inputLabel`}
                      value={inputProps.label || ''} 
                      onChange={(e) => handleChange('label', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-inputPlaceholder`}>Placeholder</Label>
                    <Input 
                      id={`${component.id}-inputPlaceholder`}
                      value={inputProps.placeholder || ''} 
                      onChange={(e) => handleChange('placeholder', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-inputType`}>Input Type</Label>
                    <Select 
                      value={inputProps.inputType || 'text'}
                      onValueChange={(value) => handleChange('inputType', value)}
                    >
                      <SelectTrigger id={`${component.id}-inputType`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="password">Password</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            case 'Card':
              return (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Card</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-elevation`}>Gölge Seviyesi</Label>
                    <Select 
                      value={(component.props.boxShadow || 'sm')}
                      onValueChange={(value) => handleChange('boxShadow', value)}
                    >
                      <SelectTrigger id={`${component.id}-elevation`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Yok</SelectItem>
                        <SelectItem value="sm">Hafif</SelectItem>
                        <SelectItem value="md">Orta</SelectItem>
                        <SelectItem value="lg">Güçlü</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">Card İçeriklerini kanvas üzerinde ekleyebilirsiniz.</p>
                  <div className="space-y-2 mt-2">
                    <Label htmlFor={`${component.id}-border-color`}>Kenarlık Rengi</Label>
                    <Input 
                      id={`${component.id}-border-color`}
                      type="color"
                      value={component.props.borderColor || '#e2e8f0'} 
                      onChange={(e) => {
                        const color = e.target.value;
                        handleChange('border', `1px solid ${color}`);
                        handleChange('borderColor', color);
                      }} 
                      className="h-8 p-1"
                    />
                  </div>
                </div>
              );
            case 'Spacer':
              const spacerProps = component.props as SpacerComponent['props'];
              return (
                 <div className="space-y-4">
                  <h4 className="font-medium text-sm mb-2">Spacer</h4>
                  <div className="space-y-2">
                    <Label htmlFor={`${component.id}-spacerHeight`}>Height</Label>
                    <Input 
                      id={`${component.id}-spacerHeight`}
                      value={spacerProps.height || ''} 
                      onChange={(e) => handleChange('height', e.target.value)} 
                      placeholder="e.g., 20px"
                    />
                  </div>
                </div>
              );
            default:
              return <p className="text-sm text-muted-foreground">No specific properties for this component type.</p>;
          }
        })()}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <Button 
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onDelete(component.id)}
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete Component
        </Button>
      </div>
    </div>
  );
}