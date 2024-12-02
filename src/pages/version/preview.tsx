import { LibraryElementsRegister } from "@/elements";
import { PreviewBlockToElement } from "@/lib/utils";
import { ComponentElementInstance } from "@/types";
import { BlockSchema } from "@/types/api/page";
import { isNull } from "lodash";
import { useEffect, useState } from "react";

export default function Preview() {
  const [elements, setElements] = useState<ComponentElementInstance[]>([]);
  useEffect(() => {
    const previewElements = sessionStorage.getItem("previewElements");
    if (isNull(previewElements)) return;
    const blocks = JSON.parse(previewElements) as BlockSchema[];
    const elements: ComponentElementInstance[] = blocks.map(
      PreviewBlockToElement
    );
    setElements(elements);
  }, []);

  return (
    <div className="px-4 py-2">
      {elements.map((element: ComponentElementInstance) => {
        const RenderComponent =
          LibraryElementsRegister[element.type].renderComponent;
        return <RenderComponent key={element.id} elementInstance={element} />;
      })}
    </div>
  );
}
