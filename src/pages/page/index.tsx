import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppContainer from "@/containers/app-container";
import useWorkspaceStore from "@/store/workspace-store";
import { Logs, Settings, Variable } from "lucide-react";

import VariablesHome from "./variables";

export default function Page() {
  const { currentPage } = useWorkspaceStore();

  return (
    <AppContainer title={<div>{currentPage?.name}</div>}>
      {currentPage ? (
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
              <TabsTrigger value="variables">
                <Variable className="h-4 w-4 mr-1" />
                Variables
              </TabsTrigger>
            </TabsList>
            <TabsContent value="changelog"></TabsContent>
            <TabsContent value="settings"></TabsContent>
            <TabsContent value="variables">
              <VariablesHome />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <></>
      )}
    </AppContainer>
  );
}
