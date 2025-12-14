"use client";

import LoadingLink from "@/components/LoadingLink";
import useUserStore from "@/stores/user.store";
import User from "@/types/User";
import { ReactNode } from "react";
import ManageNavigation from "./components/ManageNavigation";
import ManageUserButton from "./components/ManageUserButton";
import ManageBottomNavigation from "./components/ManageBottomNavigation";

export default function ManageLayout({ children }: { children: ReactNode }) {
    const user = useUserStore((state) => state.user) as User | null;

    return (
        <div className="w-screen h-dvh flex flex-col bp4:flex-row">
            {/* --- SIDEBAR (PC) --- */}
            <div className="w-fit h-full bg-white p-4 flex-col gap-12 border-r border-primary-border hidden bp4:flex">
                <LoadingLink
                    href="/admin/manage/dashboard"
                    className="font-bold text-[24px] text-center font-[montserrat]">
                    UIT Jobs
                </LoadingLink>
                <ManageNavigation />
                <ManageUserButton user={user} />
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="relative flex-1 p-4 bg-primary-bg overflow-y-auto">{children}</div>

            {/* --- BOTTOM NAV (MOBILE) --- */}
            <ManageBottomNavigation />
        </div>
    );
}
