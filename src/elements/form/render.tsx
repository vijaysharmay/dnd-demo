import { Button } from "@/components/ui/button";
import DesignerElementWrapper from "@/containers/designer-element-wrapper";
import { ComponentElementInstance } from "@/types";
import { FormPropsSchema } from "@/types/properties";

export const FormRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { props, children } = elementInstance;
  const { formHeightInPx } = props as FormPropsSchema;
  return (
    <div className="w-full" style={{ minHeight: formHeightInPx }}>
      {children.length > 0 &&
        children.map(
          (element) =>
            element && (
              <DesignerElementWrapper key={element.id} element={element} />
            )
        )}
      <div className="grid grid-cols-4 gap-x-4 py-2">
        <div className="col-span-1"></div>
        <Button>Reset</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
};
