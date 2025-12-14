"use client";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import Breadcrumb from "@/components/Breadcrumb";
import ChangeInfo from "./components/ChangeInfo";
import ChangePassword from "./components/ChangePassword";
import useUserStore from "@/stores/user.store";

const Account = () => {
    const logout = useUserStore((state) => state.logout);
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await logout();
            router.push("/admin/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="admin-page-layout-default">
            <div className="admin-page-first-container-default">
                <Breadcrumb items={[{ label: "Thông tin tài khoản" }]} />
                <button
                    className="flex items-center gap-2 rounded-md 
								button-default text-default transition-default
								bg-secondary-red-light hover:bg-secondary-red-light-extra text-secondary-red-dark hover:text-secondary-red-dark-extra
								bp4:hidden"
                    onClick={handleLogout}>
                    <HiOutlineArrowLeftOnRectangle className="icon-default" />
                    Đăng xuất
                </button>
            </div>
            <div className="flex flex-col bp3:flex-row bp4:flex-col bp4x:flex-row h-fit gap-4">
                <ChangeInfo />
                <ChangePassword />
            </div>
        </div>
    );
};

export default Account;
