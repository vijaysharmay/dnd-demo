import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComponentElementInstance } from "@/types";
import { InputPropsSchema } from "@/types/properties";

export const InputDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { props } = elementInstance;
  const { inputId, inputType, inputLabel, helperText, placeHolder } =
    props as InputPropsSchema;

  return (
    <div className="w-full text-muted-foreground">
      <Label htmlFor={inputId}>{inputLabel}</Label>
      <Input
        type={inputType}
        id={inputId}
        placeholder={placeHolder}
        readOnly={true}
      />
      <p className=" text-xs">{helperText}</p>
    </div>
  );
};

export const InputDragOverlayComponent = () => {
  return (
    <div className="bg-gray-50 text-black p-4 w-full">
      <Label>Label</Label>
      <Input type="text" placeholder="Placeholder" readOnly={true} />
      <p className="text-muted-foreground text-xs"></p>
    </div>
  );
};
