import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DesignerElementWrapper from "@/pages/version/designer-element-wrapper";
import { ComponentElementInstance } from "@/types";
import { colsIntRec, HContainerPropsSchema } from "@/types/properties";
import { useDroppable } from "@dnd-kit/core";
import { concat } from "lodash";

export const HContainerDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { id, props, children } = elementInstance;
  const { hContainerId, hContainerHeightInPx, hContainerColumns } =
    props as HContainerPropsSchema;

  const colsClassMapper: Record<string, string> = {
    One: "grid-cols-1",
    Two: "grid-cols-2",
    Three: "grid-cols-3",
    Four: "grid-cols-4",
  };
  const lDiff = colsIntRec[hContainerColumns] - children.length;
  const colsArray =
    lDiff > 0 ? concat(children, new Array(lDiff).fill(undefined)) : children;

  return (
    <div
      id={hContainerId}
      className={cn(
        "grid",
        colsClassMapper[hContainerColumns],
        "gap-2 auto-cols-max grid-flow-col p-2 w-full"
      )}
      style={{ minHeight: `${hContainerHeightInPx}` }}
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
    ></div>
  );
};

export const HContainerDragOverlayComponent = () => {
  return <Button>Button</Button>;
};
