import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppContainer from "@/containers/app-container";

import useWorkspaceStore from "@/store/workspace-store";

export default function Page() {
  const { currentPage } = useWorkspaceStore();

  return (
    <AppContainer title={<div>{currentPage?.name}</div>}>
      {currentPage ? (
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
