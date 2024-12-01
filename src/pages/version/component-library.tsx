import { Button } from "@/components/ui/button";
import { LibraryElementsRegister } from "@/elements";
import { cn } from "@/lib/utils";
import { ComponentElement, ComponentElementType } from "@/types";
import { useDraggable } from "@dnd-kit/core";

export function ComponentLibrary() {
  const elementKeys = Object.keys(LibraryElementsRegister);
  const elements: ComponentElement[] = elementKeys
    .map((key: string) => LibraryElementsRegister[key as ComponentElementType])
    .filter((element) => element.showInDesignerPanel);
  return (
    <div className="py-2 pl-2 flex flex-wrap gap-2">
      <div className="text-center w-full font-semibold text-muted-foreground">
        Library
      </div>
      <div className="flex flex-col gap-2 w-full">
        {elements.map((element: ComponentElement, index: number) => (
          <LibraryListDraggableItem key={index} element={element} />
        ))}
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
      variant="secondary"
      className={cn(
        "flex-row cursor-grab",
        draggable.isDragging && "ring-2 ring-slate-200"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <div>{icon}</div>
      {label}
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
