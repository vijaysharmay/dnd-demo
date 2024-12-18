import useElementStore from "@/store/element-store";

import VersionOptionWrapper from "./version-option-wrapper";

export default function History() {
  const { activeElement } = useElementStore();
  if (activeElement === null)
    return (
      <VersionOptionWrapper title="History">
        <div className="text-center">
          Please click on a block to view its history
        </div>
      </VersionOptionWrapper>
    );

  return (
    <VersionOptionWrapper title="History">
      <></>
    </VersionOptionWrapper>
  );
}
