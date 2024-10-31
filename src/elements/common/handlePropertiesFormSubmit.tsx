import useElementStore from "@/store/element-store";
import { ComponentElementInstance, HContainer } from "@/types";
import { HContainerPropsSchema, PropsSchema } from "@/types/properties";
import { drop, dropRight, fill } from "lodash";

export const handlePropertiesFormSubmit = (
  activeElementProps: PropsSchema,
  activeElement: ComponentElementInstance
) => {
  const { updateElement, addElement, getElementIndexById, setActiveElement } =
    useElementStore.getState();

  const updatedElement: ComponentElementInstance = {
    ...activeElement,
    props: activeElementProps,
  };

  if (updatedElement.children) {
    const childCount = updatedElement.children.length;

    if (activeElement.type === HContainer) {
      const noOfColumns = (activeElementProps as HContainerPropsSchema)
        .hContainerColumns;
      if (childCount > parseInt(noOfColumns)) {
        const updatedElementIndex = getElementIndexById(activeElement.id);

        drop(updatedElement.children, parseInt(noOfColumns)).forEach(
          (child) => {
            if (child) {
              addElement(
                updatedElementIndex + 1,
                child as ComponentElementInstance
              );
            }
          }
        );

        const childCountDiff = childCount - parseInt(noOfColumns);
        updatedElement.children = dropRight(
          updatedElement.children,
          childCountDiff
        );
      } else {
        const childCountDiff = parseInt(noOfColumns) - childCount;

        updatedElement.children = [
          ...updatedElement.children,
          ...fill(Array(childCountDiff), null),
        ];
      }
    }
  }

  updateElement(activeElement.id, updatedElement);
  setActiveElement(updatedElement);
};
