import { libraryElements } from "@/elements";
import useElementStore from "@/store/element-store";
import { ComponentElementInstance } from "@/types";

import VersionOptionWrapper from "./version-option-wrapper";

export default function Properties() {
  const { activeElement } = useElementStore();
  if (activeElement === null)
    return (
      <VersionOptionWrapper title="Properties">
        <div className="text-center">
          Please click on a block to view its properties
        </div>
      </VersionOptionWrapper>
    );
  const { type } = activeElement as ComponentElementInstance;
  const PropertiesComponent = libraryElements[type].propertiesComponent;

  return (
    <VersionOptionWrapper title="Properties">
      {activeElement && <PropertiesComponent elementInstance={activeElement} />}
    </VersionOptionWrapper>
  );
}
