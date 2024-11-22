import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppContainer from "@/containers/app-container";
import { useParams } from "wouter";
import ShowAccordsTable from "./show-accords-table";

export default function Project() {
  const { workspaceId, projectId } = useParams();

  if (!workspaceId || !projectId) return;

  return (
    <AppContainer title="Project">
      <Tabs defaultValue="accords">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accords">Accords</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="accords">
          <ShowAccordsTable workspaceId={workspaceId} projectId={projectId} />
        </TabsContent>
        <TabsContent value="settings"></TabsContent>
      </Tabs>
    </AppContainer>
  );
}
