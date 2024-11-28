import { Toaster } from "@/components/ui/toaster";
import AppContainer from "@/containers/app-container";
import Messages from "@/pages/version/messages";
import { cn } from "@/lib/utils";
import { ComponentLibrary } from "@/pages/version/component-library";
import Designer from "@/pages/version/designer";
import DragOverlayWrapper from "@/pages/version/drag-overlay-wrapper";
import Properties from "@/pages/version/properties";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { GitBranch, Info, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useParams } from "wouter";
import History from "./history";
import VersionTitle from "./title";

export default function Version() {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [showProperties, setShowProperties] = useState<boolean>(false);
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const { workspaceId, projectId, pageId, versionId } = useParams();

  if (!workspaceId || !projectId || !pageId || !versionId) return;

  return (
    <AppContainer title={<VersionTitle />}>
      <>
        <PanelGroup direction="horizontal">
          <DndContext modifiers={[restrictToWindowEdges]} sensors={sensors}>
            <Panel maxSize={15} className="shadow-md">
              <ComponentLibrary />
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <Designer
                workspaceId={workspaceId}
                projectId={projectId}
                pageId={pageId}
                versionId={versionId}
              />
            </Panel>
            <DragOverlayWrapper />
          </DndContext>
          {showProperties && (
            <Panel
              collapsible={true}
              minSize={20}
              maxSize={20}
              className="shadow-md"
            >
              <Properties />
            </Panel>
          )}
          {showMessages && (
            <Panel
              collapsible={true}
              minSize={20}
              maxSize={20}
              className="shadow-md"
            >
              <Messages />
            </Panel>
          )}
          {showHistory && (
            <Panel
              collapsible={true}
              minSize={20}
              maxSize={20}
              className="shadow-md"
            >
              <History />
            </Panel>
          )}
          <PanelResizeHandle />
          <Panel collapsible={true} maxSize={5} className="shadow-md">
            <div className="grid grid-col-1 justify-center pt-2 cursor-pointer">
              <div
                className={cn(
                  "p-2 hover:bg-gray-200 rounded-md",
                  showProperties && "bg-gray-200"
                )}
                onClick={() => setShowProperties(!showProperties)}
              >
                <Info />
              </div>
              <div
                className={cn(
                  "p-2 hover:bg-gray-200 rounded-md",
                  showMessages && "bg-gray-200"
                )}
                onClick={() => setShowMessages(!showMessages)}
              >
                <MessageSquareText />
              </div>
              <div
                className={cn(
                  "p-2 hover:bg-gray-200 rounded-md",
                  showHistory && "bg-gray-200"
                )}
                onClick={() => setShowHistory(!showHistory)}
              >
                <GitBranch />
              </div>
            </div>
          </Panel>
        </PanelGroup>

        <Toaster />
      </>
    </AppContainer>
  );
}
