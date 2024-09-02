import axios from "axios";
import { create } from "zustand";
import { Issue } from "../types/Issue";

export type ServerAPI = {
  loading: boolean;
  loadCount: number;
  issues: Issue[];
  createIssue: (issue: Partial<Issue>) => Promise<void>;
  updateIssue: (id:number|string, issue: Partial<Issue>) => Promise<void>;
  deleteIssue: (id: string | number) => Promise<void>;
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
    updateIssue: async (id: string | number, issueUpdate:Partial<Issue>) => {
      try {
        const { status, issue } = (await axios.put<{ issue: Issue; status: string }>(`/api/issues/${id}`, issueUpdate)).data;
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
    deleteIssue: async (id: string | number) => {
      try {
        const { status, issue } = (await axios.delete<{ issue: Issue; status: string }>(`/api/issues/${id}`)).data;
        if (status == "success") {
          const { issues } = getState();
          set({ issues: [...issues.filter((i) => i.id != issue.id)] });
        }
      } catch (e: unknown) {
        console.log(e);
      } finally {
        set({ loading: false });
      }
    },
    createIssue: async (issue: Partial<Issue>) => {
      try {
        const { status, issue: newIssue } = (await axios.post<{ issue: Issue; status: string }>(`/api/issues`, issue)).data;
        if (status == "success") {
          const { issues } = getState();
          set({ issues: [...issues.filter((i) => i.id != newIssue.id), newIssue] });
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

          if (status == "success") {
            set((prev) => ({ ...prev, issues, loadCount: loadCount + 1 }));
          }
        } catch (e: unknown) {
          console.log(e);
        } finally {
          set({ loading: false });
        }
    },
  };
});
