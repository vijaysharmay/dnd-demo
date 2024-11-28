import { libraryElements } from "@/elements";
import useElementStore from "@/store/element-store";
import { ComponentElementInstance } from "@/types";

export default function Preview() {
  const { elements } = useElementStore();
  return (
    <>
      {elements.map((element: ComponentElementInstance) => {
        const RenderComponent = libraryElements[element.type].renderComponent;
        return <RenderComponent key={element.id} elementInstance={element} />;
      })}
    </>
  );
}
