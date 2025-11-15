import { ReactNode } from "react";
import ManageMenu from "./menu";
import UserButton from "./user-button";

const ManageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-screen h-screen flex">
            <div className="w-fit h-full bg-white p-4 flex flex-col gap-12 border-r border-[#e7e7e8]">
                <div className="font-bold text-[24px] text-center font-[montserrat]">UIT Jobs</div>
                <ManageMenu />
                <UserButton />
            </div>
            <div className="flex-1 p-4 bg-[#f6f6f6]">{children}</div>
        </div>
    );
};

export default ManageLayout;
