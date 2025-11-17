import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import UserService from "@/services/user.service";
import useLoadingStore from "./loading.store";
import User from "@/types/User";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface UserState {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,

            login: async (username: string, password: string) => {
                try {
                    showLoading();
                    const userData = await UserService.login(username, password);
                    if (userData) set({ user: userData });
                } finally {
                    hideLoading();
                }
            },

            logout: async () => {
                try {
                    showLoading();
                    await UserService.logout();
                    set({ user: null });
                } finally {
                    hideLoading();
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
