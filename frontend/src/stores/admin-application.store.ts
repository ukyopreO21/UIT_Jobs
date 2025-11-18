import { create } from "zustand";
import Application from "@/types/Application";
import UserService from "@/services/application.service";
import useLoadingStore from "./loading.store";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface quantityPerStatus {
    [key: string]: number;
}

interface Faculty {
    name: string;
    disciplines?: string[];
}

interface AvailableFilterValues {
    positions: string[];
    faculties: Faculty[];
}

interface ApplicationState {
    applications: Array<Application> | null;
    applicationDetail: Application | null;
    quantityPerStatus: quantityPerStatus;
    availableFilterValues: AvailableFilterValues;

    searchValue: string;
    fields: {
        status?: string;
        positions?: string[];
        filters?: FilterGroup[];
        startDate?: string;
        endDate?: string;
        [key: string]: any;
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
}

interface FilterGroup {
    faculty: string;
    disciplines: string[];
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
    availableFilterValues: {
        positions: [],
        faculties: [],
    },
    searchValue: "",
    fields: {
        status: "Đã ghi nhận",
        filters: [],
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
        set({ resultPerPage: num, currentPage: 1 });
        get().findByFields();
    },

    setCurrentPage: (num: number) => {
        if (num < 1 || num > get().totalPages || num === get().currentPage) return;
        set({ currentPage: num });
        get().findByFields();
    },

    findById: async (id: string) => {
        showLoading();
        const result = await UserService.findById(id);
        set({ applicationDetail: result });
        hideLoading();
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
            const result = await UserService.findByFields(data);
            set({
                applications: result.data,
                totalPages: result.pagination.totalPages,
                quantityPerStatus: result.quantityPerStatus,
                availableFilterValues: {
                    positions: result.positions || [],
                    faculties: result.faculties || [],
                },
            });
        } catch (error) {
        } finally {
            hideLoading();
        }
    },
}));

export default useAdminApplicationStore;
