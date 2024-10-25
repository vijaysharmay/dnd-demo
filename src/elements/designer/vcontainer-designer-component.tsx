import { Button } from "@/components/ui/button";
import { ComponentElementInstance } from "@/types";

export const VContainerDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { attributes } = elementInstance;
  const { vContainerId, width, height, rows } = attributes;
  const emptyRowArray = new Array(parseInt(rows.propertyValue)).fill(0);
  return (
    <div
      id={vContainerId.propertyValue}
      className={`grid grid-columns-${rows.propertyValue} gap-x-2 w-[${width.propertyValue}] h-[${height.propertyValue}]`}
    >
      {emptyRowArray}
    </div>
  );
};

export const VContainerDragOverlayComponent = () => {
  return <Button>Button</Button>;
};
