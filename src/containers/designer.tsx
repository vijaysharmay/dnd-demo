import { libraryElements } from "@/elements";
import { cn } from "@/lib/utils";
import useElementStore from "@/store";
import { ComponentElementInstance, ComponentElementType } from "@/types";
import { DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";

export default function Designer() {
  const { elements, addElement } = useElementStore();
  const droppable = useDroppable({
    id: "designer",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isLibraryListItem = active.data?.current?.isLibraryListItem;

      if (isLibraryListItem) {
        const elementType = active.data?.current?.type;
        const newElement = libraryElements[
          elementType as ComponentElementType
        ].create(uuidv4());
        addElement(0, newElement);
      }
    },
  });

  return (
    <>
      <div className="bg-gray-100 p-4 h-screen">
        <div className="bg-white shadow-md h-full w-full flex">
          <div
            ref={droppable.setNodeRef}
            className={cn(
              "p-4 gap-4 h-full flex-col flex-grow flex-1 m-auto overflow-y-auto justify-start",
              droppable.isOver && "ring-2 ring-primary/20"
            )}
          >
            {droppable.isOver && (
              <div className="p-4 w-full">
                <div className="rounded-md bg-primary/20 h-[60px]"></div>
              </div>
            )}

            {elements.length > 0 &&
              elements.map((element: ComponentElementInstance) => {
                return (
                  <DesignerElementWrapper key={element.id} element={element} />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

function DesignerElementWrapper({
  element,
}: {
  element: ComponentElementInstance;
}) {
  const DesignerComponent = libraryElements[element.type].designerComponent;
  return (
    <div className="py-2">
      <DesignerComponent elementInstance={element} />
    </div>
  );
}
