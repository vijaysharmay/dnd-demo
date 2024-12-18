import { getPageVersionInProjectWorkspace } from "@/api";
import {
  addChildToBlock,
  createBlockInPageVersion,
  CreateBlockRequestSchema,
} from "@/api/block";
import { Skeleton } from "@/components/ui/skeleton";
import { LibraryElementsRegister } from "@/elements";
import { BlockToElement, cn, TransformVersionSchema } from "@/lib/utils";
import useElementStore from "@/store/element-store";
import useVersionStore from "@/store/version-store";
import { ComponentElementInstance, ComponentElementType } from "@/types";
import { BlockSchema } from "@/types/api/page";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDndMonitor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isNull } from "lodash";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { ComponentLibrary } from "./component-library";
import DesignerElementWrapper from "./designer-element-wrapper";
import DragOverlayWrapper from "./drag-overlay-wrapper";

function Designer({
  workspaceId,
  projectId,
  pageId,
  versionId,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
  versionId: string;
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

  const { setCurrentVersion } = useVersionStore();

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
      versionId,
      values,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      versionId: string;
      values: CreateBlockRequestSchema;
    }) =>
      createBlockInPageVersion(
        workspaceId,
        projectId,
        pageId,
        versionId,
        values
      ),
    onSuccess: () => {
      console.log("added");
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const addChildToBlockMutation = useMutation({
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
      values: CreateBlockRequestSchema;
    }) =>
      addChildToBlock(
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

  const handleAddElement = (
    index: number,
    element: ComponentElementInstance
  ) => {
    addElement(index, element);
    const values = {
      id: element.id,
      blockType: element.type,
      props: element.props,
      depth: 0,
      position: index,
    };
    addBlockToPageMutation.mutate({
      workspaceId,
      projectId,
      pageId,
      versionId,
      values,
    });
  };

  const handleAddElementToParent = (
    parentElementId: string,
    index: number,
    element: ComponentElementInstance
  ) => {
    addElementToParent(parentElementId, index, element);
    const values = {
      id: element.id,
      blockType: element.type,
      props: element.props,
      depth: 0,
      position: index,
    };
    addChildToBlockMutation.mutate({
      workspaceId,
      projectId,
      pageId,
      versionId,
      blockId: parentElementId,
      values,
    });
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
          LibraryElementsRegister[elementType as ComponentElementType].create(
            uuidv4()
          );

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
            handleAddElementToParent(hContainerId, index, newElement);
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
            handleAddElementToParent(hContainerId, index, activatedElement);
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
    queryKey: [
      "getPageVersionInProjectWorkspace",
      workspaceId,
      projectId,
      pageId,
      versionId,
    ],
    queryFn: () =>
      getPageVersionInProjectWorkspace(
        workspaceId,
        projectId,
        pageId,
        versionId
      ),
  });

  useEffect(() => {
    if (data) {
      const transformed = TransformVersionSchema(data);
      setCurrentVersion(data);
      const elements: ComponentElementInstance[] = transformed.blocks.map(
        (block: BlockSchema) => BlockToElement(block)
      );
      setElements(elements);
    }
  }, [data, setCurrentVersion, setElements]);

  if (error) return <div>{error.message}</div>;
  if (isPending) return <Skeleton />;

  return (
    <>
      <div className="p-2 h-screen">
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

export default function DesignerContainer({
  workspaceId,
  projectId,
  pageId,
  versionId,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
  versionId: string;
}) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  return (
    <div className="flex flex-row">
      <DndContext modifiers={[restrictToWindowEdges]} sensors={sensors}>
        <div className="basis-1">
          <ComponentLibrary />
        </div>
        <div className="grow">
          <Designer
            workspaceId={workspaceId}
            projectId={projectId}
            pageId={pageId}
            versionId={versionId}
          />
          <DragOverlayWrapper />
        </div>
      </DndContext>
    </div>
  );
}
