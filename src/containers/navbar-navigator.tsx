import {
  cloneVersionInProjectWorkspace,
  createPageInProjectWorkspace,
  CreatePageRequestSchema,
  CreatePageRequestZSchema,
  deletePageInProjectWorkspace,
  deleteProjectInWorkspace,
  deleteVersionInProjectWorkspace,
  moveProjectToNewWorkspace,
} from "@/api";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, convertToTree, NodeOptionsItem, Tree } from "@/lib/utils";
import useWorkspaceStore from "@/store/workspace-store";
import { SidebarWorkspaceSchema } from "@/types/api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { startsWith } from "lodash";
import {
  ChevronRight,
  File,
  Folder,
  GitFork,
  Plus,
  Trash2,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";

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
  const [location] = useLocation();
  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuItem className="cursor-pointer hover:bg-sidebar-accent rounded">
        <NodeOptions nodeType={item.type} workspaceId={workspaceId} node={item}>
          <SidebarMenuButton
            isActive={location === item.url}
            onClick={() => {
              window.location.href = item.url;
            }}
          >
            {item.type === "project" && <Folder />}
            {item.type === "page" && <File />}
            {item.type === "version" && <GitFork />}
            <span>{item.name}</span>
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
                {item.type === "project" && <Folder />}
                {item.type === "page" && <File />}
                <div
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = item.url;
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
              {item.type === "project" && <Folder />}
              {item.type === "page" && <File />}
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
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] =
    useState<boolean>(false);
  const [isMoveProjectDialogOpen, setIsMoveProjectDialogOpen] =
    useState<boolean>(false);
  const [isDeletePageFormDialogOpen, setIsDeletePageFormDialogOpen] =
    useState<boolean>(false);
  const [isDeleteProjectFormDialogOpen, setIsDeleteProjectFormDialogOpen] =
    useState<boolean>(false);
  const [isDeleteVersionFormDialogOpen, setIsDeleteVersionFormDialogOpen] =
    useState<boolean>(false);
  const [isCloneVersionFormDialogOpen, setIsCloneVersionFormDialogOpen] =
    useState<boolean>(false);

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
                  setIsDialogOpen={setIsAddPageDialogOpen}
                />
              }
              open={isAddPageDialogOpen}
              onOpenChange={setIsAddPageDialogOpen}
            />
            <NodeOptionsItem
              name="Move Project"
              icon={<Plus className="size-4" />}
              form={
                <MoveProjectForm
                  workspaceId={workspaceId}
                  projectId={node.id}
                  setIsDialogOpen={setIsMoveProjectDialogOpen}
                />
              }
              open={isMoveProjectDialogOpen}
              onOpenChange={setIsMoveProjectDialogOpen}
            />
            <NodeOptionsItem
              name="Delete Project"
              icon={<Trash2 className="size-4" />}
              form={
                <DeleteProjectForm
                  workspaceId={workspaceId}
                  projectId={node.id}
                  setIsDialogOpen={setIsDeleteProjectFormDialogOpen}
                />
              }
              open={isDeleteProjectFormDialogOpen}
              onOpenChange={setIsDeleteProjectFormDialogOpen}
            />
          </>
        )}
        {nodeType === "page" && node.parentId && (
          <>
            <NodeOptionsItem
              name="Delete Page"
              icon={<Trash2 className="size-4" />}
              form={
                <DeletePageForm
                  workspaceId={workspaceId}
                  projectId={node.parentId}
                  pageId={node.id}
                  setIsDialogOpen={setIsDeletePageFormDialogOpen}
                />
              }
              open={isDeletePageFormDialogOpen}
              onOpenChange={setIsDeletePageFormDialogOpen}
            />
          </>
        )}
        {nodeType === "version" && node.parentId && (
          <>
            <NodeOptionsItem
              name="Clone Version"
              icon={<Trash2 className="size-4" />}
              form={
                <CloneVersionForm
                  workspaceId={workspaceId}
                  projectId={node.parentId.split("|")[1]}
                  pageId={node.parentId.split("|")[0]}
                  versionId={node.id}
                  setIsDialogOpen={setIsCloneVersionFormDialogOpen}
                />
              }
              open={isCloneVersionFormDialogOpen}
              onOpenChange={setIsCloneVersionFormDialogOpen}
            />
          </>
        )}
        {nodeType === "version" && node.parentId && node.name !== "main" && (
          <>
            <NodeOptionsItem
              name="Delete Version"
              icon={<Trash2 className="size-4" />}
              form={
                <DeleteVersionForm
                  workspaceId={workspaceId}
                  projectId={node.parentId.split("|")[1]}
                  pageId={node.parentId.split("|")[0]}
                  versionId={node.id}
                  setIsDialogOpen={setIsDeleteVersionFormDialogOpen}
                />
              }
              open={isDeleteVersionFormDialogOpen}
              onOpenChange={setIsDeleteVersionFormDialogOpen}
            />
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

function AddPageForm({
  workspaceId,
  projectId,
  setIsDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
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
      setIsDialogOpen(false);
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

function MoveProjectForm({
  workspaceId,
  projectId,
  setIsDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { workspaces } = useWorkspaceStore();
  const MoveProjectRequestZSchema = z.object({
    newWorkspaceId: z.string().min(1, "New workspace needs to be selected"),
  });

  type MoveProjectRequestSchema = z.infer<typeof MoveProjectRequestZSchema>;
  const moveProjectForm = useForm<MoveProjectRequestSchema>({
    resolver: zodResolver(MoveProjectRequestZSchema),
    values: {
      newWorkspaceId: "",
    },
  });

  const moveProjectMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      newWorkspaceId,
    }: {
      workspaceId: string;
      projectId: string;
      newWorkspaceId: string;
    }) => moveProjectToNewWorkspace(workspaceId, projectId, newWorkspaceId),
    onSuccess: () => {
      setIsDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const onMoveProjectFormSubmit = ({
    newWorkspaceId,
  }: {
    newWorkspaceId: string;
  }) => {
    moveProjectMutation.mutate({ workspaceId, projectId, newWorkspaceId });
  };
  return (
    <Form {...moveProjectForm}>
      <form
        onSubmit={moveProjectForm.handleSubmit(onMoveProjectFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={moveProjectForm.control}
          name="newWorkspaceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workspace to move the project to" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workspaces &&
                    workspaces.map((workspace: SidebarWorkspaceSchema) => {
                      return (
                        !workspace.isUserWorkspace && (
                          <SelectItem key={workspace.id} value={workspace.id}>
                            {workspace.name}
                          </SelectItem>
                        )
                      );
                    })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button className="mt-2" type="submit">
            Move Project
          </Button>
        </div>
      </form>
    </Form>
  );
}

function DeleteProjectForm({
  workspaceId,
  projectId,
  setIsDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
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
      setIsDialogOpen(false);
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
            setIsDialogOpen(false);
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
  setIsDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const deletePageMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
    }) => deletePageInProjectWorkspace(workspaceId, projectId, pageId),
    onSuccess: () => {
      setIsDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const handleDeleteConfirmation = () => {
    deletePageMutation.mutate({ workspaceId, projectId, pageId });
  };

  return (
    <>
      <div>Are you sure?</div>
      <div className="flex flex-row gap-x-2 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setIsDialogOpen(false);
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

function CloneVersionForm({
  workspaceId,
  projectId,
  pageId,
  versionId,
  setIsDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
  versionId: string;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const CloneVersionRequestZSchema = z.object({
    versionName: z.string().min(1, "New workspace needs to be selected"),
  });

  type CloneVersionRequestSchema = z.infer<typeof CloneVersionRequestZSchema>;
  const cloneVersionForm = useForm<CloneVersionRequestSchema>({
    resolver: zodResolver(CloneVersionRequestZSchema),
    values: {
      versionName: "",
    },
  });

  const cloneVersionMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      versionId,
      versionName,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      versionId: string;
      versionName: string;
    }) =>
      cloneVersionInProjectWorkspace(
        workspaceId,
        projectId,
        pageId,
        versionId,
        versionName
      ),
    onSuccess: () => {
      setIsDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const oncloneVersionFormSubmit = ({
    versionName,
  }: {
    versionName: string;
  }) => {
    cloneVersionMutation.mutate({
      workspaceId,
      projectId,
      pageId,
      versionId,
      versionName,
    });
  };

  return (
    <Form {...cloneVersionForm}>
      <form
        onSubmit={cloneVersionForm.handleSubmit(oncloneVersionFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={cloneVersionForm.control}
          name="versionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a version name"
                  className={cn(
                    cloneVersionForm.formState.errors["versionName"] &&
                      "bg-red-50"
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
            Clone
          </Button>
        </div>
      </form>
    </Form>
  );
}

function DeleteVersionForm({
  workspaceId,
  projectId,
  pageId,
  versionId,
  setIsDialogOpen,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
  versionId: string;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const deleteVersionMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      versionId,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      versionId: string;
    }) =>
      deleteVersionInProjectWorkspace(
        workspaceId,
        projectId,
        pageId,
        versionId
      ),
    onSuccess: () => {
      setIsDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const handleDeleteConfirmation = () => {
    deleteVersionMutation.mutate({ workspaceId, projectId, pageId, versionId });
  };

  return (
    <>
      <div>Are you sure?</div>
      <div className="flex flex-row gap-x-2 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setIsDialogOpen(false);
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
