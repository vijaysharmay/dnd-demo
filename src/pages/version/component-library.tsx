import { Button } from "@/components/ui/button";
import { libraryElements } from "@/elements";
import { cn } from "@/lib/utils";
import { ComponentElement, ComponentElementType } from "@/types";
import { useDraggable } from "@dnd-kit/core";

export function ComponentLibrary() {
  const elementKeys = Object.keys(libraryElements);
  return (
    <div className="p-2 flex flex-wrap gap-2">
      <div className="text-center w-full font-semibold text-muted-foreground">
        Library
      </div>
      <div className="flex flex-col gap-2 w-full">
        {elementKeys.map((key: string) => {
          return (
            <LibraryListDraggableItem
              key={key}
              element={libraryElements[key as ComponentElementType]}
            />
          );
        })}
      </div>
    </div>
  );
}

function LibraryListDraggableItem({ element }: { element: ComponentElement }) {
  const { componentLibraryListItem, type } = element;
  const { label, icon } = componentLibraryListItem;
  const draggable = useDraggable({
    id: `libraryListDraggableItem-${type}`,
    data: {
      type,
      isLibraryListItem: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant="default"
      className={cn(
        "flex-row cursor-grab opacity-90 drop-shadow-lg",
        draggable.isDragging && "ring-2 ring-slate-200"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <div>{icon}</div>
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export function LibraryListDragOverlay({
  element,
}: {
  element: ComponentElement;
}) {
  const DragOverLayComponent = element.dragOverlayComponent;
  return <DragOverLayComponent />;
}
