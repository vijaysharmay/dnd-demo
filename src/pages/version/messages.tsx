import useElementStore from "@/store/element-store";

import VersionOptionWrapper from "./version-option-wrapper";

export default function Messages() {
  const { activeElement } = useElementStore();
  if (activeElement === null)
    return (
      <VersionOptionWrapper title="Messages">
        <div className="text-center">
          Please click on a block to view its messages
        </div>
      </VersionOptionWrapper>
    );

  return (
    <VersionOptionWrapper title="Messages">
      <></>
    </VersionOptionWrapper>
  );
}
