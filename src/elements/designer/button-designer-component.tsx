import { Button } from "@/components/ui/button";
import { ComponentElementInstance } from "@/types";
import { MouseEventHandler } from "react";

export const ButtonDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { attributes, events } = elementInstance;
  const { buttonId, buttonText } = attributes;
  const { onClickHandler } = events;
  return (
    <div className="place-content-center text-center w-full">
      <Button
        id={buttonId.propertyValue}
        onClick={onClickHandler as MouseEventHandler<HTMLButtonElement>}
      >
        {buttonText.propertyValue}
      </Button>
    </div>
  );
};

export const ButtonDragOverlayComponent = () => {
  return <Button>Button</Button>;
};
