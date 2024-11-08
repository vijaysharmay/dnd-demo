import { Button } from "@/components/ui/button";
import { ComponentElementInstance } from "@/types";
import { ButtonPropsSchema } from "@/types/properties";

export const ButtonDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { props } = elementInstance;
  const { buttonId, buttonText, buttonVariant, buttonType } =
    props as ButtonPropsSchema;
  return (
    <div className="place-content-center text-center w-full h-fit">
      <Button variant={buttonVariant} id={buttonId} type={buttonType}>
        {buttonText}
      </Button>
    </div>
  );
};

export const ButtonDragOverlayComponent = () => {
  return <Button>Button</Button>;
};
