import { ChevronsUpDown, Plus } from "lucide-react";

import { getUser } from "@/api/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import useWorkspaceStore from "@/store/workspace-store";
import { useQuery } from "@tanstack/react-query";
import { map } from "lodash";
import { useEffect } from "react";

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();
  const { isPending, error, data } = useQuery({
    queryKey: ["getCurrentUser"],
    queryFn: getUser,
  });

  const {
    workspaces,
    setWorkspaces,
    currentWorkspace,
    setCurrentWorkspace,
    isWorkspaceDataLoading,
    setIsWorkspaceDataLoading,
  } = useWorkspaceStore();

  useEffect(() => {
    if (data) {
      setIsWorkspaceDataLoading(isPending);
      setWorkspaces(map(data.workspaces, "workspace"));
      setCurrentWorkspace(data.userWorkspace);
    }
  }, [
    data,
    isPending,
    setCurrentWorkspace,
    setIsWorkspaceDataLoading,
    setWorkspaces,
  ]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="-ml-2">
        Select your workspace
      </SidebarGroupLabel>
      {isWorkspaceDataLoading && (
        <Skeleton className="w-full h-6 rounded-full" />
      )}
      {!isWorkspaceDataLoading && (
        <>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="sm"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ring-1 ring-slate-300"
                    >
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {currentWorkspace?.name}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Workspaces
                    </DropdownMenuLabel>
                    {workspaces.map((workspace) => (
                      <DropdownMenuItem
                        key={workspace.name}
                        onClick={() => setCurrentWorkspace(workspace)}
                        className="gap-2 p-2"
                      >
                        {workspace.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-4" />
                      </div>
                      <div className="font-medium text-muted-foreground">
                        Create Workspace
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </>
      )}
    </SidebarGroup>
  );
}
