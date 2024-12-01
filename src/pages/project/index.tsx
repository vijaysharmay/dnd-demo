import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppContainer from "@/containers/app-container";
import { useParams } from "wouter";

import useWorkspaceStore from "@/store/workspace-store";
import { Logs, ReceiptText, Settings } from "lucide-react";
import ShowAccordsTable from "./show-accords-table";

export default function Project() {
  const { workspaceId, projectId } = useParams();
  const { currentProject } = useWorkspaceStore();

  if (!workspaceId || !projectId) return;

  return (
    <AppContainer title={<div>{currentProject?.name}</div>}>
      <div className="p-2">
        <Tabs defaultValue="accords">
          <TabsList className="">
            <TabsTrigger value="accords">
              <ReceiptText className="h-4 w-4 mr-1" />
              Accords
            </TabsTrigger>
            <TabsTrigger value="changelog">
              <Logs className="h-4 w-4 mr-1" />
              Changelog
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="accords">
            <ShowAccordsTable workspaceId={workspaceId} projectId={projectId} />
          </TabsContent>
          <TabsContent value="changelog"></TabsContent>
          <TabsContent value="settings"></TabsContent>
        </Tabs>
      </div>
    </AppContainer>
  );
}
