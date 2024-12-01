import { cn } from "@/lib/utils";
import { ComponentElementInstance } from "@/types";
import { HContainerPropsSchema } from "@/types/properties";
import { isNull } from "lodash";
import { LibraryElementsRegister } from "..";

export const HContainerRenderComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { props, children } = elementInstance;
  const { hContainerId, hContainerHeightInPx, hContainerColumns } =
    props as HContainerPropsSchema;

  const colsClassMapper: Record<string, string> = {
    One: "grid-cols-1",
    Two: "grid-cols-2",
    Three: "grid-cols-3",
    Four: "grid-cols-4",
  };

  return (
    <div
      id={hContainerId}
      className={cn(
        "grid",
        colsClassMapper[hContainerColumns],
        "gap-2 auto-cols-max grid-flow-col p-2 w-full"
      )}
      style={{ minHeight: `${hContainerHeightInPx}` }}
    >
      {children.map((element: ComponentElementInstance | null) => {
        if (!isNull(element)) {
          const ChildRenderComponent =
            LibraryElementsRegister[element.type].renderComponent;
          return (
            <ChildRenderComponent key={element.id} elementInstance={element} />
          );
        }
      })}
    </div>
  );
};
