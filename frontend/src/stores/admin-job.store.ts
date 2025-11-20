import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import Job from "@/types/Job";
import JobService from "@/services/job.service";
import useAvailableFiltersStore from "./available-filters.store";
import useLoadingStore from "./loading.store";

const { showLoading, hideLoading } = useLoadingStore.getState();
const { setAvailableFilterValues } = useAvailableFiltersStore.getState();

interface FilterGroup {
    faculty: string;
    disciplines: string[];
}

interface JobState {
    jobs: Array<Job> | null;
    jobDetail: Job | null;

    searchValue: string;
    fields: {
        positions?: string[];
        filters?: FilterGroup[];
        startDate?: string;
        endDate?: string;
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

    isFieldsEmpty: () => boolean;
    updateById: (data: Object) => Promise<void>;
    create: (data: Object) => Promise<void>;
}

const useAdminJobStore = create<JobState>((set, get) => ({
    jobs: null,
    jobDetail: null,
    searchValue: "",
    fields: {
        filters: [],
    },
    resultPerPage: 10,
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
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Lấy thông tin việc làm thất bại. Vui lòng thử lại sau.");
        } finally {
            hideLoading();
        }
    },

    findByFields: async () => {
        try {
            showLoading();
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
            setAvailableFilterValues(result.positions || [], result.faculties || []);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Tìm kiếm việc làm thất bại. Vui lòng thử lại.");
        } finally {
            hideLoading();
        }
    },

    isFieldsEmpty: () => {
        const fields = get().fields;
        return (
            (!fields.filters || fields.filters.length === 0) &&
            (!fields.positions || fields.positions.length === 0) &&
            (!fields.startDate || fields.startDate === "") &&
            (!fields.endDate || fields.endDate === "")
        );
    },

    updateById: async (job: Object) => {
        try {
            showLoading();
            const data = { id: get().jobDetail?.id, ...job };
            await JobService.updateById(data);
            set({ jobDetail: { ...get().jobDetail, ...job } as Job });
            toast.success("Cập nhật việc làm thành công.");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Cập nhật việc làm thất bại. Vui lòng thử lại.");
        } finally {
            hideLoading();
        }
    },

    create: async (job: Object) => {
        try {
            showLoading();
            await JobService.create(job);
            toast.success("Thêm việc làm thành công.");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Thêm việc làm thất bại. Vui lòng thử lại.");
        } finally {
            hideLoading();
        }
    },
}));

export default useAdminJobStore;
