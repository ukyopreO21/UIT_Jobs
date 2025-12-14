import { create } from "zustand";
import toast from "react-hot-toast";
import { Job, JobCreate, JobUpdate } from "@/types/Job";
import JobService from "@/services/job.service";
import useLoadingStore from "./loading.store";
import { formatDateToISOWithOffset } from "@/utils/format-date";
import handleError from "@/utils/handle-error";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface JobState {
    jobs: Array<Job> | null;
    jobDetail: Job | null;
    searchValue: string;
    positions: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    subDepartments: { id: number; name: string; department_id: number; is_general: boolean }[];
    fields: {
        positions?: string[];
        subDepartments?: string[];
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
    updateById: (data: JobUpdate) => Promise<void>;
    create: (data: JobCreate) => Promise<void>;
}

const useAdminJobStore = create<JobState>((set, get) => ({
    jobs: null,
    jobDetail: null,
    searchValue: "",
    positions: [],
    departments: [],
    subDepartments: [],
    fields: {},
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
            handleError(error);
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
                positions: result.positions,
                subDepartments: result.subDepartments.map((sd: any) => ({
                    id: sd.id,
                    name: sd.name,
                    department_id: sd.department_id,
                    is_general: sd.is_general,
                })),
                departments: Array.from(
                    new Map<number, { id: number; name: string }>(
                        result.subDepartments.map((sd: any) => [
                            sd.department_id,
                            { id: sd.department_id, name: sd.department_name },
                        ])
                    ).values()
                ),
            });
        } catch (error: unknown) {
            handleError(error);
        } finally {
            hideLoading();
        }
    },

    isFieldsEmpty: () => {
        const fields = get().fields;
        return (
            (!fields.positions || fields.positions.length === 0) &&
            (!fields.subDepartments || fields.subDepartments.length === 0) &&
            (!fields.startDate || fields.startDate === "") &&
            (!fields.endDate || fields.endDate === "")
        );
    },

    updateById: async (job: JobUpdate) => {
        try {
            showLoading();
            const payload = {
                ...job,
                deadline: job.deadline ? formatDateToISOWithOffset(job.deadline) : "",
                quantity: Number(job.quantity),
                salary_min: job.salary_min ? Number(job.salary_min) : null,
                salary_max: job.salary_max ? Number(job.salary_max) : null,
            };
            const data = { id: get().jobDetail?.id, ...payload };
            await JobService.updateById(data);
            set({ jobDetail: { ...get().jobDetail, ...payload } as Job });
            toast.success("Cập nhật việc làm thành công.");
        } catch (error: unknown) {
            handleError(error);
        } finally {
            hideLoading();
        }
    },

    create: async (job: JobCreate) => {
        try {
            showLoading();
            const payload = {
                ...job,
                deadline: job.deadline ? formatDateToISOWithOffset(job.deadline) : "",
                quantity: Number(job.quantity),
                salary_min: job.salary_min ? Number(job.salary_min) : null,
                salary_max: job.salary_max ? Number(job.salary_max) : null,
            };
            await JobService.create(payload);
            toast.success("Thêm việc làm thành công.");
        } catch (error: unknown) {
            handleError(error);
        } finally {
            hideLoading();
        }
    },
}));

export default useAdminJobStore;
