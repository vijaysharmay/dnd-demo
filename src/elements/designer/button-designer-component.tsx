import { Button } from "@/components/ui/button";
import { ComponentElementInstance } from "@/types";
import { MouseEventHandler } from "react";

import DesignerElementLifeCycleOverlay from "./designer-element-lifecycle-overlay";

const ButtonDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { attributes, events } = elementInstance;
  const { id, buttonText } = attributes;
  const { onClickHandler } = events;
  return (
    <DesignerElementLifeCycleOverlay forElement={id}>
      <div>
        <Button
          id={id}
          onClick={onClickHandler as MouseEventHandler<HTMLButtonElement>}
        >
          {buttonText}
        </Button>
      </div>
    </DesignerElementLifeCycleOverlay>
  );
};

export default ButtonDesignerComponent;
