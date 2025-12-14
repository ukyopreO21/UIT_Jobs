import { create } from "zustand";
import { Job } from "@/types/Job";
import JobService from "@/services/job.service";
import useLoadingStore from "./loading.store";
import handleError from "@/utils/handle-error";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface JobState {
    jobs: Array<Job> | null;
    jobDetail: Job | null;

    searchValue: string;
    fields: {
        positions?: any[];
        subDepartments?: any[];
        minSalary?: number;
        maxSalary?: number;
        startDate?: string;
        endDate?: string;
        type?: string;
    };
    resultPerPage: number;
    currentPage: number;
    totalPages: number;

    setJobDetail: (job: Job) => void;
    setSearchValue: (value: string) => void;
    setFields: (fields: Object) => void;
    setResultPerPage: (num: number) => void;
    setCurrentPage: (num: number) => void;
    findById: (id: number) => Promise<void>;
    findByFields: () => Promise<void>;
}

const usePublicJobStore = create<JobState>((set, get) => ({
    jobs: null,
    jobDetail: null,
    searchValue: "",
    fields: {},
    resultPerPage: 12,
    currentPage: 1,
    totalPages: 1,

    setJobDetail: (job: Job) => {
        set({ jobDetail: job });
    },

    setSearchValue: (value: string) => {
        if (value === get().searchValue) return;
        set({ searchValue: value, currentPage: 1 });
        get().findByFields();
    },

    setFields: (newFields: Record<string, any>) => {
        set({
            fields: { ...get().fields, ...newFields },
            currentPage: 1,
        });
        get().findByFields();
    },

    setResultPerPage: async (num: number) => {
        set({ resultPerPage: num, currentPage: 1 });
        get().findByFields();
    },

    setCurrentPage: (num: number) => {
        if (num < 1 || num > get().totalPages || num === get().currentPage) return;
        set({ currentPage: num });
        get().findByFields();
    },

    findById: async (id: number) => {
        try {
            showLoading();
            const result = await JobService.findById(id);
            set({ jobDetail: result });
        } catch (error: unknown) {
            handleError(error);
        } finally {
            hideLoading();
        }
    },

    findByFields: async () => {
        try {
            const data = {
                ...get().fields,
                searchValue: get().searchValue,
                page: get().currentPage,
                resultPerPage: get().resultPerPage,
            };
            const result = await JobService.findByFields(data);
            set({
                jobs: result.data,
                totalPages: result.pagination.totalPages,
            });
        } catch (error: unknown) {
            handleError(error);
        }
    },
}));

export default usePublicJobStore;
