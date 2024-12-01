import { libraryElements } from "@/elements";
import { previewBlockToElement } from "@/lib/utils";
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
      previewBlockToElement
    );
    setElements(elements);
  }, []);

  return (
    <>
      {elements.map((element: ComponentElementInstance) => {
        const RenderComponent = libraryElements[element.type].renderComponent;
        return <RenderComponent key={element.id} elementInstance={element} />;
      })}
    </>
  );
}
