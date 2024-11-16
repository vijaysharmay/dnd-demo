"use client";
import {
  ChevronRight,
  File,
  Folder,
  Forward,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Skeleton } from "@/components/ui/skeleton";
import { convertToTree } from "@/lib/utils";
import useWorkspaceStore from "@/store/workspace-store";

export function ConcordSidebarNavigator() {
  const { currentWorkspace, isWorkspaceDataLoading } = useWorkspaceStore();

  if (!currentWorkspace) return;
  const workspaceTree = convertToTree(currentWorkspace);
  const projects = workspaceTree.children;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      {projects && (
        <>
          {isWorkspaceDataLoading && (
            <Skeleton className="w-full rounded h-12" />
          )}
          {projects.length === 0 && (
            <div className="ml-2 mt-2">No Projects Found</div>
          )}
          {projects.length > 0 && (
            <SidebarMenu>
              {projects.map((item) => (
                <NavTree key={item.name} item={item} />
              ))}
            </SidebarMenu>
          )}
        </>
      )}
    </SidebarGroup>
  );
}

type NavTreeNode = {
  name: string;
  type: string;
  children?: NavTreeNode[];
};

function NavTree({ item }: { item: NavTreeNode }) {
  if (!item.children) {
    return (
      <SidebarMenuItem className="cursor-pointer hover:bg-sidebar-accent rounded">
        <SidebarMenuButton className="">
          <File />
          <NodeOptions nodeType={item.type}>
            <>{item.name}</>
          </NodeOptions>
        </SidebarMenuButton>
        {/* <DropdownContainer /> */}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <SidebarMenuButton>
          <CollapsibleTrigger asChild>
            <ChevronRight className="transition-transform" />
          </CollapsibleTrigger>
          <Folder />
          <NodeOptions nodeType={item.type}>
            <>{item.name}</>
          </NodeOptions>
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0">
            {item.children?.map((node: NavTreeNode) => (
              <NavTree key={node.name} item={node} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
      {/* <DropdownContainer /> */}
    </SidebarMenuItem>
  );
}

function NodeOptions({
  nodeType,
  children,
}: {
  nodeType: string;
  children: React.ReactElement;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {nodeType === "project" && (
          <>
            <NodeOptionsItem
              name="Add Page"
              icon={<Plus className="size-4" />}
            />
            <DropdownMenuSeparator />
          </>
        )}
        <NodeOptionsItem name="Share" icon={<Forward className="size-4" />} />
        <NodeOptionsItem
          name="Settings"
          icon={<Settings className="size-4" />}
        />
        <DropdownMenuSeparator />
        <NodeOptionsItem name="Delete" icon={<Trash2 className="size-4" />} />
      </ContextMenuContent>
    </ContextMenu>
  );
}

function NodeOptionsItem({
  name,
  icon,
}: {
  name: string;
  icon: React.ReactElement;
}) {
  return (
    <ContextMenuItem className="gap-2 p-2">
      <div className="flex size-6 items-center justify-center rounded-md border bg-background text-muted-foreground">
        {icon}
      </div>
      <div className="font-medium text-muted-foreground">{name}</div>
    </ContextMenuItem>
  );
}
