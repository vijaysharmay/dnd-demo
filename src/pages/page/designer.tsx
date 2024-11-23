import { libraryElements } from "@/elements";
import { cn } from "@/lib/utils";
import useElementStore from "@/store/element-store";
import { ComponentElementInstance, ComponentElementType } from "@/types";
import { DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";

import { getPageInProjectWorkspace } from "@/api";
import { createBlockInPage, CreateBlockRequestSchema } from "@/api/block";
import { Skeleton } from "@/components/ui/skeleton";
import usePageStore from "@/store/page-store";
import { BlockSchema } from "@/types/api/page";
import { InputPropsSchema, PropsSchema } from "@/types/properties";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isNull } from "lodash";
import { useEffect } from "react";
import DesignerElementWrapper from "./designer-element-wrapper";

export default function Designer({
  workspaceId,
  projectId,
  pageId,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
}) {
  const {
    elements,
    setElements,
    addElement,
    addElementToParent,
    getElementById,
    getElementIndexById,
    moveElementV,
    setActiveElement,
    removeElement,
    setActiveElementId,
  } = useElementStore();

  const { setCurrentPage } = usePageStore();

  const droppable = useDroppable({
    id: "designer",
    data: {
      isDesignerDropArea: true,
    },
  });

  const addBlockToPageMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      values,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      values: CreateBlockRequestSchema;
    }) => createBlockInPage(workspaceId, projectId, pageId, values),
    onSuccess: () => {
      console.log("added");
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const handleAddElement = (
    index: number,
    element: ComponentElementInstance
  ) => {
    addElement(index, element);
    const values = {
      blockType: element.type,
      props: element.props,
      depth: 0,
      position: index,
    };
    addBlockToPageMutation.mutate({ workspaceId, projectId, pageId, values });
  };

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isLibraryListItem = active.data?.current?.isLibraryListItem;
      const isDesignerElementDraggable =
        active.data?.current?.isDesignerElementDraggable;
      const hoveredElementId = over.data?.current?.id as string;
      const hoveredElementIndex = getElementIndexById(hoveredElementId);
      const isHContainerDroppable = over.data?.current?.isHContainerDroppable;

      if (isLibraryListItem && hoveredElementIndex !== undefined) {
        const elementType = active.data?.current?.type;
        const isTop = over.data?.current?.isTopHalfDroppable;
        const isBottom = over.data?.current?.isBottomHalfDroppable;
        const newElement =
          libraryElements[elementType as ComponentElementType].create(uuidv4());

        if (hoveredElementIndex > -1 && (isTop || isBottom)) {
          if (isTop) {
            handleAddElement(hoveredElementIndex, newElement);
          }

          if (isBottom) {
            handleAddElement(hoveredElementIndex + 1, newElement);
          }
        } else {
          if (isHContainerDroppable) {
            const hContainerId = over.data?.current?.id;
            const index = over.data?.current?.index;
            newElement.parentId = hContainerId;
            addElementToParent(hContainerId, index, newElement);
          } else {
            handleAddElement(0, newElement);
          }
        }

        setActiveElement(newElement);
        setActiveElementId(newElement.id);
      }

      if (isDesignerElementDraggable && hoveredElementIndex !== undefined) {
        const movedElementId = active.data?.current?.elementId;
        const fromIndex = getElementIndexById(movedElementId);
        const isTop = over.data?.current?.isTopHalfDroppable;
        const isBottom = over.data?.current?.isBottomHalfDroppable;

        if (isHContainerDroppable) {
          const hContainerId = over.data?.current?.id;
          const index = over.data?.current?.index;
          const activatedElementId = active.data?.current?.id;
          const activatedElement = getElementById(activatedElementId);
          if (!isNull(activatedElement)) {
            activatedElement.parentId = hContainerId;
            addElementToParent(hContainerId, index, activatedElement);
            removeElement(activatedElementId, null);
          }
        }

        if (fromIndex !== hoveredElementIndex) {
          const targetIndex = isTop
            ? hoveredElementIndex - 1
            : isBottom
              ? hoveredElementIndex + 1
              : hoveredElementIndex;

          if (fromIndex !== targetIndex) {
            moveElementV(
              movedElementId,
              fromIndex as number,
              hoveredElementIndex
            );
          }
        }
      }
    },
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["getPageInProjectWorkspace", workspaceId, projectId, pageId],
    queryFn: () => getPageInProjectWorkspace(workspaceId, projectId, pageId),
  });

  useEffect(() => {
    if (data) {
      setCurrentPage(data);
      const elements: ComponentElementInstance[] = data.blocks.map(
        (block: BlockSchema) => {
          const {
            blockType,
            props: unParsedProps,
            parentId,
            id,
            children,
          } = block;
          const type: ComponentElementType = blockType as ComponentElementType;
          const props: PropsSchema = unParsedProps as InputPropsSchema;
          return {
            id,
            type,
            props,
            parentId,
            children,
          };
        }
      );
      setElements(elements);
    }
  }, [data, setCurrentPage, setElements]);

  if (error) return <div>{error.message}</div>;
  if (isPending) return <Skeleton />;

  return (
    <>
      <div className="bg-gray-100 p-4 h-screen">
        <div className="bg-white shadow-md h-full w-full flex">
          <div
            ref={droppable.setNodeRef}
            className={cn(
              "p-4 gap-4 h-full flex-col flex-1 m-auto overflow-y-auto justify-start gap-y-12",
              droppable.isOver && "ring-2 ring-primary/20"
            )}
          >
            {droppable.isOver && elements.length === 0 && (
              <div className="p-4 w-full">
                <div className="rounded-md bg-primary/20 h-[60px]"></div>
              </div>
            )}

            {elements.length > 0 &&
              elements.map((element: ComponentElementInstance) => {
                return (
                  element && (
                    <DesignerElementWrapper
                      key={element.id}
                      element={element}
                    />
                  )
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
