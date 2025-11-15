import { create } from "zustand";
import UserService from "@/services/user.service";

interface User {
    username: string;
    email: string;
    phone: string;
    fullName: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: false,
    error: null,

    login: async (username: string, password: string) => {
        set({ loading: true, error: null });
        const userData = await UserService.login(username, password);
        set({ user: userData, loading: false });
    },

    logout: () => set({ user: null, loading: false, error: null }),
}));

export default useUserStore;
