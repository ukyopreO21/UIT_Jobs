import { create } from "zustand";
import UserService from "@/services/application.service";

interface Application {
    username: string;
    email: string;
    phone: string;
    fullName: string;
}

interface ApplicationState {
    applications: Array<Application> | null;
    loading: boolean;
    error: string | null;
    // example of zustand actions
    // login: (username: string, password: string) => Promise<void>;
    // logout: () => void;
    getApplications: () => Promise<void>;
}

const useAdminApplicationStore = create<ApplicationState>((set) => ({
    applications: null,
    loading: false,
    error: null,

    // login: async (username: string, password: string) => {
    //     set({ loading: true, error: null });
    //     const userData = await UserService.login(username, password);
    //     set({ user: userData, loading: false });
    // },

    // logout: () => set({ user: null, loading: false, error: null }),
    getApplications: async () => {
        set({ loading: true, error: null });
        const applicationData = await UserService.getApplications();
        set({ applications: applicationData, loading: false });
    },
}));

export default useAdminApplicationStore;
