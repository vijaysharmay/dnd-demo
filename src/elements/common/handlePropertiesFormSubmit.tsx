import useElementStore from "@/store/element-store";
import { ComponentElementInstance, HContainer } from "@/types";
import {
  colsIntRec,
  HContainerPropsSchema,
  PropsSchema,
} from "@/types/properties";
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
      const noOfColumns =
        colsIntRec[
          (activeElementProps as HContainerPropsSchema).hContainerColumns
        ];
      if (childCount > noOfColumns) {
        const updatedElementIndex = getElementIndexById(activeElement.id);

        drop(updatedElement.children, noOfColumns).forEach((child) => {
          if (child) {
            addElement(
              updatedElementIndex + 1,
              child as ComponentElementInstance
            );
          }
        });

        const childCountDiff = childCount - noOfColumns;
        updatedElement.children = dropRight(
          updatedElement.children,
          childCountDiff
        );
      } else {
        const childCountDiff = noOfColumns - childCount;

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
