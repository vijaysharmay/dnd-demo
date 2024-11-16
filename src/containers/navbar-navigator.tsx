"use client";

import {
  ChevronRight,
  File,
  Folder,
  Forward,
  MoreHorizontal,
  Settings,
  Trash2,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";

export function ConcordSidebarNavigator() {
  const projects = [
    {
      name: "Design Engineering",
      children: [{ name: "as" }],
    },
    {
      name: "Sales & Marketing",
      children: [{ name: "as" }],
    },
    {
      name: "Travel",
      children: [{ name: "as" }],
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <NavTree key={item.name} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

type NavTreeNode = {
  name: string;
  children?: NavTreeNode[];
};

function NavTree({ item }: { item: NavTreeNode }) {
  if (!item.children) {
    return (
      <SidebarMenuItem className="cursor-pointer hover:bg-sidebar-accent rounded">
        <SidebarMenuButton className="min-w-full">
          <File />
          {item.name}
        </SidebarMenuButton>
        <DropdownContainer />
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="w-full pr-4">
            {item.children?.map((node: NavTreeNode) => (
              <NavTree key={node.name} item={node} />
            ))}
          </SidebarMenuSub>
          <DropdownContainer />
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function DropdownContainer() {
  const { isMobile } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction>
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem>
          <Forward className="text-muted-foreground" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash2 className="text-muted-foreground" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
