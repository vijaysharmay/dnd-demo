import { Toaster } from "@/components/ui/toaster";
import AppContainer from "@/containers/app-container";
import { cn } from "@/lib/utils";
import Messages from "@/pages/version/messages";
import Properties from "@/pages/version/properties";
import useWorkspaceStore from "@/store/workspace-store";
import { GitBranch, Info, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { useParams } from "wouter";

import DesignerContainer from "@/pages/version/version-designer";
import History from "./history";
import VersionTitle from "./title";

export default function Version() {
  const [activeTab, setActiveTab] = useState<"properties" | "messages" | "history" | null>(null);

  const { workspaceId, projectId, pageId, versionId } = useParams();
  const { currentWorkspace } = useWorkspaceStore();

  if (!workspaceId || !projectId || !pageId || !versionId) return;

  return (
    <AppContainer title={<VersionTitle />}>
      <>
        <div className="flex flex-row">
          <div className="grow">
            <DesignerContainer
              workspaceId={workspaceId}
              projectId={projectId}
              pageId={pageId}
              versionId={versionId}
            />
          </div>
          {/* Conditionally render the active tab */}
          {activeTab === "properties" && (
            <div className="shadow-md w-72">
              <Properties />
            </div>
          )}
          {activeTab === "messages" && (
            <div className="shadow-md w-72">
              <Messages />
            </div>
          )}
          {activeTab === "history" && (
            <div className="shadow-md w-72">
              <History />
            </div>
          )}

          {/* Sidebar with tab controls */}
          <div className="shadow-md p-2">
            <div className="flex flex-col justify-center pt-2 cursor-pointer">
              <div
                className={cn(
                  "p-2 hover:bg-primary/50 rounded-md",
                  activeTab === "properties" && "bg-primary/50"
                )}
                onClick={() => setActiveTab(activeTab === "properties" ? null : "properties")}
              >
                <Info />
              </div>
              {!currentWorkspace?.isUserWorkspace && (
                <div
                  className={cn(
                    "p-2 hover:bg-primary/50 rounded-md",
                    activeTab === "messages" && "bg-primary/50"
                  )}
                  onClick={() => setActiveTab(activeTab === "messages" ? null : "messages")}
                >
                  <MessageSquareText />
                </div>
              )}
              <div
                className={cn(
                  "p-2 hover:bg-primary/50 rounded-md",
                  activeTab === "history" && "bg-primary/50"
                )}
                onClick={() => setActiveTab(activeTab === "history" ? null : "history")}
              >
                <GitBranch />
              </div>
            </div>
          </div>
        </div>

        <Toaster />
      </>
    </AppContainer>
  );
}
