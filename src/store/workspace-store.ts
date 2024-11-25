import { SidebarWorkspaceSchema, UserSchema } from "@/types/api/user";
import { create } from "zustand";

type WorkspaceState = {
  currentUser: UserSchema;
  setCurrentUser: (currentUser: UserSchema) => void;
  isWorkspaceDataLoading: boolean;
  setIsWorkspaceDataLoading: (flag: boolean) => void;
  workspaces: SidebarWorkspaceSchema[];
  setWorkspaces: (workspaces: SidebarWorkspaceSchema[]) => void;
  currentWorkspace: SidebarWorkspaceSchema | undefined;
  setCurrentWorkspace: (workspace: SidebarWorkspaceSchema | undefined) => void;
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
  setIsWorkspaceDataLoading: (flag: boolean) =>
    set({ isWorkspaceDataLoading: flag }),
  setCurrentWorkspace: (workspace: SidebarWorkspaceSchema | undefined) =>
    set({ currentWorkspace: workspace }),
  setWorkspaces: (workspaces: SidebarWorkspaceSchema[]) => set({ workspaces }),
}));

export default useWorkspaceStore;
