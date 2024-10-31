import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComponentElementInstance } from "@/types";
import { InputPropsSchema } from "@/types/properties";

export const InputRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { props } = elementInstance;
  const { inputId, inputType, inputLabel, helperText, placeHolder } =
    props as InputPropsSchema;

  return (
    <div className="w-full">
      <Label htmlFor={inputId}>{inputLabel}</Label>
      <Input type={inputType} id={inputId} placeholder={placeHolder} />
      <p className="text-muted-foreground text-xs">{helperText}</p>
    </div>
  );
};
