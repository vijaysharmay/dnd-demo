import { libraryElements } from "@/elements";
import { ComponentElementType } from "@/types";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";

import { LibraryListDragOverlay } from "./component-library";

export default function DragOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  const elementType = draggedItem.data?.current?.type;
  const isLibraryItem = draggedItem.data?.current?.isLibraryListItem;

  return (
    <DragOverlay>
      {isLibraryItem ? (
        <LibraryListDragOverlay
          element={libraryElements[elementType as ComponentElementType]}
        />
      ) : (
        <div>No drag overlay found !</div>
      )}
    </DragOverlay>
  );
}
