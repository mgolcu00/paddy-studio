import { 
  Component, 
  ComponentType, 
  ComponentDTO, 
  componentCategories, 
  ComponentMetadata, 
  Page
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Java SDK için component yapısını serileştirme işlemi
 * @param component Component objesi
 * @returns JSON serileştirilebilir ComponentDTO objesi
 */
export function componentToDTO(component: Component): ComponentDTO {
  const baseDTO: ComponentDTO = {
    id: component.id,
    type: component.type,
    props: { ...component.props },
    metadata: component.metadata || undefined
  };

  // Children varsa onları da serileştir
  if ('children' in component && Array.isArray(component.children)) {
    baseDTO.children = component.children.map(child => componentToDTO(child));
  }

  return baseDTO;
}

/**
 * Java SDK'dan gelen JSON verisini Component objesine dönüştürme
 * @param dto JSON verisi (ComponentDTO)
 * @returns Component objesi
 */
export function dtoToComponent(dto: ComponentDTO): Component {
  // Tip güvenliği için temel component yapısı oluştur
  const baseComponent: any = {
    id: dto.id || uuidv4(),
    type: dto.type as ComponentType,
    props: { ...dto.props }
  };

  // Metadata varsa ekle
  if (dto.metadata) {
    baseComponent.metadata = dto.metadata;
  }

  // Children varsa onları da dönüştür
  if (dto.children && Array.isArray(dto.children)) {
    baseComponent.children = dto.children.map(child => dtoToComponent(child));
  }

  return baseComponent as Component;
}

/**
 * Sayfa verilerini Java SDK için hazırlama
 * @param page Sayfa objesi
 * @returns SDK için hazırlanmış sayfa verisi
 */
export function pageToSDKFormat(page: Page) {
  return {
    id: page.id,
    name: page.name,
    status: page.status,
    projectId: page.projectId,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
    components: page.components.map(component => componentToDTO(component))
  };
}

/**
 * Component kategorilerini ve metadata bilgilerini Java SDK için hazırlama
 * @returns SDK için component metadata yapısı
 */
export function getComponentMetadataForSDK() {
  const result: Record<string, any> = {};
  
  // Her kategori için componentleri ekle
  Object.entries(componentCategories).forEach(([category, types]) => {
    result[category] = types.map(type => ({
      type,
      category
    }));
  });
  
  return result;
}

/**
 * Java SDK için props şemasını oluşturma
 * @param componentType Component tipi
 * @returns Props şeması
 */
export function getPropsSchemaForSDK(componentType: ComponentType) {
  // Her component tipi için props şeması
  const commonProps = [
    { name: 'width', type: 'string|number|null', required: false },
    { name: 'height', type: 'string|number|null', required: false },
    { name: 'padding', type: 'string|null', required: false },
    { name: 'margin', type: 'string|null', required: false },
    { name: 'backgroundColor', type: 'string|null', required: false },
    { name: 'borderRadius', type: 'string|null', required: false },
    { name: 'border', type: 'string|null', required: false },
    { name: 'borderColor', type: 'string|null', required: false },
    { name: 'boxShadow', type: 'string|null', required: false },
    { name: 'opacity', type: 'number|null', required: false },
    { name: 'visible', type: 'boolean', required: false },
    { name: 'zIndex', type: 'number|null', required: false },
  ];

  const dataBindingProps = [
    { name: 'dataSource', type: 'string|null', required: false },
    { name: 'dataPath', type: 'string|null', required: false },
    { name: 'dataFormat', type: 'string|null', required: false },
    { name: 'dataBind', type: 'boolean|null', required: false },
    { name: 'dataTransform', type: 'string|null', required: false },
  ];

  // Component tipine göre özel propları döndür
  switch (componentType) {
    case 'Text':
      return [
        ...commonProps,
        ...dataBindingProps,
        { name: 'text', type: 'string', required: true },
        { name: 'fontSize', type: 'string|null', required: false },
        { name: 'fontWeight', type: 'string|null', required: false },
        { name: 'color', type: 'string|null', required: false },
        { name: 'textAlign', type: 'string|null', required: false },
      ];
    
    case 'Button':
      return [
        ...commonProps,
        ...dataBindingProps,
        { name: 'label', type: 'string', required: true },
        { name: 'variant', type: 'string', required: false },
        { name: 'size', type: 'string', required: false },
        { name: 'disabled', type: 'boolean', required: false },
        { name: 'onClick', type: 'string|null', required: false },
      ];
    
    // Diğer componentler için de benzer şekilde...
    default:
      return commonProps;
  }
}

/**
 * Java SDK için bir component ağacını dolaşarak işlem yapma
 * @param components Component listesi
 * @param callback Her component için çalıştırılacak fonksiyon
 */
export function traverseComponents(
  components: Component[], 
  callback: (component: Component, parent: Component | null) => void,
  parent: Component | null = null
) {
  components.forEach(component => {
    // Component için callback'i çalıştır
    callback(component, parent);
    
    // Eğer childları varsa onları da dolaş
    if ('children' in component && Array.isArray(component.children)) {
      traverseComponents(component.children, callback, component);
    }
  });
}

/**
 * Bir component'in veri bağlamalarını bulma
 * @param component Component objesi
 * @returns Veri bağlamaları
 */
export function findDataBindings(component: Component) {
  const bindings: { prop: string, source: string, path: string }[] = [];
  
  // Props içindeki tüm özellikleri kontrol et
  Object.entries(component.props).forEach(([key, value]) => {
    if (value && typeof value === 'object' && 'dataBind' in value && value.dataBind) {
      bindings.push({
        prop: key,
        source: value.dataSource || '',
        path: value.dataPath || ''
      });
    }
  });
  
  return bindings;
}

/**
 * Java SDK için component ağacını optimize etme
 * @param components Component listesi
 * @returns Optimize edilmiş component listesi
 */
export function optimizeForSDK(components: Component[]): Component[] {
  return components.map(component => {
    // Gereksiz props'ları temizle
    const optimizedProps = { ...component.props };
    
    Object.keys(optimizedProps).forEach(key => {
      const value = optimizedProps[key];
      // Null ve undefined değerleri temizle
      if (value === null || value === undefined) {
        delete optimizedProps[key];
      }
      // Boş stil objelerini temizle
      if (key === 'style' && typeof value === 'object' && Object.keys(value).length === 0) {
        delete optimizedProps[key];
      }
    });
    
    // Optimize edilmiş component'i oluştur
    const optimizedComponent: any = {
      ...component,
      props: optimizedProps
    };
    
    // Eğer children varsa, onları da optimize et
    if ('children' in component && Array.isArray(component.children)) {
      optimizedComponent.children = optimizeForSDK(component.children);
    }
    
    return optimizedComponent as Component;
  });
} 