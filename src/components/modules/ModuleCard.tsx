import { useDraggable } from '@dnd-kit/core';
import { ModuleDefinition } from '@/domain/catalog/types';
import styles from './ModuleCard.module.css';

const ICONS: Record<string, string> = {
  shirt: '\u{1F455}',
  layers: '\u{1F4DA}',
  archive: '\u{1F4E6}',
  grid: '\u{1F4CB}',
  footprints: '\u{1F45F}',
};

interface ModuleCardProps {
  definition: ModuleDefinition;
  onClick: () => void;
}

export function ModuleCard({ definition, onClick }: ModuleCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library:${definition.id}`,
    data: { type: 'library-card', definition },
  });

  return (
    <button
      ref={setNodeRef}
      className={styles.card}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={onClick}
      title={definition.description}
      {...attributes}
      {...listeners}
    >
      <span className={styles.icon}>{ICONS[definition.icon] ?? '?'}</span>
      <span className={styles.label}>{definition.label}</span>
    </button>
  );
}
