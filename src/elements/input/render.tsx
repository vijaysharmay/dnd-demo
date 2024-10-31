import { ComponentElementInstance } from "@/types";

export const InputRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  return <div>InputRenderComponent for {elementInstance.type}</div>;
};
