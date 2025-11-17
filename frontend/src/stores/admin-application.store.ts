import { create } from "zustand";
import Application from "@/types/Application";
import UserService from "@/services/application.service";
import useLoadingStore from "./loading.store";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface ApplicationState {
    applications: Array<Application> | null;
    applicationDetail: Application | null;
    findAll: () => Promise<void>;
    findById: (id: string) => Promise<void | null>;
    setApplicationDetail: (application: Application) => void;
}

const useAdminApplicationStore = create<ApplicationState>((set) => ({
    applications: null,
    applicationDetail: null,

    findAll: async () => {
        showLoading();
        const result = await UserService.findAll();
        set({ applications: result });
        hideLoading();
    },

    findById: async (id: string) => {
        showLoading();
        const result = await UserService.findById(id);
        set({ applicationDetail: result });
        hideLoading();
    },

    setApplicationDetail: (application: Application) => {
        showLoading();
        set({ applicationDetail: application });
        hideLoading();
    },
}));

export default useAdminApplicationStore;
