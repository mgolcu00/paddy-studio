import { Component, ComponentID } from '@/types';

export interface ComponentLocation {
  component: Component | null;
  parentContainer: Component[] | null; // The array containing the component
  index: number;                       // Index within the parentContainer
}

/**
 * Finds a component by its ID within a nested structure and returns
 * the component itself, its parent array, and its index within that array.
 */
export function findComponentLocation(components: Component[], id: ComponentID): ComponentLocation {
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    if (component.id === id) {
      return { component, parentContainer: components, index: i };
    }
    if ('children' in component && Array.isArray(component.children)) {
      const found = findComponentLocation(component.children, id);
      // Important: Return the correct parent container (component.children)
      // if the component is found within those children.
      if (found.component) {
        // If the found component's direct parent is the one we just checked, return that parent
        if (found.parentContainer === component.children) {
             return found;
        }
        // Otherwise, it was found deeper, keep bubbling up, but the parent is component.children
        return { ...found, parentContainer: component.children };
      }
    }
  }
  return { component: null, parentContainer: null, index: -1 };
}


/**
 * Removes a component by its ID from a nested structure.
 * Returns a new array with the component removed. (Immutability helper)
 */
export function removeComponentById(components: Component[], id: ComponentID): Component[] {
    return components.reduce((acc, component) => {
        if (component.id === id) {
            return acc; // Skip the component with the matching ID
        }

        if ('children' in component && Array.isArray(component.children)) {
            const newChildren = removeComponentById(component.children, id);
            // Only create a new component object if children actually changed
            if (newChildren !== component.children) {
                acc.push({ ...component, children: newChildren });
                return acc;
            }
        }
        // If not removed and children didn't change (or no children), push original
        acc.push(component);
        return acc;
    }, [] as Component[]);
}


/**
 * Inserts a component into a nested structure at a specific target location.
 * Target can be the root ('canvas-root') or the children array of a specific parent component.
 * Returns a new component array structure. (Immutability helper)
 */
export function insertComponent(
  components: Component[],
  componentToInsert: Component,
  targetParentId: ComponentID | 'canvas-root',
  targetIndex: number
): Component[] {
  if (targetParentId === 'canvas-root') {
    const newComponents = [...components];
    // Clamp index to valid range for root insertion
    const safeIndex = Math.max(0, Math.min(targetIndex, newComponents.length));
    newComponents.splice(safeIndex, 0, componentToInsert);
    return newComponents;
  } else {
    // Use map to create new component objects when changes occur
    return components.map(component => {
      // If this component is the target parent
      if (component.id === targetParentId) {
        // Ensure it's a container and has children array
        if ('children' in component && Array.isArray(component.children)) {
          const newChildren = [...component.children];
          // Clamp index to valid range for children insertion
          const safeIndex = Math.max(0, Math.min(targetIndex, newChildren.length));
          newChildren.splice(safeIndex, 0, componentToInsert);
          // Return a new component object with the new children array
          return { ...component, children: newChildren };
        } else {
           // If the target ID matches but it cannot have children, return unchanged
           console.warn(`Attempted to insert into non-container component or component without children array: ${targetParentId}`);
           return component; // Return original component
        }
      }
      // If this component is not the target, check its children recursively
      if ('children' in component && Array.isArray(component.children)) {
        const newChildren = insertComponent(component.children, componentToInsert, targetParentId, targetIndex);
        // If the recursive call changed the children, return a new component object
        if (newChildren !== component.children) {
            return { ...component, children: newChildren };
        }
      }
      // If not the target and no children (or children unchanged), return original component
      return component;
    });
  }
}

/**
 * Finds the parent Component object of a given child component ID.
 * Returns null if the component is at the root or not found.
 */
export function findParentComponent(components: Component[], childId: ComponentID): Component | null {
    for (const component of components) {
        if ('children' in component && Array.isArray(component.children)) {
            if (component.children.some(child => child.id === childId)) {
                return component; // Found the parent
            }
            // Recurse into children
            const foundParent = findParentComponent(component.children, childId);
            if (foundParent) {
                return foundParent; // Parent found in nested structure
            }
        }
    }
    return null; // Not found or at root
}


/**
 * Checks if a component type is considered a layout container.
 */
export function isLayoutComponent(type: string): boolean {
    return ['Row', 'Column', 'Box', 'Card'].includes(type);
} 