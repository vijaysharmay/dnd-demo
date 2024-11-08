import { Button } from "@/components/ui/button";
import DesignerElementWrapper from "@/containers/designer-element-wrapper";
import { ComponentElementInstance } from "@/types";
import { FormPropsSchema } from "@/types/properties";

export const FormDesignerComponent: React.FC<{
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
      <div className="grid grid-cols-6 gap-x-4 py-2">
        <div className="col-span-2"></div>
        <Button variant="secondary">Reset</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
};

export const FormDragOverlayComponent = () => {
  return <div>Form</div>;
};