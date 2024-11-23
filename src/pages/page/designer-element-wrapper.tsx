import { libraryElements } from "@/elements";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import useElementStore from "@/store/element-store";
import { Button, ComponentElementInstance, Input } from "@/types";
import { ButtonPropsSchema, InputPropsSchema } from "@/types/properties";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function DesignerElementWrapper({
  element,
}: {
  element: ComponentElementInstance;
}) {
  const [isHoveredOn, setIsHoveredOn] = useState(false);
  const { toast } = useToast();
  const {
    removeElement,
    setActiveElementId,
    setActiveElement,
    activeElementId,
  } = useElementStore();

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

  const getDesignerElementDeleteId = () =>
    `designerElementDelete-${element.id}`;

  const handleDelete = () => {
    const isButton = element.type === Button;
    const isInput = element.type === Input;
    if (isButton || isInput) {
      const props = isButton
        ? (element.props as ButtonPropsSchema)
        : (element.props as InputPropsSchema);
      if (props.isFormElement) {
        toast({
          variant: "destructive",
          title: "Operation Not Permitted",
          description: "You cannot delete a data-driven form element",
          duration: 2000,
        });
        return;
      }
    }
    removeElement(element.id, element.parentId);
    setActiveElement(null);
    setActiveElementId(null);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();

        if (
          (e.target as HTMLDivElement).getAttribute("data-id") !==
          getDesignerElementDeleteId()
        ) {
          setActiveElement(element);
          setActiveElementId(element.id);
        }
      }}
      onMouseEnter={() => setIsHoveredOn(true)}
      onMouseLeave={() => setIsHoveredOn(false)}
      className={cn(
        "relative flex flex-col text-foreground hover:cursor-pointer rounded-md my-2",
        activeElementId === element.id && "border-gray-200 border"
      )}
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
          {/* <div className="absolute -right-5 -top-6 justify-center p-1 z-10">
            <EditIcon className="w-4 h-4" onClick={handleEdit} />
          </div> */}
          <div className="absolute right-0 justify-center p-1 z-10">
            <Trash2Icon
              data-id={getDesignerElementDeleteId()}
              className="w-4 h-4"
              onClick={handleDelete}
            />
          </div>
        </>
      )}
      <div
        ref={designerDraggable.setNodeRef}
        {...designerDraggable.listeners}
        {...designerDraggable.attributes}
        className={cn(
          "cursor-grab flex p-2 rounded-md",
          isHoveredOn && "border-gray-400 border opacity-80"
        )}
      >
        <DesignerComponent elementInstance={element} />
      </div>
    </div>
  );
}
