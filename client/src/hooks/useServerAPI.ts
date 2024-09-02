import axios from "axios";
import { create } from "zustand";
import { Issue } from "../types/Issue";

export type ServerAPI = {
  loading: boolean;
  loadCount: number;
  issues: Issue[];
  getIssueById: (id: string) => Promise<void>;
  getIssues: (force?: true) => Promise<void>;
};

export const useServerAPI = create<ServerAPI>((set, getState) => {
  return {
    loading: false,
    loadCount: 0,
    issues: [],
    activeIssueId: null,
    getIssueById: async (id: string) => {
      try {
        const { status, issue } = (await axios.get<{ issue: Issue; status: string }>(`/api/issues/${id}`)).data;
        if (status == "success") {
          const { issues } = getState();
          set({ issues: [...issues.filter((i) => i.id != issue.id), issue] });
        }
      } catch (e: unknown) {
        console.log(e);
      } finally {
        set({ loading: false });
      }
    },
    getIssues: async (force: boolean = false) => {
      const { loadCount } = getState();
      if (loadCount > 0 || !force)
        try {
          const { status, issues } = (await axios.get<{ issues: Issue[]; status: string }>(`/api/issues`)).data;

          console.log(status, issues);
          if (status == "success") {
            set((prev) => ({ ...prev, issues }));
          }
        } catch (e: unknown) {
          console.log(e);
        } finally {
          set({ loading: false });
        }
    },
  };
});
