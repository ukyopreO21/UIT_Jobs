"use client";

import useUserStore from "@/stores/user.store";
import User from "@/types/User";
import { ReactNode } from "react";
import ManageMenu from "./components/ManageMenu";
import ManageUserButton from "./components/ManageUserButton";

export default function ManageLayout({ children }: { children: ReactNode }) {
    const user = useUserStore((state) => state.user) as User | null;

    return (
        <div className="w-screen h-screen flex">
            <div className="w-fit h-full bg-white p-4 flex flex-col gap-12 border-r border-[#e7e7e8]">
                <div className="font-bold text-[24px] text-center font-[montserrat]">UIT Jobs</div>
                <ManageMenu />
                <ManageUserButton user={user} />
            </div>

            <div className="relative flex-1 p-4 bg-[#f6f6f6]">{children}</div>
        </div>
    );
}
