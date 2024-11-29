import {
  addChildrenToBlock,
  CreateBlockRequestSchema,
  updateBlockPropsInPageVersion,
} from "@/api/block";
import { initFormChildren } from "@/lib/utils";
import useAccordStore from "@/store/accord-store";
import useElementStore from "@/store/element-store";
import {
  Barchart,
  ComponentElementInstance,
  DTable,
  Form,
  HContainer,
} from "@/types";
import { JSONZType } from "@/types/api/common";
import {
  colsIntRec,
  DTablePropsSchema,
  FormPropsSchema,
  HContainerPropsSchema,
  PropsSchema,
} from "@/types/properties";
import { useMutation } from "@tanstack/react-query";
import { drop, dropRight, fill, isNull } from "lodash";
import { z } from "zod";

export const usePropertiesFormSubmit = ({
  workspaceId,
  projectId,
  pageId,
  versionId,
  blockId,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
  versionId: string;
  blockId: string;
}) => {
  const updateBlockPropsMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      versionId,
      blockId,
      props,
      depth,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      versionId: string;
      blockId: string;
      props: z.infer<typeof JSONZType>;
      depth: number;
    }) =>
      updateBlockPropsInPageVersion(
        workspaceId,
        projectId,
        pageId,
        versionId,
        blockId,
        props,
        depth
      ),
    onSuccess: () => {
      console.log("updated props");
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const addChildrenToBlockMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      versionId,
      blockId,
      values,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      versionId: string;
      blockId: string;
      values: CreateBlockRequestSchema[];
    }) =>
      addChildrenToBlock(
        workspaceId,
        projectId,
        pageId,
        versionId,
        blockId,
        values
      ),
    onSuccess: () => {
      console.log("added");
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const handlePropertiesFormSubmit = (
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

    const { getAccordById } = useAccordStore.getState();
    let updatedProps = activeElementProps;
    let updatedChildren = { children: activeElement.children };
    const hasParent: boolean = !isNull(activeElement.parentId);

    if (activeElement.type === DTable) {
      const { accordId } = activeElementProps as DTablePropsSchema;
      if (accordId) {
        const accord = getAccordById(accordId) ?? null;
        updatedProps = {
          ...activeElementProps,
          accord,
        };
      }
    }

    if (activeElement.type === Barchart) {
      const { accordId } = activeElementProps as DTablePropsSchema;
      if (accordId) {
        const accord = getAccordById(accordId) ?? null;
        updatedProps = {
          ...activeElementProps,
          accord,
        };
      }
    }

    if (activeElement.type === Form) {
      const { accordId } = activeElementProps as FormPropsSchema;
      if (accordId) {
        const accord = getAccordById(accordId);
        if (accord) {
          updatedProps = {
            ...activeElementProps,
            accord,
          };
          updatedChildren = {
            children: initFormChildren(activeElement.id, accord.accordSchema),
          };
        }
      }
    }

    const updatedElement: ComponentElementInstance = {
      ...activeElement,
      ...updatedChildren,
      props: updatedProps,
    };

    const childCount = updatedElement.children.length;

    if (activeElement.type === HContainer) {
      const noOfColumns =
        colsIntRec[(updatedProps as HContainerPropsSchema).hContainerColumns];
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

    if (activeElement.type === Form || activeElement.type === HContainer) {
      addChildrenToBlockMutation.mutate({
        workspaceId,
        projectId,
        pageId,
        versionId,
        blockId,
        values: updatedElement.children
          .filter((x) => !isNull(x))
          .map((child: ComponentElementInstance, index: number) => {
            const block: CreateBlockRequestSchema = {
              id: child.id,
              blockType: child.type,
              props: child.props,
              depth: 1,
              position: index,
            };
            return block;
          }),
      });
    }

    updateBlockPropsMutation.mutate({
      workspaceId,
      projectId,
      pageId,
      versionId,
      blockId,
      props: updatedElement.props,
      depth: hasParent ? 1 : 0,
    });

    setActiveElement(updatedElement);
  };

  return handlePropertiesFormSubmit;
};
