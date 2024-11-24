import { libraryElements } from "@/elements";
import useElementStore from "@/store/element-store";
import { ComponentElementInstance } from "@/types";

export default function Preview() {
  const { elements } = useElementStore();
  return (
    <div className="bg-gray-300 p-4">
      <div className="bg-white h-screen rounded-xs p-2">
        {elements.map((element: ComponentElementInstance) => {
          const RenderComponent = libraryElements[element.type].renderComponent;
          return <RenderComponent key={element.id} elementInstance={element} />;
        })}
      </div>
    </div>
  );
}
