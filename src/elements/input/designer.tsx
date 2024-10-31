import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComponentElementInstance } from "@/types";

export const InputDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { attributes } = elementInstance;
  const { inputId, inputType, label, helperText, placeHolder } = attributes;

  return (
    <div className="w-full">
      <Label htmlFor={inputId.propertyValue}>{label.propertyValue}</Label>
      <Input
        type={inputType.propertyValue}
        id={inputId.propertyValue}
        placeholder={placeHolder.propertyValue}
        readOnly={true}
      />
      <p className="text-muted-foreground text-xs">
        {helperText.propertyValue}
      </p>
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
