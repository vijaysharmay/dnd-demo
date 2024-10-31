import { ComponentElementInstance } from "@/types";

export const ButtonRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  return <div>ButtonRenderComponent for {elementInstance.type}</div>;
};
