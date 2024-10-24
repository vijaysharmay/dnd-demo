import { Button } from "@/components/ui/button";
import { ComponentElementInstance } from "@/types";
import { MouseEventHandler } from "react";

import DesignerElementLifeCycleOverlay from "./designer-element-lifecycle-overlay";

export const ButtonDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { id, attributes, events } = elementInstance;
  const { buttonId, buttonText } = attributes;
  const { onClickHandler } = events;
  return (
    <DesignerElementLifeCycleOverlay forElement={id}>
      <div>
        <Button
          id={buttonId.propertyValue}
          onClick={onClickHandler as MouseEventHandler<HTMLButtonElement>}
        >
          {buttonText.propertyValue}
        </Button>
      </div>
    </DesignerElementLifeCycleOverlay>
  );
};

export const ButtonDragOverlayComponent = () => {
  return <Button>Button</Button>;
};
