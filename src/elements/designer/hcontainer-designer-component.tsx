import { Button } from "@/components/ui/button";
import DesignerElementWrapper from "@/containers/designer-element-wrapper";
import { cn } from "@/lib/utils";
import { ComponentElementInstance } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import { concat } from "lodash";

export const HContainerDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { id, attributes, children } = elementInstance;
  const { hContainerId, height, columns } = attributes;
  const lDiff = parseInt(columns.propertyValue) - children.length;
  const colsArray =
    lDiff > 0 ? concat(children, new Array(lDiff).fill(undefined)) : children;

  const colsClassMapper: Record<string, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };

  return (
    <div
      id={hContainerId.propertyValue}
      className={cn(
        "grid",
        colsClassMapper[columns.propertyValue],
        "gap-2 auto-cols-max grid-flow-col p-2 w-full"
      )}
      style={{ minHeight: `${height.propertyValue}px` }}
    >
      {colsArray.map((v, i) => {
        if (v) {
          return <DesignerElementWrapper key={i} element={v} />;
        } else {
          return <HContainerDroppable key={i} index={i} elementId={id} />;
        }
      })}
    </div>
  );
};

const HContainerDroppable = ({
  index,
  elementId,
}: {
  index: number;
  elementId: string;
}) => {
  const dropRegion = useDroppable({
    id: `hcontainer-droppable-${index}`,
    data: {
      id: elementId,
      index,
      type: "hcontainerDroppable",
      isHContainerDroppable: true,
    },
  });
  return (
    <div
      ref={dropRegion.setNodeRef}
      className={cn(
        "w-full bg-white rounded-md border-gray-500 border border-dashed",
        dropRegion.isOver && "bg-gray-400"
      )}
    >
      {index}
    </div>
  );
};

export const HContainerDragOverlayComponent = () => {
  return <Button>Button</Button>;
};
