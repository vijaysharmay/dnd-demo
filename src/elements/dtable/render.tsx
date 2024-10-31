import { ComponentElementInstance } from "@/types";

export const DTableRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  return <div>DTableRenderComponent for {elementInstance.type}</div>;
};
