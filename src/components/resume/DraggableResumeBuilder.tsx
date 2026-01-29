'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ReactNode } from 'react';

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="absolute left-0 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          type="button"
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </div>
      <div className="pl-10">{children}</div>
    </div>
  );
}

export interface DraggableResumeSection {
  id: string;
  type: string;
  content: ReactNode;
}

interface DraggableResumeBuilderProps {
  sections: DraggableResumeSection[];
  onSectionsReorder: (sections: DraggableResumeSection[]) => void;
}

export function DraggableResumeBuilder({
  sections,
  onSectionsReorder,
}: DraggableResumeBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((item) => item.id === active.id);
      const newIndex = sections.findIndex((item) => item.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      onSectionsReorder(newSections);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-6">
          {sections.map((section) => (
            <SortableItem key={section.id} id={section.id}>
              {section.content}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
