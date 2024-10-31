import { ComponentElementInstance } from "@/types";

export const HContainerPropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  return <div>HContainerPropertiesComponent for {elementInstance.type}</div>;
};
