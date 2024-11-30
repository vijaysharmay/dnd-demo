import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppContainer from "@/containers/app-container";
import { useParams } from "wouter";

import useWorkspaceStore from "@/store/workspace-store";
import ShowAccordsTable from "./show-accords-table";

export default function Project() {
  const { workspaceId, projectId } = useParams();
  const { currentProjectName } = useWorkspaceStore();

  if (!workspaceId || !projectId) return;

  return (
    <AppContainer title={<div>{currentProjectName}</div>}>
      <div className="p-2">
        <Tabs defaultValue="accords">
          <TabsList className="">
            <TabsTrigger value="accords">Accords</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="accords">
            <ShowAccordsTable workspaceId={workspaceId} projectId={projectId} />
          </TabsContent>
          <TabsContent value="settings"></TabsContent>
        </Tabs>
      </div>
    </AppContainer>
  );
}
