import Dexie, { Table } from 'dexie';

export interface StoredProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
  data: string;
}

export class ClosetDesignerDB extends Dexie {
  projects!: Table<StoredProject, string>;

  constructor() {
    super('closet-designer');
    this.version(1).stores({
      projects: 'id, name, updatedAt',
    });
  }
}

export const db = new ClosetDesignerDB();
