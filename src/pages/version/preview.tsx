import { libraryElements } from "@/elements";
import { buildPreviewBlockHierarchy, previewBlockToElement } from "@/lib/utils";
import { ComponentElementInstance } from "@/types";
import { isNull } from "lodash";
import { PreviewBlock } from "../app/published-apps";

export default function Preview() {
  const previewElements = sessionStorage.getItem("previewElements");
  if (isNull(previewElements)) return;
  const blocks = JSON.parse(previewElements) as PreviewBlock[];
  return (
    <>
      {buildPreviewBlockHierarchy(blocks).map((block: PreviewBlock) => {
        const element: ComponentElementInstance = previewBlockToElement(block);
        const RenderComponent = libraryElements[element.type].renderComponent;
        return <RenderComponent key={element.id} elementInstance={element} />;
      })}
    </>
  );
}
