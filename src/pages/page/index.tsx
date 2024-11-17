import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import AppContainer from "@/containers/app-container";
import { ComponentLibrary } from "@/containers/component-library";
import Designer from "@/containers/designer";
import DragOverlayWrapper from "@/containers/drag-overlay-wrapper";
import Properties from "@/containers/properties";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
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
    <AppContainer title="Page">
      <>
        <PanelGroup direction="horizontal">
          <DndContext modifiers={[restrictToWindowEdges]} sensors={sensors}>
            <Panel
              defaultSize={10}
              minSize={0}
              maxSize={15}
              className="shadow-md"
            >
              <ComponentLibrary />
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={80} minSize={60} maxSize={85}>
              <Designer />
            </Panel>
            <DragOverlayWrapper />
          </DndContext>
          <PanelResizeHandle />
          <Panel
            defaultSize={15}
            minSize={15}
            maxSize={20}
            className="shadow-md"
          >
            <Properties />
          </Panel>
        </PanelGroup>
        <Toaster />
      </>
    </AppContainer>
  );
}
