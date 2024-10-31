import { ComponentElementInstance } from "@/types";

export const HContainerRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  return <div>HContainerRenderComponent for {elementInstance.type}</div>;
};
