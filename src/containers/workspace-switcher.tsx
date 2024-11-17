import { Check, ChevronsUpDown, Plus } from "lucide-react";

import {
  createProjectInWorkspace,
  CreateProjectRequestSchema,
  CreateProjectRequestZSchema,
  createWorkspace,
  CreateWorkspaceRequestSchema,
  CreateWorkspaceRequestZSchema,
} from "@/api";
import { getUser } from "@/api/user";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import useWorkspaceStore from "@/store/workspace-store";
import { WorkspaceSchema } from "@/types/api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { find, map } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "wouter";
import { navigate } from "wouter/use-browser-location";

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();

  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);

  const [isCreateWorkspaceDialogOpen, setIsCreateWorkspaceDialogOpen] =
    useState(false);

  const { workspaceId } = useParams();

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

      if (workspaceId) {
        const currentWorkspaceFromRouteParams = find(data.workspaces, [
          "workspace.id",
          workspaceId,
        ]);
        if (currentWorkspaceFromRouteParams) {
          setCurrentWorkspace(currentWorkspaceFromRouteParams.workspace);
        }
      } else if (currentWorkspace) {
        setCurrentWorkspace(currentWorkspace);
      } else {
        setCurrentWorkspace(data.userWorkspace);
      }
    }
  }, [
    currentWorkspace,
    data,
    isPending,
    setCurrentWorkspace,
    setIsWorkspaceDataLoading,
    setWorkspaces,
    workspaceId,
  ]);

  const createWorkspaceForm = useForm<CreateWorkspaceRequestSchema>({
    resolver: zodResolver(CreateWorkspaceRequestZSchema),
    values: {
      name: "",
      route: "",
    },
  });

  const createProjectForm = useForm<CreateProjectRequestSchema>({
    resolver: zodResolver(CreateProjectRequestZSchema),
    values: {
      name: "",
      route: "",
    },
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      setIsCreateWorkspaceDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      values,
    }: {
      workspaceId: string;
      values: CreateProjectRequestSchema;
    }) => createProjectInWorkspace(workspaceId, values),
    onSuccess: () => {
      setIsCreateProjectDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const onCreateWorkspaceFormSubmit = (values: CreateProjectRequestSchema) => {
    if (!currentWorkspace) {
      throw new Error("Workspace ID is required to create a project");
    }
    createWorkspaceMutation.mutate(values);
  };

  const onCreateProjectFormSubmit = (values: CreateProjectRequestSchema) => {
    if (!currentWorkspace) {
      throw new Error("Workspace ID is required to create a project");
    }
    createProjectMutation.mutate({ workspaceId: currentWorkspace?.id, values });
  };

  if (error) return "An error has occurred: " + error.message;

  const handleWorkspaceChange = (workspace: WorkspaceSchema) => {
    setCurrentWorkspace(workspace);
    navigate(`/workspace/${workspace.id}`, { replace: true });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="-ml-2">Workspaces</SidebarGroupLabel>
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
                        onClick={() => handleWorkspaceChange(workspace)}
                        className="gap-2 p-2"
                      >
                        {workspace.name}
                        {workspace.id === currentWorkspace?.id && (
                          <Check className="stroke-green-600" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <Dialog
                      open={isCreateWorkspaceDialogOpen}
                      onOpenChange={setIsCreateWorkspaceDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          className="gap-2 p-2"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                            <Plus className="size-4" />
                          </div>
                          <div className="font-medium text-muted-foreground">
                            Create Workspace
                          </div>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Workspace</DialogTitle>
                        </DialogHeader>
                        <DialogDescription></DialogDescription>
                        <Form {...createWorkspaceForm}>
                          <form
                            onSubmit={createWorkspaceForm.handleSubmit(
                              onCreateWorkspaceFormSubmit
                            )}
                            className="space-y-4"
                          >
                            <FormField
                              control={createWorkspaceForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Workspace Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter a workspace name"
                                      className={cn(
                                        createWorkspaceForm.formState.errors[
                                          "name"
                                        ] && "bg-red-50"
                                      )}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={createWorkspaceForm.control}
                              name="route"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Workspace Route</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter a workspace route"
                                      className={cn(
                                        createWorkspaceForm.formState.errors[
                                          "route"
                                        ] && "bg-red-50"
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
                                Create Workspace
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={isCreateProjectDialogOpen}
                      onOpenChange={setIsCreateProjectDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          className="gap-2 p-2"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <>
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                              <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                              Create Project
                            </div>
                          </>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Project In Workspace</DialogTitle>
                        </DialogHeader>
                        <DialogDescription></DialogDescription>
                        <Form {...createProjectForm}>
                          <form
                            onSubmit={createProjectForm.handleSubmit(
                              onCreateProjectFormSubmit
                            )}
                            className="space-y-4"
                          >
                            <FormField
                              control={createProjectForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter a project name"
                                      className={cn(
                                        createProjectForm.formState.errors[
                                          "name"
                                        ] && "bg-red-50"
                                      )}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={createProjectForm.control}
                              name="route"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project Route</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter a project route"
                                      className={cn(
                                        createProjectForm.formState.errors[
                                          "route"
                                        ] && "bg-red-50"
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
                                Create Project
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
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
