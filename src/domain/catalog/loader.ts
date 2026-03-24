import { ModuleDefinition } from './types';
import catalogData from '../../../catalog/modules.json';

const VALID_TYPES = ['single-hang', 'double-hang', 'drawer-stack', 'shelf-tower', 'shoe-section'];

export function loadCatalog(): ModuleDefinition[] {
  return validateCatalog(catalogData as ModuleDefinition[]);
}

export function validateCatalog(data: unknown): ModuleDefinition[] {
  if (!Array.isArray(data)) {
    throw new Error('Catalog must be an array');
  }

  return data.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Catalog item ${index} is not an object`);
    }

    const def = item as Record<string, unknown>;

    if (typeof def.id !== 'string' || !def.id) {
      throw new Error(`Catalog item ${index} missing id`);
    }
    if (typeof def.type !== 'string' || !VALID_TYPES.includes(def.type)) {
      throw new Error(`Catalog item "${def.id}" has invalid type "${def.type}"`);
    }
    if (typeof def.label !== 'string') {
      throw new Error(`Catalog item "${def.id}" missing label`);
    }
    if (typeof def.minWidth !== 'number' || typeof def.maxWidth !== 'number') {
      throw new Error(`Catalog item "${def.id}" missing width constraints`);
    }
    if (def.minWidth > def.maxWidth) {
      throw new Error(`Catalog item "${def.id}": minWidth > maxWidth`);
    }
    if (!Array.isArray(def.components)) {
      throw new Error(`Catalog item "${def.id}" missing components array`);
    }

    return item as ModuleDefinition;
  });
}
