import { ComponentElementInstance } from "@/types";

export const DTablePropertiesComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  return <div>DTablePropertiesComponent for {elementInstance.type}</div>;
};
