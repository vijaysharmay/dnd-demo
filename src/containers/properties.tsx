import { libraryElements } from "@/elements";
import useElementStore from "@/store/element-store";
import { ComponentElementInstance } from "@/types";

export default function Properties() {
  const { activeElement } = useElementStore();
  if (activeElement === null) return;
  const { type } = activeElement as ComponentElementInstance;
  const PropertiesComponent = libraryElements[type].propertiesComponent;

  return (
    <>
      {activeElement && <PropertiesComponent elementInstance={activeElement} />}
    </>
  );
}
