import { libraryElements } from "@/elements";
import { cn } from "@/lib/utils";
import useElementStore from "@/store";
import { ComponentElementInstance } from "@/types";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function DesignerElementWrapper({
  element,
}: {
  element: ComponentElementInstance;
}) {
  const [isHoveredOn, setIsHoveredOn] = useState(false);
  const { removeElement, setActiveElement } = useElementStore();

  const topDroppable = useDroppable({
    id: `${element.id}-top`,
    data: {
      id: element.id,
      type: element.type,
      elementId: element.id,
      isTopHalfDroppable: true,
    },
  });

  const bottomDroppable = useDroppable({
    id: `${element.id}-bottom`,
    data: {
      id: element.id,
      type: element.type,
      elementId: element.id,
      isBottomHalfDroppable: true,
    },
  });

  const designerDraggable = useDraggable({
    id: `${element.id}-draggable`,
    data: {
      id: element.id,
      type: element.type,
      elementId: element.id,
      isDesignerElementDraggable: true,
    },
  });

  const DesignerComponent = libraryElements[element.type].designerComponent;

  const handleDelete = () => {
    removeElement(element.id);
  };

  const handleEdit = () => {
    setActiveElement(element.id);
  };

  return (
    <div
      onMouseEnter={() => setIsHoveredOn(true)}
      onMouseLeave={() => setIsHoveredOn(false)}
      className="relative flex flex-col text-foreground hover:cursor-pointer rounded-md"
    >
      <div
        ref={topDroppable.setNodeRef}
        className={cn(
          "absolute w-full h-[30px] rounded-t-md",
          topDroppable.isOver && "border-t-4 border-black"
        )}
      ></div>
      <div
        ref={bottomDroppable.setNodeRef}
        className={cn(
          "absolute w-full h-[30px] rounded-b-md bottom-0",
          bottomDroppable.isOver && "border-b-4 border-black"
        )}
      ></div>
      {isHoveredOn && (
        <>
          <div className="absolute right-6 justify-center p-1 z-10">
            <EditIcon onClick={handleEdit} />
          </div>
          <div className="absolute right-0 justify-center p-1 z-10">
            <Trash2Icon onClick={handleDelete} />
          </div>
        </>
      )}
      <div
        ref={designerDraggable.setNodeRef}
        {...designerDraggable.listeners}
        {...designerDraggable.attributes}
        className={cn(
          "cursor-grab flex p-2 rounded-md",
          isHoveredOn && "bg-gray-300 opacity-80"
        )}
      >
        <DesignerComponent elementInstance={element} />
      </div>
    </div>
  );
}
