import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import useAuthStore from "@/store/auth-store";
import useWorkspaceStore from "@/store/workspace-store";
import * as React from "react";
import { navigate } from "wouter/use-browser-location";

import { ConcordSidebarNavigator } from "./navbar-navigator";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authStore = useAuthStore();
  const { setCurrentWorkspace } = useWorkspaceStore();
  const handleLogout = () => {
    authStore.logout();
    navigate("/");
  };

  return (
    <Sidebar {...props} className="bg-foreground text-background">
      <SidebarHeader>
        <div className="flex flex-row">
          <div
            className="text-3xl font-pacifico cursor-pointer"
            onClick={() => {
              setCurrentWorkspace(undefined);
              navigate("/home");
            }}
          >
            Concord
          </div>
          <div className="grow"></div>
          <div>
            {/* <ModeToggle /> */}
          </div>
        </div>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        <ConcordSidebarNavigator />
      </SidebarContent>
      <SidebarFooter>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
