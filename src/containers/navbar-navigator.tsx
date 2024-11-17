"use client";
import { ChevronRight, File, Folder, Plus, Trash2 } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

import {
  createPageInProjectWorkspace,
  CreatePageRequestSchema,
  CreatePageRequestZSchema,
  deletePageInProjectWorkspace,
  deleteProjectInWorkspace,
} from "@/api";
import {
  createAccordInProjectWorkspace,
  CreateAccordRequestSchema,
  CreateAccordRequestZSchema,
} from "@/api/accord";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, convertToTree, Tree } from "@/lib/utils";
import useWorkspaceStore from "@/store/workspace-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { startsWith } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

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
                <NavTree
                  key={item.name}
                  item={item}
                  workspaceId={currentWorkspace.id}
                />
              ))}
            </SidebarMenu>
          )}
        </>
      )}
    </SidebarGroup>
  );
}

function NavTree({ workspaceId, item }: { workspaceId: string; item: Tree }) {
  const [location, navigate] = useLocation();
  if (!item.children) {
    return (
      <SidebarMenuItem className="cursor-pointer hover:bg-sidebar-accent rounded">
        <NodeOptions nodeType={item.type} workspaceId={workspaceId} node={item}>
          <SidebarMenuButton
            isActive={location === item.url}
            onClick={() => {
              navigate(item.url, { replace: true });
            }}
          >
            <File />
            <>{item.name}</>
          </SidebarMenuButton>
        </NodeOptions>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      {item.children.length > 0 && (
        <>
          <Collapsible
            className="group/collapsible [&[data-state=open]>span>button>svg:first-child]:rotate-90"
            defaultOpen={
              startsWith(location, item.url) && location !== item.url
            }
          >
            <NodeOptions
              nodeType={item.type}
              workspaceId={workspaceId}
              node={item}
            >
              <SidebarMenuButton isActive={location === item.url}>
                <CollapsibleTrigger asChild>
                  <ChevronRight className="transition-transform" />
                </CollapsibleTrigger>
                <Folder />
                <div
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.url, { replace: true });
                  }}
                >
                  {item.name}
                </div>
              </SidebarMenuButton>
            </NodeOptions>
            <CollapsibleContent>
              <SidebarMenuSub className="mr-0">
                {item.children?.map((node: Tree) => (
                  <NavTree
                    key={node.name}
                    item={node}
                    workspaceId={workspaceId}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
      {item.children.length === 0 && (
        <>
          <NodeOptions
            nodeType={item.type}
            workspaceId={workspaceId}
            node={item}
          >
            <SidebarMenuButton className="w-full">
              <Folder />
              <>{item.name}</>
            </SidebarMenuButton>
          </NodeOptions>
        </>
      )}
    </SidebarMenuItem>
  );
}

function NodeOptions({
  node,
  nodeType,
  workspaceId,
  children,
}: {
  node: Tree;
  nodeType: string;
  workspaceId: string;
  children: React.ReactElement;
}) {
  const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = useState(false);
  const [isCreateAccordDialogOpen, setIsCreateAccordDialogOpen] =
    useState(false);
  const [isDeletePageFormDialogOpen, setIsDeletePageFormDialogOpen] =
    useState(false);
  const [isDeleteProjectFormDialogOpen, setIsDeleteProjectFormDialogOpen] =
    useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {nodeType === "project" && (
          <>
            <NodeOptionsItem
              name="Add Page"
              icon={<Plus className="size-4" />}
              form={
                <AddPageForm
                  workspaceId={workspaceId}
                  projectId={node.id}
                  setIsCreatePageDialogOpen={setIsCreatePageDialogOpen}
                />
              }
              open={isCreatePageDialogOpen}
              onOpenChange={setIsCreatePageDialogOpen}
            />
            <NodeOptionsItem
              name="Add Accord"
              icon={<Plus className="size-4" />}
              form={
                <AddAccordForm
                  workspaceId={workspaceId}
                  projectId={node.id}
                  setIsCreateAccordDialogOpen={setIsCreateAccordDialogOpen}
                />
              }
              open={isCreateAccordDialogOpen}
              onOpenChange={setIsCreateAccordDialogOpen}
            />
            <NodeOptionsItem
              name="Delete Project"
              icon={<Trash2 className="size-4" />}
              form={
                <DeleteProjectForm
                  workspaceId={workspaceId}
                  projectId={node.id}
                  setIsDeleteProjectFormDialogOpen={
                    setIsDeleteProjectFormDialogOpen
                  }
                />
              }
              open={isDeleteProjectFormDialogOpen}
              onOpenChange={setIsDeleteProjectFormDialogOpen}
            />
          </>
        )}
        {nodeType === "page" && (
          <>
            <NodeOptionsItem
              name="Delete Page"
              icon={<Trash2 className="size-4" />}
              form={
                <DeletePageForm
                  workspaceId={workspaceId}
                  projectId={node.parentId}
                  pageId={node.id}
                  setIsDeletePageFormDialogOpen={setIsDeletePageFormDialogOpen}
                />
              }
              open={isDeletePageFormDialogOpen}
              onOpenChange={setIsDeletePageFormDialogOpen}
            />
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

function NodeOptionsItem({
  name,
  icon,
  form,
  open,
  onOpenChange,
}: {
  name: string;
  icon: React.ReactElement;
  form: React.ReactElement;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <ContextMenuItem
          className="gap-2 p-2"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-background text-muted-foreground">
            {icon}
          </div>
          <div className="font-medium text-muted-foreground">{name}</div>
        </ContextMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        {form}
      </DialogContent>
    </Dialog>
  );
}

function AddPageForm({
  workspaceId,
  projectId,
  setIsCreatePageDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  setIsCreatePageDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const createPageForm = useForm<CreatePageRequestSchema>({
    resolver: zodResolver(CreatePageRequestZSchema),
    values: {
      name: "",
      route: "",
    },
  });

  const createPageMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      values,
    }: {
      workspaceId: string;
      projectId: string;
      values: CreatePageRequestSchema;
    }) => createPageInProjectWorkspace(workspaceId, projectId, values),
    onSuccess: () => {
      setIsCreatePageDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const onCreatePageFormSubmit = (values: CreatePageRequestSchema) => {
    createPageMutation.mutate({ workspaceId, projectId, values });
  };

  return (
    <Form {...createPageForm}>
      <form
        onSubmit={createPageForm.handleSubmit(onCreatePageFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={createPageForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a page name"
                  className={cn(
                    createPageForm.formState.errors["name"] && "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createPageForm.control}
          name="route"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Route</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a page route"
                  className={cn(
                    createPageForm.formState.errors["route"] && "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button className="mt-2" type="submit">
            Create Page
          </Button>
        </div>
      </form>
    </Form>
  );
}

function AddAccordForm({
  workspaceId,
  projectId,
  setIsCreateAccordDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  setIsCreateAccordDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const createAccordForm = useForm<CreateAccordRequestSchema>({
    resolver: zodResolver(CreateAccordRequestZSchema),
    values: {
      name: "",
      route: "",
    },
  });

  const createAccordMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      values,
    }: {
      workspaceId: string;
      projectId: string;
      values: CreateAccordRequestSchema;
    }) => createAccordInProjectWorkspace(workspaceId, projectId, values),
    onSuccess: () => {
      setIsCreateAccordDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const onCreateAccordFormSubmit = (values: CreateAccordRequestSchema) => {
    createAccordMutation.mutate({ workspaceId, projectId, values });
  };

  return (
    <Form {...createAccordForm}>
      <form
        onSubmit={createAccordForm.handleSubmit(onCreateAccordFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={createAccordForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Accord name"
                  className={cn(
                    createAccordForm.formState.errors["name"] && "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={createAccordForm.control}
          name="route"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accord Route</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Accord route"
                  className={cn(
                    createAccordForm.formState.errors["route"] && "bg-red-50"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button className="mt-2" type="submit">
            Create Accord
          </Button>
        </div>
      </form>
    </Form>
  );
}

function DeleteProjectForm({
  workspaceId,
  projectId,
  setIsDeleteProjectFormDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  setIsDeleteProjectFormDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const createAccordMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
    }: {
      workspaceId: string;
      projectId: string;
    }) => deleteProjectInWorkspace(workspaceId, projectId),
    onSuccess: () => {
      setIsDeleteProjectFormDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const handleDeleteConfirmation = () => {
    createAccordMutation.mutate({ workspaceId, projectId });
  };

  return (
    <>
      <div>Are you sure?</div>
      <div className="flex flex-row gap-x-2 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setIsDeleteProjectFormDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteConfirmation}>
          Confirm
        </Button>
      </div>
    </>
  );
}

function DeletePageForm({
  workspaceId,
  projectId,
  pageId,
  setIsDeletePageFormDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
  setIsDeletePageFormDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const createAccordMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
    }) => deletePageInProjectWorkspace(workspaceId, projectId, pageId),
    onSuccess: () => {
      setIsDeletePageFormDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const handleDeleteConfirmation = () => {
    createAccordMutation.mutate({ workspaceId, projectId, pageId });
  };

  return (
    <>
      <div>Are you sure?</div>
      <div className="flex flex-row gap-x-2 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setIsDeletePageFormDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteConfirmation}>
          Confirm
        </Button>
      </div>
    </>
  );
}
