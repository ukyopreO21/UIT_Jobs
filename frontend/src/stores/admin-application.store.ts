import { create } from "zustand";
import toast from "react-hot-toast";
import Application from "@/types/Application";
import ApplicationService from "@/services/application.service";
import useLoadingStore from "./loading.store";
import handleError from "@/utils/handle-error";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface quantityPerStatus {
    [key: string]: number;
}

interface ApplicationState {
    applications: Array<Application> | null;
    applicationDetail: Application | null;
    quantityPerStatus: quantityPerStatus;
    searchValue: string;
    positions: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    subDepartments: { id: number; name: string; department_id: number; is_general: boolean }[];
    fields: {
        positions?: any[];
        subDepartments?: any[];
        startDate?: string;
        endDate?: string;
        status: string;
    };
    resultPerPage: number;
    currentPage: number;
    totalPages: number;

    setApplicationDetail: (application: Application) => void;
    setSearchValue: (value: string) => void;
    setFields: (fields: Object) => void;
    setResultPerPage: (num: number) => void;
    setCurrentPage: (num: number) => void;
    findById: (id: string) => Promise<void>;
    findByFields: () => Promise<void>;
    isFieldsEmpty: () => boolean;
    updateById: (status: string) => Promise<void>;
}

const useAdminApplicationStore = create<ApplicationState>((set, get) => ({
    applications: null,
    applicationDetail: null,
    quantityPerStatus: {
        "Đã ghi nhận": 0,
        "Đang phỏng vấn": 0,
        "Được tuyển dụng": 0,
        "Bị từ chối": 0,
    },
    searchValue: "",
    positions: [],
    departments: [],
    subDepartments: [],
    fields: {
        status: "Đã ghi nhận",
    },
    resultPerPage: 10,
    currentPage: 1,
    totalPages: 1,

    setApplicationDetail: (application: Application) => {
        set({ applicationDetail: application });
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
        if (num === get().resultPerPage) return;
        set({ resultPerPage: num, currentPage: 1 });
        get().findByFields();
    },

    setCurrentPage: (num: number) => {
        if (num < 1 || num > get().totalPages || num === get().currentPage) return;
        set({ currentPage: num });
        get().findByFields();
    },

    findById: async (id: string) => {
        try {
            showLoading();
            const result = await ApplicationService.findById(id);
            set({ applicationDetail: result });
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
            const result = await ApplicationService.findByFields(data);
            set({
                applications: result.data,
                totalPages: result.pagination.totalPages,
                quantityPerStatus: result.quantityPerStatus,
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

    updateById: async (status: string) => {
        try {
            showLoading();
            const data = { status, id: get().applicationDetail?.id };
            await ApplicationService.updateById(data);
            set({ applicationDetail: { ...get().applicationDetail, status } as Application });
            toast.success(`Cập nhật trạng thái hồ sơ ${data.id} thành công.`);
        } catch (error: unknown) {
            handleError(error);
        } finally {
            hideLoading();
        }
    },
}));

export default useAdminApplicationStore;
