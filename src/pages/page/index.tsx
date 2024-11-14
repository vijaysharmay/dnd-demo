import { Toaster } from "@/components/ui/toaster";
import { ComponentLibrary } from "@/containers/component-library";
import Designer from "@/containers/designer";
import DragOverlayWrapper from "@/containers/drag-overlay-wrapper";
import Properties from "@/containers/properties";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Page() {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <>
      <PanelGroup direction="horizontal">
        <DndContext modifiers={[restrictToWindowEdges]} sensors={sensors}>
          <Panel
            defaultSize={15}
            minSize={15}
            maxSize={15}
            className="shadow-md"
          >
            <ComponentLibrary />
          </Panel>
          <PanelResizeHandle />
          <Panel defaultSize={65} minSize={65} maxSize={65}>
            <Designer />
          </Panel>
          <DragOverlayWrapper />
        </DndContext>
        <PanelResizeHandle />
        <Panel defaultSize={20} minSize={20} maxSize={20} className="shadow-md">
          <Properties />
        </Panel>
      </PanelGroup>
      <Toaster />
    </>
  );
}
