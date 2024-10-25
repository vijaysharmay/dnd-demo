import { Button } from "@/components/ui/button";
import { ComponentElementInstance } from "@/types";

export const HContainerDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { attributes } = elementInstance;
  const { hContainerId, width, height, columns } = attributes;
  return (
    <div
      id={hContainerId.propertyValue}
      className={`grid grid-columns-${columns.propertyValue} gap-x-2 w-[${width.propertyValue}] h-[${height.propertyValue}]`}
    >
      as
    </div>
  );
};

export const HContainerDragOverlayComponent = () => {
  return <Button>Button</Button>;
};
