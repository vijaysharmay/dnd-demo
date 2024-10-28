import { libraryElements } from "@/elements";
import { cn } from "@/lib/utils";
import useElementStore from "@/store";
import { ComponentElementInstance, ComponentElementType } from "@/types";
import { DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";

import DesignerElementWrapper from "./designer-element-wrapper";

export default function Designer() {
  const {
    elements,
    addElement,
    addElementToParent,
    getElementIndexById,
    moveElementV,
    setActiveElement,
    setActiveElementId,
  } = useElementStore();
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
      const isDesignerElementDraggable =
        active.data?.current?.isDesignerElementDraggable;
      const hoveredElementId = over.data?.current?.id as string;
      const hoveredElementIndex = getElementIndexById(hoveredElementId);
      const isHContainerDroppable = over.data?.current?.isHContainerDroppable;

      if (isLibraryListItem && hoveredElementIndex !== undefined) {
        const elementType = active.data?.current?.type;
        const isTop = over.data?.current?.isTopHalfDroppable;
        const isBottom = over.data?.current?.isBottomHalfDroppable;
        const newElement = libraryElements[
          elementType as ComponentElementType
        ].create(uuidv4());

        if (hoveredElementIndex > -1 && (isTop || isBottom)) {
          if (isTop) {
            addElement(hoveredElementIndex, newElement);
          }

          if (isBottom) {
            addElement(hoveredElementIndex + 1, newElement);
          }
        } else {
          if (isHContainerDroppable) {
            const hContainerId = over.data?.current?.id;
            const index = over.data?.current?.index;
            addElementToParent(hContainerId, index, newElement);
          } else {
            addElement(0, newElement);
          }
        }

        setActiveElement(newElement);
        setActiveElementId(newElement.id);
      }

      if (isDesignerElementDraggable && hoveredElementIndex !== undefined) {
        const movedElementId = active.data?.current?.elementId;
        const fromIndex = getElementIndexById(movedElementId);
        const isTop = over.data?.current?.isTopHalfDroppable;
        const isBottom = over.data?.current?.isBottomHalfDroppable;

        // YUCK *vomits all over the place* !!!
        // if (fromIndex !== undefined) {
        //   if (fromIndex !== hoveredElementIndex) {
        //     if (isTop) {
        //       if (fromIndex !== hoveredElementIndex - 1) {
        //         moveElementV(movedElementId, fromIndex, hoveredElementIndex);
        //       }
        //     }

        //     if (isBottom) {
        //       if (fromIndex !== hoveredElementIndex + 1) {
        //         moveElementV(movedElementId, fromIndex, hoveredElementIndex);
        //       }
        //     }
        //   }
        // }
        if (fromIndex !== hoveredElementIndex) {
          const targetIndex = isTop
            ? hoveredElementIndex - 1
            : isBottom
            ? hoveredElementIndex + 1
            : hoveredElementIndex;

          if (fromIndex !== targetIndex) {
            moveElementV(
              movedElementId,
              fromIndex as number,
              hoveredElementIndex
            );
          }
        }
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
              "p-4 gap-4 h-full flex-col flex-1 m-auto overflow-y-auto justify-start gap-y-12",
              droppable.isOver && "ring-2 ring-primary/20"
            )}
          >
            {droppable.isOver && elements.length === 0 && (
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
