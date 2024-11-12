import { initFormChildren } from "@/lib/utils";
import useElementStore from "@/store/element-store";
import { ComponentElementInstance, Form, HContainer } from "@/types";
import {
  colsIntRec,
  FormPropsSchema,
  HContainerPropsSchema,
  PropsSchema,
} from "@/types/properties";
import { drop, dropRight, fill, isNull } from "lodash";

export const handlePropertiesFormSubmit = (
  activeElementProps: PropsSchema,
  activeElement: ComponentElementInstance
) => {
  const {
    updateElement,
    addElement,
    getElementIndexById,
    setActiveElement,
    updateElementInParent,
  } = useElementStore.getState();

  const hasParent: boolean = !isNull(activeElement.parentId);

  const updatedChildren =
    activeElement.type === Form
      ? {
          children: initFormChildren(
            (activeElementProps as FormPropsSchema).responseSchemaMapping
          ),
        }
      : { children: activeElement.children };

  const updatedElement: ComponentElementInstance = {
    ...activeElement,
    ...updatedChildren,
    props: activeElementProps,
  };

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

  if (hasParent) {
    updateElementInParent(activeElement.parentId as string, updatedElement);
  } else {
    updateElement(activeElement.id, updatedElement);
  }

  setActiveElement(updatedElement);
};
