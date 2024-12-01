import {
  SidebarPageSchema,
  SidebarProjectSchema,
  SidebarWorkspaceSchema,
  UserSchema,
} from "@/types/api/user";
import { create } from "zustand";

type WorkspaceState = {
  currentUser: UserSchema;
  isWorkspaceDataLoading: boolean;
  workspaces: SidebarWorkspaceSchema[];
  currentWorkspace: SidebarWorkspaceSchema | undefined;
  currentProject: SidebarProjectSchema | undefined;
  currentPage: SidebarPageSchema | undefined;

  setCurrentUser: (currentUser: UserSchema) => void;
  setIsWorkspaceDataLoading: (flag: boolean) => void;
  setWorkspaces: (workspaces: SidebarWorkspaceSchema[]) => void;
  setCurrentWorkspace: (workspace: SidebarWorkspaceSchema | undefined) => void;
  setCurrentProject: (project: SidebarProjectSchema | undefined) => void;
  setCurrentPage: (page: SidebarPageSchema | undefined) => void;
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
  currentProject: undefined,
  currentPage: undefined,
  setIsWorkspaceDataLoading: (flag: boolean) =>
    set({ isWorkspaceDataLoading: flag }),
  setCurrentWorkspace: (workspace: SidebarWorkspaceSchema | undefined) =>
    set({ currentWorkspace: workspace }),
  setCurrentProject: (currentProject: SidebarProjectSchema | undefined) =>
    set({ currentProject }),
  setCurrentPage: (currentPage: SidebarPageSchema | undefined) =>
    set({ currentPage }),
  setWorkspaces: (workspaces: SidebarWorkspaceSchema[]) => set({ workspaces }),
}));

export default useWorkspaceStore;
