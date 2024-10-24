import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComponentElementInstance } from "@/types";

import DesignerElementLifeCycleOverlay from "./designer-element-lifecycle-overlay";

const InputDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { attributes } = elementInstance;
  const { id, inputType, label, helperText, placeHolder } = attributes;

  return (
    <DesignerElementLifeCycleOverlay forElement={id}>
      <div>
        <Label htmlFor={id}>{label}</Label>
        <Input
          type={inputType}
          id={id}
          placeholder={placeHolder}
          readOnly={true}
        />
        <p className="text-muted-foreground text-xs">{helperText}</p>
      </div>
    </DesignerElementLifeCycleOverlay>
  );
};

export default InputDesignerComponent;
