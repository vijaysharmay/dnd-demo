import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppContainer from "@/containers/app-container";

import useWorkspaceStore from "@/store/workspace-store";
import { Logs, Settings } from "lucide-react";

export default function Workspace() {
  const { currentWorkspace } = useWorkspaceStore();

  return (
    <AppContainer title={<div>{currentWorkspace?.name}</div>}>
      {currentWorkspace ? (
        <div className="p-2">
          <Tabs defaultValue="changelog">
            <TabsList className="">
            <TabsTrigger value="changelog">
              <Logs className="h-4 w-4 mr-1" />
              Changelog
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
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
