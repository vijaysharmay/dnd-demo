import { ComponentElementInstance } from "@/types";

export const InputPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  return <div>InputPropertiesComponent for {elementInstance.type}</div>;
};
