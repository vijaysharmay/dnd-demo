import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppContainer from "@/containers/app-container";

import useWorkspaceStore from "@/store/workspace-store";

export default function Workspace() {
  const { currentWorkspace } = useWorkspaceStore();

  return (
    <AppContainer title={<div>{currentWorkspace?.name}</div>}>
      {currentWorkspace ? (
        <div className="p-2">
          <Tabs defaultValue="changelog">
            <TabsList className="">
              <TabsTrigger value="changelog">Changelog</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="changelog"></TabsContent>
            <TabsContent value="settings"></TabsContent>
          </Tabs>
        </div>
      ) : (
        <></>
      )}
    </AppContainer>
  );
}
