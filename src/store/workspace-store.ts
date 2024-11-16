import { WorkspaceSchema } from "@/types/api/user";
import { create } from "zustand";

type WorkspaceState = {
  isWorkspaceDataLoading: boolean;
  setIsWorkspaceDataLoading: (flag: boolean) => void;
  workspaces: WorkspaceSchema[];
  setWorkspaces: (workspaces: WorkspaceSchema[]) => void;
  currentWorkspace: WorkspaceSchema | undefined;
  setCurrentWorkspace: (workspace: WorkspaceSchema) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isWorkspaceDataLoading: true,
  workspaces: [],
  currentWorkspace: undefined,
  setIsWorkspaceDataLoading: (flag: boolean) =>
    set({ isWorkspaceDataLoading: flag }),
  setCurrentWorkspace: (workspace: WorkspaceSchema | undefined) =>
    set({ currentWorkspace: workspace }),
  setWorkspaces: (workspaces: WorkspaceSchema[]) => set({ workspaces }),
}));

export default useWorkspaceStore;
