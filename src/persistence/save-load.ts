import { db, StoredProject } from './db';
import { serialize, deserialize, SerializedProject, CURRENT_SCHEMA_VERSION } from './serialization';
import { AppState } from '@/store/store';
import { nanoid } from 'nanoid';

export async function saveProject(state: AppState, existingId?: string): Promise<string> {
  const id = existingId ?? nanoid();
  const now = new Date().toISOString();
  const stored: StoredProject = {
    id,
    name: state.projectName,
    createdAt: now,
    updatedAt: now,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    data: serialize(state),
  };

  await db.projects.put(stored);
  return id;
}

export async function loadProject(id: string): Promise<SerializedProject> {
  const stored = await db.projects.get(id);
  if (!stored) throw new Error(`Project "${id}" not found`);
  return deserialize(stored.data);
}

export async function listProjects(): Promise<StoredProject[]> {
  return db.projects.orderBy('updatedAt').reverse().toArray();
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
}
