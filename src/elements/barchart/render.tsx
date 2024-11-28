import { Button } from "@/components/ui/button";
import { ComponentElementInstance } from "@/types";
import { ButtonPropsSchema } from "@/types/properties";
import { EventMapper } from "../common/event-mapper";

export const ButtonRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { props } = elementInstance;
  const { buttonId, buttonText, buttonVariant, onClickHandler } =
    props as ButtonPropsSchema;
  return (
    <div className="place-content-center text-center w-full h-fit">
      <Button
        variant={buttonVariant}
        id={buttonId}
        onClick={EventMapper[onClickHandler]}
      >
        {buttonText}
      </Button>
    </div>
  );
};
