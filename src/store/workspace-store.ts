import { SidebarWorkspaceSchema, UserSchema } from "@/types/api/user";
import { create } from "zustand";

type WorkspaceState = {
  currentUser: UserSchema;
  isWorkspaceDataLoading: boolean;
  workspaces: SidebarWorkspaceSchema[];
  currentWorkspace: SidebarWorkspaceSchema | undefined;
  currentProjectName: string | undefined;

  setCurrentUser: (currentUser: UserSchema) => void;
  setIsWorkspaceDataLoading: (flag: boolean) => void;
  setWorkspaces: (workspaces: SidebarWorkspaceSchema[]) => void;
  setCurrentWorkspace: (workspace: SidebarWorkspaceSchema | undefined) => void;
  setCurrentProjectName: (projectname: string | undefined) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentUser: {
    id: "",
    fullName: "",
    email: "",
  },
  setCurrentUser: (currentUser: UserSchema) => {
    set({ currentUser });
  },
  isWorkspaceDataLoading: true,
  workspaces: [],
  currentWorkspace: undefined,
  currentProjectName: undefined,
  setIsWorkspaceDataLoading: (flag: boolean) =>
    set({ isWorkspaceDataLoading: flag }),
  setCurrentWorkspace: (workspace: SidebarWorkspaceSchema | undefined) =>
    set({ currentWorkspace: workspace }),
  setCurrentProjectName: (currentProjectName: string | undefined) =>
    set({ currentProjectName }),
  setWorkspaces: (workspaces: SidebarWorkspaceSchema[]) => set({ workspaces }),
}));

export default useWorkspaceStore;
