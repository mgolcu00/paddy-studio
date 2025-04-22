export interface User {
  id: string;
  email: string;
  displayName?: string;
  subscription?: SubscriptionInfo;
  billingDetails?: BillingDetails;
  createdAt?: number;
}

// Abonelik bilgileri
export interface SubscriptionInfo {
  planId: string;
  status: 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: number | null;
  lastPaymentDate?: number | null;
  nextPaymentDate?: number | null;
  subscriptionId?: string; // Ödeme sağlayıcı tarafından sağlanan ID
}

// Fatura bilgileri
export interface BillingDetails {
  name?: string;
  company?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  vatNumber?: string;
  paymentMethod?: {
    type: 'card' | 'bank_transfer' | 'paypal';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  } | null;
}

// Fiyatlandırma planı
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number; // Aylık fiyat (TL)
  yearlyPrice?: number; // Yıllık fiyat (TL, indirimli)
  features: string[];
  limitations: {
    projects?: number | 'unlimited'; // Proje sayısı sınırı
    storage?: number; // GB cinsinden depolama
    teamMembers?: number | 'unlimited'; // Ekip üyesi sayısı
    apiCalls?: number | 'unlimited'; // Aylık API çağrı limiti
  };
  recommended?: boolean;
  available: boolean;
  trialDays?: number; // Ücretsiz deneme süresi (gün)
  popular?: boolean; // Öne çıkarılacak plan
  badge?: string; // "Yeni", "İndirimli" vb. rozet metni
}

// Fatura bilgisi
export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'void' | 'pending';
  date: number;
  dueDate: number;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
  pdfUrl?: string;
  paymentId?: string;
}

// Ödeme geçmişi
export interface PaymentHistory {
  id: string;
  userId: string;
  amount: number;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  date: number;
  paymentMethod: {
    type: 'card' | 'bank_transfer' | 'paypal';
    last4?: string;
    brand?: string;
  };
  description: string;
  invoiceId?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface Page {
  id: string;
  name: string;
  components: Component[];
  projectId: string;
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
}

export type ComponentID = string;

// Kategorileştirilmiş compenent tipleri - Java SDK entegrasyonu için önemli
export type LayoutComponentType = 
  | 'Row'
  | 'Column'
  | 'Box'
  | 'Card'
  | 'Container'
  | 'Grid'
  | 'Spacer';

export type BasicComponentType = 
  | 'Text'
  | 'Button'
  | 'Image'
  | 'Icon'
  | 'Divider'
  | 'Link';

export type FormComponentType = 
  | 'Input'
  | 'Checkbox'
  | 'RadioGroup'
  | 'Select'
  | 'Slider'
  | 'Switch'
  | 'TextArea'
  | 'Form';

export type MediaComponentType = 
  | 'Video'
  | 'Audio'
  | 'Carousel'
  | 'ImageGallery';

export type AdvancedComponentType = 
  | 'Tabs'
  | 'Accordion'
  | 'List'
  | 'Table'
  | 'Chart'
  | 'Map'
  | 'Dialog'
  | 'Tooltip'
  | 'ProgressBar';

export type ComponentType =
  | LayoutComponentType
  | BasicComponentType
  | FormComponentType
  | MediaComponentType
  | AdvancedComponentType;

// Component kategori bilgisi - Java SDK için grup bilgisi
export const componentCategories = {
  layout: ['Row', 'Column', 'Box', 'Card', 'Container', 'Grid', 'Spacer'],
  basic: ['Text', 'Button', 'Image', 'Icon', 'Divider', 'Link'],
  form: ['Input', 'Checkbox', 'RadioGroup', 'Select', 'Slider', 'Switch', 'TextArea', 'Form'],
  media: ['Video', 'Audio', 'Carousel', 'ImageGallery'],
  advanced: ['Tabs', 'Accordion', 'List', 'Table', 'Chart', 'Map', 'Dialog', 'Tooltip', 'ProgressBar']
};

// Component metadata - Java SDK için meta bilgileri
export interface ComponentMetadata {
  type: ComponentType;
  displayName: string;
  description: string;
  category: 'layout' | 'basic' | 'form' | 'media' | 'advanced';
  acceptsChildren: boolean;
  defaultSize?: { width: string | number, height: string | number };
  isContainer?: boolean;
}

export type Alignment = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type Direction = 'horizontal' | 'vertical';
export type Justify = 'start' | 'center' | 'end' | 'space-between';

// Temel özellikler - Tüm componentlerde ortak
export interface BaseProps {
  width: string | number | null;
  height: string | number | null;
  padding: string | null;
  margin: string | null;
  backgroundColor: string | null;
  borderRadius: string | null;
  border: string | null;
  borderColor?: string | null;
  boxShadow: string | null;
  opacity: number | null;
  visible?: boolean;
  transform?: string | null;
  transition?: string | null;
  cursor?: string | null;
  zIndex?: number | null;
  style: Record<string, any>;
}

// Veri bağlama özellikleri - Java SDK için veriye bağlama
export interface DataBindingProps {
  dataSource?: string | null;
  dataPath?: string | null;
  dataFormat?: string | null;
  dataBind?: boolean | null;
  dataTransform?: string | null;
}

// Animasyon özellikleri
export interface AnimationProps {
  animationType?: 'fade' | 'slide' | 'zoom' | 'bounce' | 'rotate' | null;
  animationDuration?: number | null;
  animationDelay?: number | null;
  animationTiming?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | null;
}

// İnteraktif özellikler
export interface ActionProps {
  onClick?: string | null;
  onHover?: string | null;
  onFocus?: string | null;
  onBlur?: string | null;
  link?: string | null;
}

export interface TypographyProps {
  text: string;
  fontSize?: string | null;
  fontWeight?: 'normal' | 'bold' | 'light' | 'semibold' | 'extrabold' | null;
  color?: string | null;
  textAlign?: 'left' | 'center' | 'right' | 'justify' | null;
  letterSpacing?: string | null;
  lineHeight?: string | number | null;
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline' | null;
  fontFamily?: string | null;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize' | null;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'ellipsis' | null;
}

// Java SDK için componentlerin özellikleri

export interface TextComponent {
  id: ComponentID;
  type: 'Text';
  props: TypographyProps & BaseProps & DataBindingProps & AnimationProps;
  metadata?: ComponentMetadata;
}

export interface ButtonComponent {
  id: ComponentID;
  type: 'Button';
  props: {
    label: string;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    icon?: string | null;
    disabled?: boolean | null;
    loading?: boolean | null;
  } & ActionProps & BaseProps & DataBindingProps & AnimationProps;
  metadata?: ComponentMetadata;
}

export interface ImageComponent {
  id: ComponentID;
  type: 'Image';
  props: {
    src: string;
    alt?: string | null;
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    aspectRatio?: string | null;
    lazy?: boolean | null;
    placeholder?: string | null;
  } & BaseProps & DataBindingProps & AnimationProps & ActionProps;
  metadata?: ComponentMetadata;
}

export interface RowComponent {
  id: ComponentID;
  type: 'Row';
  props: {
    gap?: string;
    justify?: Justify;
    align?: Alignment;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | null;
  } & BaseProps & DataBindingProps;
  children: Component[]; // Children required for Row
  metadata?: ComponentMetadata;
}

export interface ColumnComponent {
  id: ComponentID;
  type: 'Column';
  props: {
    gap?: string;
    align?: Alignment;
    justify?: Justify;
  } & BaseProps & DataBindingProps;
  children: Component[]; // Children required for Column
  metadata?: ComponentMetadata;
}

export interface DividerComponent {
  id: ComponentID;
  type: 'Divider';
  props: {
    thickness?: string;
    color?: string;
    orientation?: 'horizontal' | 'vertical' | null;
    dashed?: boolean | null;
  } & BaseProps & DataBindingProps & AnimationProps;
  metadata?: ComponentMetadata;
}

export interface BoxComponent {
  id: ComponentID;
  type: 'Box';
  props: BaseProps & DataBindingProps & AnimationProps;
  children?: Component[]; // Children optional for Box
  metadata?: ComponentMetadata;
}

export interface IconComponent {
  id: ComponentID;
  type: 'Icon';
  props: {
    name: string;
    size?: string;
    color?: string;
    rotate?: number | null;
    flip?: 'horizontal' | 'vertical' | 'both' | null;
  } & BaseProps & ActionProps & DataBindingProps & AnimationProps;
  metadata?: ComponentMetadata;
}

export interface InputComponent {
  id: ComponentID;
  type: 'Input';
  props: {
    placeholder?: string;
    label?: string;
    inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
    defaultValue?: string | null;
    required?: boolean | null;
    disabled?: boolean | null;
    validation?: string | null;
    errorMessage?: string | null;
  } & BaseProps & DataBindingProps & AnimationProps & ActionProps;
  metadata?: ComponentMetadata;
}

export interface CardComponent {
  id: ComponentID;
  type: 'Card';
  props: {
    hoverable?: boolean | null;
    clickable?: boolean | null;
    headerVisible?: boolean | null;
    footerVisible?: boolean | null;
  } & BaseProps & DataBindingProps & AnimationProps & ActionProps;
  children?: Component[];
  metadata?: ComponentMetadata;
}

export interface SpacerComponent {
  id: ComponentID;
  type: 'Spacer';
  props: {
    height?: string;
    responsive?: boolean | null;
  } & BaseProps & DataBindingProps;
  metadata?: ComponentMetadata;
}

export interface LinkComponent {
  id: ComponentID;
  type: 'Link';
  props: {
    text: string;
    href: string;
    target?: '_blank' | '_self' | '_parent' | '_top' | null;
    download?: boolean | null;
    rel?: string | null;
  } & TypographyProps & BaseProps & DataBindingProps & AnimationProps;
  metadata?: ComponentMetadata;
}

export interface VideoComponent {
  id: ComponentID;
  type: 'Video';
  props: {
    src: string;
    controls?: boolean | null;
    autoplay?: boolean | null;
    muted?: boolean | null;
    loop?: boolean | null;
    poster?: string | null;
    startTime?: number | null;
  } & BaseProps & DataBindingProps & AnimationProps & ActionProps;
  metadata?: ComponentMetadata;
}

// Yeni Componentler

export interface ContainerComponent {
  id: ComponentID;
  type: 'Container';
  props: {
    maxWidth?: string | null;
    centered?: boolean | null;
  } & BaseProps & DataBindingProps & AnimationProps;
  children?: Component[];
  metadata?: ComponentMetadata;
}

export interface GridComponent {
  id: ComponentID;
  type: 'Grid';
  props: {
    columns?: number | string | null;
    rows?: number | string | null;
    gap?: string | null;
    columnGap?: string | null;
    rowGap?: string | null;
    autoFlow?: 'row' | 'column' | 'row dense' | 'column dense' | null;
  } & BaseProps & DataBindingProps;
  children?: Component[];
  metadata?: ComponentMetadata;
}

export interface CheckboxComponent {
  id: ComponentID;
  type: 'Checkbox';
  props: {
    label?: string | null;
    checked?: boolean | null;
    disabled?: boolean | null;
    required?: boolean | null;
    indeterminate?: boolean | null;
  } & BaseProps & DataBindingProps & AnimationProps & ActionProps;
  metadata?: ComponentMetadata;
}

export interface SelectComponent {
  id: ComponentID;
  type: 'Select';
  props: {
    label?: string | null;
    placeholder?: string | null;
    options?: Array<{value: string, label: string}> | null;
    defaultValue?: string | null;
    required?: boolean | null;
    disabled?: boolean | null;
    multiple?: boolean | null;
    searchable?: boolean | null;
  } & BaseProps & DataBindingProps & AnimationProps & ActionProps;
  metadata?: ComponentMetadata;
}

export interface CarouselComponent {
  id: ComponentID;
  type: 'Carousel';
  props: {
    autoplay?: boolean | null;
    interval?: number | null;
    showDots?: boolean | null;
    showArrows?: boolean | null;
    infinite?: boolean | null;
  } & BaseProps & DataBindingProps & AnimationProps;
  children?: Component[];
  metadata?: ComponentMetadata;
}

export interface TableComponent {
  id: ComponentID;
  type: 'Table';
  props: {
    columns?: Array<{key: string, title: string, dataType?: string, width?: string}> | null;
    pagination?: boolean | null;
    bordered?: boolean | null;
    striped?: boolean | null;
    sortable?: boolean | null;
    rowSelection?: boolean | null;
  } & BaseProps & DataBindingProps & AnimationProps & ActionProps;
  metadata?: ComponentMetadata;
}

export interface ProgressBarComponent {
  id: ComponentID;
  type: 'ProgressBar';
  props: {
    value?: number | null;
    max?: number | null;
    showLabel?: boolean | null;
    color?: string | null;
    size?: 'sm' | 'md' | 'lg' | null;
    shape?: 'flat' | 'rounded' | 'pill' | null;
    animated?: boolean | null;
  } & BaseProps & DataBindingProps & AnimationProps;
  metadata?: ComponentMetadata;
}

export type Component =
  | TextComponent
  | ButtonComponent
  | ImageComponent
  | RowComponent
  | ColumnComponent
  | DividerComponent
  | BoxComponent
  | IconComponent
  | InputComponent
  | CardComponent
  | SpacerComponent
  | LinkComponent
  | VideoComponent
  | ContainerComponent
  | GridComponent
  | CheckboxComponent
  | SelectComponent
  | CarouselComponent
  | TableComponent
  | ProgressBarComponent;

export interface DraggableItem {
  id: string;
  type: ComponentType;
  label: string;
  description?: string;
  category: 'layout' | 'basic' | 'form' | 'media' | 'advanced';
}

export interface EditorState {
  selectedComponentId: ComponentID | null;
  components: Component[];
  currentPage?: Page | null;
}

// Java SDK için serileştirme/deserileştirme yardımcısı
export interface ComponentDTO {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentDTO[];
  metadata?: Record<string, any>;
}

// Component tipini kontrol için yardımcı tip koruyucuları
export function isLayoutComponent(type: ComponentType): type is LayoutComponentType {
  return componentCategories.layout.includes(type as string);
}

export function isFormComponent(type: ComponentType): type is FormComponentType {
  return componentCategories.form.includes(type as string);
}

export function isMediaComponent(type: ComponentType): type is MediaComponentType {
  return componentCategories.media.includes(type as string);
}

export function isBasicComponent(type: ComponentType): type is BasicComponentType {
  return componentCategories.basic.includes(type as string);
}

export function isAdvancedComponent(type: ComponentType): type is AdvancedComponentType {
  return componentCategories.advanced.includes(type as string);
}