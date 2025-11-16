import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import UserService from "@/services/user.service";

export interface User {
    username: string;
    email: string;
    phone: string;
    full_name: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,

            login: async (username: string, password: string) => {
                set({ loading: true, error: null });
                try {
                    const userData = await UserService.login(username, password);
                    set({ user: userData, loading: false, error: null });
                } catch (err: any) {
                    set({ loading: false, error: err.message || "Lỗi đăng nhập" });
                }
            },

            logout: async () => {
                set({ loading: true, error: null });
                try {
                    await UserService.logout();
                } finally {
                    set({ user: null, loading: false, error: null });
                }
            },
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useUserStore;
