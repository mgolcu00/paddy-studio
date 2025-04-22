import {
  Component,
  ComponentType,
  ComponentID,
  BaseProps,
  TypographyProps,
  ActionProps,
  DataBindingProps,
  AnimationProps,
  TextComponent,
  ButtonComponent,
  ImageComponent,
  RowComponent,
  ColumnComponent,
  DividerComponent,
  BoxComponent,
  Justify,
  Alignment,
  IconComponent,
  InputComponent,
  CardComponent,
  SpacerComponent,
  LinkComponent,
  VideoComponent,
  ContainerComponent,
  GridComponent,
  CheckboxComponent,
  SelectComponent,
  CarouselComponent,
  TableComponent,
  ProgressBarComponent,
  ComponentMetadata,
  componentCategories
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Component metadata - Java SDK entegrasyonu için önemli
const componentMetadata: Record<ComponentType, ComponentMetadata> = {
  // Layout componentleri
  'Box': {
    type: 'Box',
    displayName: 'Box',
    description: 'Temel konteynır elementi',
    category: 'layout',
    acceptsChildren: true,
    isContainer: true
  },
  'Row': {
    type: 'Row',
    displayName: 'Row',
    description: 'Yatay hizalama için flex container',
    category: 'layout',
    acceptsChildren: true,
    isContainer: true
  },
  'Column': {
    type: 'Column',
    displayName: 'Column',
    description: 'Dikey hizalama için flex container',
    category: 'layout',
    acceptsChildren: true,
    isContainer: true
  },
  'Card': {
    type: 'Card',
    displayName: 'Card',
    description: 'İçerik kartı',
    category: 'layout',
    acceptsChildren: true,
    isContainer: true
  },
  'Container': {
    type: 'Container',
    displayName: 'Container',
    description: 'Sınırlı genişlikte içerik alanı',
    category: 'layout',
    acceptsChildren: true,
    isContainer: true
  },
  'Grid': {
    type: 'Grid',
    displayName: 'Grid',
    description: 'CSS Grid tabanlı düzen elementi',
    category: 'layout',
    acceptsChildren: true,
    isContainer: true
  },
  'Spacer': {
    type: 'Spacer',
    displayName: 'Spacer',
    description: 'Boşluk elementi',
    category: 'layout',
    acceptsChildren: false
  },
  
  // Basic componentler
  'Text': {
    type: 'Text',
    displayName: 'Text',
    description: 'Metin elementi',
    category: 'basic',
    acceptsChildren: false
  },
  'Button': {
    type: 'Button',
    displayName: 'Button',
    description: 'Buton elementi',
    category: 'basic',
    acceptsChildren: false
  },
  'Image': {
    type: 'Image',
    displayName: 'Image',
    description: 'Görsel elementi',
    category: 'basic',
    acceptsChildren: false
  },
  'Icon': {
    type: 'Icon',
    displayName: 'Icon',
    description: 'İkon elementi',
    category: 'basic',
    acceptsChildren: false
  },
  'Divider': {
    type: 'Divider',
    displayName: 'Divider',
    description: 'Ayırıcı çizgi',
    category: 'basic',
    acceptsChildren: false
  },
  'Link': {
    type: 'Link',
    displayName: 'Link',
    description: 'Bağlantı elementi',
    category: 'basic',
    acceptsChildren: false
  },
  
  // Form componentleri
  'Input': {
    type: 'Input',
    displayName: 'Input',
    description: 'Metin girişi elementi',
    category: 'form',
    acceptsChildren: false
  },
  'Checkbox': {
    type: 'Checkbox',
    displayName: 'Checkbox',
    description: 'Onay kutusu elementi',
    category: 'form',
    acceptsChildren: false
  },
  'RadioGroup': {
    type: 'RadioGroup',
    displayName: 'Radio Group',
    description: 'Radyo buton grubu',
    category: 'form',
    acceptsChildren: false
  },
  'Select': {
    type: 'Select',
    displayName: 'Select',
    description: 'Açılır menü seçim elementi',
    category: 'form',
    acceptsChildren: false
  },
  'Slider': {
    type: 'Slider',
    displayName: 'Slider',
    description: 'Kaydırıcı elementi',
    category: 'form',
    acceptsChildren: false
  },
  'Switch': {
    type: 'Switch',
    displayName: 'Switch',
    description: 'Anahtar/Toggle elementi',
    category: 'form',
    acceptsChildren: false
  },
  'TextArea': {
    type: 'TextArea',
    displayName: 'Text Area',
    description: 'Çok satırlı metin girişi',
    category: 'form',
    acceptsChildren: false
  },
  'Form': {
    type: 'Form',
    displayName: 'Form',
    description: 'Form container elementi',
    category: 'form',
    acceptsChildren: true,
    isContainer: true
  },
  
  // Media componentleri
  'Video': {
    type: 'Video',
    displayName: 'Video',
    description: 'Video oynatıcı elementi',
    category: 'media',
    acceptsChildren: false
  },
  'Audio': {
    type: 'Audio',
    displayName: 'Audio',
    description: 'Ses oynatıcı elementi',
    category: 'media',
    acceptsChildren: false
  },
  'Carousel': {
    type: 'Carousel',
    displayName: 'Carousel',
    description: 'Slayt gösterisi elementi',
    category: 'media',
    acceptsChildren: true,
    isContainer: true
  },
  'ImageGallery': {
    type: 'ImageGallery',
    displayName: 'Image Gallery',
    description: 'Görsel galerisi',
    category: 'media',
    acceptsChildren: false
  },
  
  // Advanced componentler
  'Tabs': {
    type: 'Tabs',
    displayName: 'Tabs',
    description: 'Sekme elementi',
    category: 'advanced',
    acceptsChildren: true,
    isContainer: true
  },
  'Accordion': {
    type: 'Accordion',
    displayName: 'Accordion',
    description: 'Akordiyon elementi',
    category: 'advanced',
    acceptsChildren: true,
    isContainer: true
  },
  'List': {
    type: 'List',
    displayName: 'List',
    description: 'Liste elementi',
    category: 'advanced',
    acceptsChildren: true,
    isContainer: true
  },
  'Table': {
    type: 'Table',
    displayName: 'Table',
    description: 'Tablo elementi',
    category: 'advanced',
    acceptsChildren: false
  },
  'Chart': {
    type: 'Chart',
    displayName: 'Chart',
    description: 'Grafik elementi',
    category: 'advanced',
    acceptsChildren: false
  },
  'Map': {
    type: 'Map',
    displayName: 'Map',
    description: 'Harita elementi',
    category: 'advanced',
    acceptsChildren: false
  },
  'Dialog': {
    type: 'Dialog',
    displayName: 'Dialog',
    description: 'Diyalog/Modal pencere',
    category: 'advanced',
    acceptsChildren: true,
    isContainer: true
  },
  'Tooltip': {
    type: 'Tooltip',
    displayName: 'Tooltip',
    description: 'İpucu balonu',
    category: 'advanced',
    acceptsChildren: true,
    isContainer: true
  },
  'ProgressBar': {
    type: 'ProgressBar',
    displayName: 'Progress Bar',
    description: 'İlerleme çubuğu',
    category: 'advanced',
    acceptsChildren: false
  }
};

export const createDefaultComponent = (type: ComponentType): Component => {
  const id: ComponentID = uuidv4();
  
  const defaultBaseProps: BaseProps = {
    width: null,
    height: null,
    padding: '0px',
    margin: '0px',
    backgroundColor: null,
    borderRadius: '0px',
    border: null,
    boxShadow: null,
    opacity: null,
    visible: true,
    style: {},
  };

  const defaultDataBindingProps: DataBindingProps = {
    dataSource: null,
    dataPath: null,
    dataFormat: null,
    dataBind: null,
    dataTransform: null
  };

  const defaultAnimationProps: AnimationProps = {
    animationType: null,
    animationDuration: null,
    animationDelay: null,
    animationTiming: null
  };

  const defaultActionProps: ActionProps = {
    onClick: null,
    onHover: null,
    onFocus: null,
    onBlur: null,
    link: null,
  };

  const metadata = componentMetadata[type];

  switch (type) {
    case 'Box':
      return {
        id,
        type: 'Box',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          padding: '10px',
          backgroundColor: 'transparent'
        },
        children: [],
        metadata
      } as BoxComponent;

    case 'Text':
      const defaultTypographyProps: TypographyProps = {
        text: 'New Text',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#333333',
        textAlign: 'left',
        letterSpacing: null,
        lineHeight: null,
        textDecoration: null,
        fontFamily: null,
        textTransform: null,
        overflow: null
      };
      return {
        id,
        type: 'Text',
        props: {
          ...defaultBaseProps,
          ...defaultTypographyProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps
        },
        metadata
      } as TextComponent;
    
    case 'Button':
      return {
        id,
        type: 'Button',
        props: {
          ...defaultBaseProps,
          ...defaultActionProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          label: 'Click Me',
          variant: 'default',
          size: 'default',
          icon: null,
          disabled: false,
          loading: false
        },
        metadata
      } as ButtonComponent;
    
    case 'Image':
      return {
        id,
        type: 'Image',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          src: 'https://via.placeholder.com/300x200',
          alt: 'Placeholder Image',
          fit: 'cover',
          aspectRatio: null,
          width: '300px',
          height: '200px',
          lazy: true,
          placeholder: null
        },
        metadata
      } as ImageComponent;
    
    case 'Divider':
      return {
        id,
        type: 'Divider',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          thickness: '1px',
          color: '#e0e0e0',
          margin: '8px 0px',
          orientation: 'horizontal',
          dashed: false
        },
        metadata
      } as DividerComponent;
    
    case 'Row':
      return {
        id,
        type: 'Row',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          gap: '8px',
          justify: 'start',
          align: 'center',
          padding: '5px',
          wrap: 'wrap'
        },
        children: [],
        metadata
      } as RowComponent;
    
    case 'Column':
      return {
        id,
        type: 'Column',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          gap: '8px',
          align: 'start',
          justify: 'start',
          padding: '5px',
        },
        children: [],
        metadata
      } as ColumnComponent;

    case 'Icon':
      return {
        id,
        type: 'Icon',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          ...defaultActionProps,
          name: 'Smile',
          size: '24px',
          color: '#333333',
          rotate: null,
          flip: null
        },
        metadata
      } as IconComponent;

    case 'Input':
      return {
        id,
        type: 'Input',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          ...defaultActionProps,
          placeholder: 'Enter text...',
          label: 'Label',
          inputType: 'text',
          width: '100%',
          defaultValue: null,
          required: false,
          disabled: false,
          validation: null,
          errorMessage: null
        },
        metadata
      } as InputComponent;

    case 'Card':
      return {
        id,
        type: 'Card',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          ...defaultActionProps,
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          borderColor: '#e0e0e0',
          backgroundColor: '#ffffff',
          boxShadow: 'sm',
          hoverable: false,
          clickable: false,
          headerVisible: false,
          footerVisible: false
        },
        children: [],
        metadata
      } as CardComponent;
      
    case 'Spacer':
      return {
        id,
        type: 'Spacer',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          height: '20px',
          responsive: true
        },
        metadata
      } as SpacerComponent;

    case 'Link':
      const defaultLinkTypography: TypographyProps = {
        text: 'Clickable Link',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#0000ee',
        textAlign: 'left',
        letterSpacing: null,
        lineHeight: null,
        textDecoration: 'underline',
        fontFamily: null,
        textTransform: null,
        overflow: null
      };
      return {
        id,
        type: 'Link',
        props: {
          ...defaultBaseProps,
          ...defaultLinkTypography,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          href: '#',
          target: '_self',
          download: false,
          rel: null
        },
        metadata
      } as LinkComponent;

    case 'Video':
      return {
        id,
        type: 'Video',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          ...defaultActionProps,
          src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          controls: true,
          autoplay: false,
          muted: false,
          loop: false,
          width: '560px',
          height: '315px',
          poster: null,
          startTime: null
        },
        metadata
      } as VideoComponent;

    // Yeni component tipleri için default değerler
    case 'Container':
      return {
        id,
        type: 'Container',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          maxWidth: '1200px',
          centered: true,
          padding: '16px'
        },
        children: [],
        metadata
      } as ContainerComponent;

    case 'Grid':
      return {
        id,
        type: 'Grid',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          columns: '1fr 1fr 1fr',
          rows: 'auto',
          gap: '16px',
          columnGap: null,
          rowGap: null,
          autoFlow: null
        },
        children: [],
        metadata
      } as GridComponent;

    case 'Checkbox':
      return {
        id,
        type: 'Checkbox',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          ...defaultActionProps,
          label: 'Checkbox Label',
          checked: false,
          disabled: false,
          required: false,
          indeterminate: false
        },
        metadata
      } as CheckboxComponent;

    case 'Select':
      return {
        id,
        type: 'Select',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          ...defaultActionProps,
          label: 'Select Label',
          placeholder: 'Choose an option',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          defaultValue: null,
          required: false,
          disabled: false,
          multiple: false,
          searchable: false,
          width: '100%'
        },
        metadata
      } as SelectComponent;

    case 'Carousel':
      return {
        id,
        type: 'Carousel',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          autoplay: true,
          interval: 3000,
          showDots: true,
          showArrows: true,
          infinite: true
        },
        children: [],
        metadata
      } as CarouselComponent;

    case 'Table':
      return {
        id,
        type: 'Table',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          ...defaultActionProps,
          columns: [
            { key: 'column1', title: 'Column 1', dataType: 'string', width: '33%' },
            { key: 'column2', title: 'Column 2', dataType: 'string', width: '33%' },
            { key: 'column3', title: 'Column 3', dataType: 'string', width: '33%' }
          ],
          pagination: true,
          bordered: true,
          striped: false,
          sortable: true,
          rowSelection: false,
          width: '100%'
        },
        metadata
      } as TableComponent;

    case 'ProgressBar':
      return {
        id,
        type: 'ProgressBar',
        props: {
          ...defaultBaseProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps,
          value: 50,
          max: 100,
          showLabel: true,
          color: '#3b82f6',
          size: 'md',
          shape: 'rounded',
          animated: true,
          width: '100%'
        },
        metadata
      } as ProgressBarComponent;

    default:
      const fallbackTypographyProps: TypographyProps = {
        text: `Unhandled: ${type}`,
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#dc2626',
        textAlign: 'left',
        letterSpacing: null,
        lineHeight: null,
        textDecoration: null,
        fontFamily: null,
        textTransform: null,
        overflow: null
      };
      return {
        id,
        type: 'Text',
        props: {
          ...defaultBaseProps,
          ...fallbackTypographyProps,
          ...defaultDataBindingProps,
          ...defaultAnimationProps
        },
        metadata: componentMetadata['Text']
      } as TextComponent;
  }
};

// Sürüklenebilir bileşenler listesi - Java SDK'da direkt karşılık bulabilecek şekilde düzenli
export const draggableItems = [
  // Layout componentleri
  ...componentCategories.layout.map(type => ({
    id: type.toLowerCase(),
    type: type as ComponentType,
    label: componentMetadata[type as ComponentType].displayName,
    description: componentMetadata[type as ComponentType].description,
    category: 'layout' as const
  })),
  
  // Basic componentler
  ...componentCategories.basic.map(type => ({
    id: type.toLowerCase(),
    type: type as ComponentType,
    label: componentMetadata[type as ComponentType].displayName,
    description: componentMetadata[type as ComponentType].description,
    category: 'basic' as const
  })),
  
  // Form componentleri
  ...componentCategories.form.map(type => ({
    id: type.toLowerCase(),
    type: type as ComponentType,
    label: componentMetadata[type as ComponentType].displayName,
    description: componentMetadata[type as ComponentType].description,
    category: 'form' as const
  })),
  
  // Media componentleri
  ...componentCategories.media.map(type => ({
    id: type.toLowerCase(),
    type: type as ComponentType,
    label: componentMetadata[type as ComponentType].displayName,
    description: componentMetadata[type as ComponentType].description,
    category: 'media' as const
  })),
  
  // Advanced componentler
  ...componentCategories.advanced.map(type => ({
    id: type.toLowerCase(),
    type: type as ComponentType,
    label: componentMetadata[type as ComponentType].displayName,
    description: componentMetadata[type as ComponentType].description,
    category: 'advanced' as const
  }))
];