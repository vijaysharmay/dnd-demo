import {
  createProjectInWorkspace,
  CreateProjectRequestSchema,
  CreateProjectRequestZSchema,
  createWorkspace,
  CreateWorkspaceRequestSchema,
  CreateWorkspaceRequestZSchema,
} from "@/api";
import { getUser, getUsers } from "@/api/user";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import useAccordStore from "@/store/accord-store";
import useWorkspaceStore from "@/store/workspace-store";
import { SidebarWorkspaceSchema } from "@/types/api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { find, findIndex, map } from "lodash";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "wouter";
import { navigate } from "wouter/use-browser-location";

import { AutoComplete } from "./autocomplete";

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();

  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] =
    useState(false);

  const [isCreateWorkspaceDialogOpen, setIsCreateWorkspaceDialogOpen] =
    useState(false);

  const { workspaceId, projectId, pageId } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["getCurrentUser"],
    queryFn: getUser,
  });

  type WorkspaceMember = {
    memberId: string;
    role: string;
  };

  const [searchValue, setSearchValue] = useState<string>("");
  // const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<WorkspaceMember[]>([]);
  const [newMember, setNewMember] = useState<WorkspaceMember | null>(null);
  const [usersForSearch, setUsersForSearch] = useState<
    {
      value: string;
      label: string;
    }[]
  >();

  const { data: users, isLoading } = useQuery({
    queryKey: ["getUserList", searchValue],
    queryFn: () => getUsers(searchValue),
  });

  const roles = ["ADMIN", "DESIGNER", "DEVELOPER"];
  const [activeRole, setActiveRole] = useState("");

  const {
    workspaces,
    setCurrentUser,
    setWorkspaces,
    currentWorkspace,
    setCurrentWorkspace,
    isWorkspaceDataLoading,
    setIsWorkspaceDataLoading,
    setCurrentProject,
    currentProject,
    setCurrentPage,
  } = useWorkspaceStore();

  const { setAccords } = useAccordStore();

  useEffect(() => {
    if (data) {
      setCurrentUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
      });
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

      if (projectId && currentWorkspace) {
        const currentProjectFromRouteParams = find(currentWorkspace.projects, [
          "id",
          projectId,
        ]);
        if (currentProjectFromRouteParams) {
          setCurrentProject(currentProjectFromRouteParams);
          setAccords(currentProjectFromRouteParams.accords);

          if (pageId) {
            const currentPageFromRouteParams = find(
              currentProjectFromRouteParams.pages,
              ["id", pageId]
            );
            if (currentPageFromRouteParams) {
              setCurrentPage(currentPageFromRouteParams);
            }
          }
        }
      }

      if (users) {
        const items = users
          .filter((x) => x.id !== data.id)
          .map((x) => {
            return {
              value: `${x.id}|${x.fullName}|${x.email}`,
              label: x.fullName,
            };
          });
        setUsersForSearch(items);
      }
    }
  }, [
    currentWorkspace,
    data,
    isPending,
    projectId,
    setAccords,
    setCurrentProject,
    setCurrentUser,
    setCurrentWorkspace,
    setIsWorkspaceDataLoading,
    setWorkspaces,
    users,
    workspaceId,
  ]);

  const createWorkspaceForm = useForm<CreateWorkspaceRequestSchema>({
    resolver: zodResolver(CreateWorkspaceRequestZSchema),
    values: {
      name: "",
      route: "",
      members: [],
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

  const onCreateWorkspaceFormSubmit = (
    values: CreateWorkspaceRequestSchema
  ) => {
    if (!currentWorkspace) {
      throw new Error("Workspace ID is required to create a project");
    }
    const members = values.members.map((member) => {
      return {
        memberId: member.memberId.split("|")[0],
        role: member.role,
      };
    });
    createWorkspaceMutation.mutate({
      ...values,
      members,
    });
  };

  const onCreateProjectFormSubmit = (values: CreateProjectRequestSchema) => {
    if (!currentWorkspace) {
      throw new Error("Workspace ID is required to create a project");
    }
    createProjectMutation.mutate({ workspaceId: currentWorkspace?.id, values });
  };

  if (error) return "An error has occurred: " + error.message;

  const handleWorkspaceChange = (workspace: SidebarWorkspaceSchema) => {
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
                            <FormField
                              control={createWorkspaceForm.control}
                              name="members"
                              render={({ field }) => {
                                const addMember = () => {
                                  if (newMember) {
                                    const newMemberIndex = findIndex(
                                      selectedMembers,
                                      (x) => {
                                        return (
                                          newMember.memberId.split("|")[0] ===
                                          x.memberId.split("|")[0]
                                        );
                                      }
                                    );

                                    if (newMemberIndex < 0) {
                                      setSelectedMembers([
                                        ...selectedMembers,
                                        newMember,
                                      ]);
                                    } else {
                                      setSelectedMembers([
                                        ...selectedMembers.splice(
                                          newMemberIndex,
                                          1,
                                          newMember
                                        ),
                                      ]);
                                    }
                                    setSearchValue("");
                                    setActiveRole("");
                                    setNewMember(null); // Reset new member input
                                    field.onChange([
                                      ...selectedMembers,
                                      newMember,
                                    ]); // Update form state
                                  }
                                };

                                const removeMember = (index: number) => {
                                  const updatedMembers = selectedMembers.filter(
                                    (_, i) => i !== index
                                  );
                                  setSelectedMembers(updatedMembers);
                                  field.onChange(updatedMembers); // Update form state
                                };

                                return (
                                  <FormItem>
                                    <FormLabel>Members (Optional)</FormLabel>
                                    <div className="space-y-2">
                                      {/* Add New Member Section */}
                                      <div className="flex gap-2 items-center">
                                        <div className="w-1/2">
                                          <AutoComplete
                                            selectedValue={
                                              newMember?.memberId || ""
                                            }
                                            onSelectedValueChange={(memberId) =>
                                              setNewMember({
                                                memberId,
                                                role:
                                                  newMember?.role || "DESIGNER",
                                              })
                                            }
                                            searchValue={searchValue}
                                            onSearchValueChange={setSearchValue}
                                            items={usersForSearch ?? []}
                                            isLoading={isLoading}
                                            placeholder="Search users..."
                                          />
                                        </div>
                                        <Select
                                          onValueChange={(role: string) => {
                                            setNewMember({
                                              memberId:
                                                newMember?.memberId || "",
                                              role,
                                            });
                                            setActiveRole(role);
                                          }}
                                          value={activeRole}
                                        >
                                          <SelectTrigger className="w-1/2">
                                            <SelectValue placeholder="Select a role" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              {roles.map((role: string) => (
                                                <SelectItem
                                                  key={role}
                                                  value={role}
                                                >
                                                  {role}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                        <Button
                                          onClick={addMember}
                                          disabled={
                                            !newMember?.memberId ||
                                            !newMember?.role
                                          }
                                        >
                                          Add
                                        </Button>
                                      </div>

                                      <hr className="" />
                                      {/* List of Selected Members */}
                                      <ul className="space-y-1">
                                        {selectedMembers.map(
                                          (member, index) => (
                                            <li
                                              key={index}
                                              className="flex gap-2 items-center"
                                            >
                                              <div>
                                                {member.memberId.split("|")[1]}
                                              </div>
                                              <div>({member.role})</div>
                                              <Button
                                                variant="ghost"
                                                className="ml-auto"
                                                size="sm"
                                                onClick={() =>
                                                  removeMember(index)
                                                }
                                              >
                                                <Trash2 />
                                              </Button>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                );
                              }}
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
