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
      <div className="grid xs:grid-cols-1 lg:grid-cols-2 grow gap-2">
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
      variant={"outline"}
      className={cn(
        "flex-col cursor-grab text-md h-full",
        draggable.isDragging && "ring-2 ring-primary"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <div>{icon}</div>
      <p className="sm:text-xs">{label}</p>
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
