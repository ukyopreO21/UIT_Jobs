"use client";

import useUserStore from "@/stores/user.store";
import User from "@/types/User";
import { ReactNode } from "react";
import ManageMenu from "./components/ManageMenu";
import ManageUserButton from "./components/ManageUserButton";
import ManageBottomNavigation from "./components/ManageBottomNavigation";

export default function ManageLayout({ children }: { children: ReactNode }) {
    const user = useUserStore((state) => state.user) as User | null;

    return (
        <div className="w-screen h-dvh flex flex-col lg:flex-row">
            {/* --- SIDEBAR (PC) --- */}
            <div className="w-fit h-full bg-white p-4 flex-col gap-12 border-r border-[#e7e7e8] hidden lg:flex">
                <div className="font-bold text-[24px] text-center font-[montserrat]">UIT Jobs</div>
                <ManageMenu />
                <ManageUserButton user={user} />
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="relative flex-1 p-4 bg-[#f6f6f6] overflow-y-auto">{children}</div>

            {/* --- BOTTOM NAV (MOBILE) --- */}
            <ManageBottomNavigation />
        </div>
    );
}
