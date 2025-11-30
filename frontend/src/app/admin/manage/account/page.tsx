"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import Breadcrumb from "@/components/Breadcrumb";
import UserInput from "./components/UserInput";
import useUserStore from "@/stores/user.store";

const Account = () => {
    const user = useUserStore((state) => state.user);
    const updateInfo = useUserStore((state) => state.updateInfo);
    const changePassword = useUserStore((state) => state.changePassword);
    const logout = useUserStore((state) => state.logout);
    const router = useRouter();

    const [userForm, setUserForm] = useState({
        full_name: "",
        email: "",
        phone: "",
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleResetInfo = () => {
        if (user) {
            setUserForm({
                full_name: user.full_name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    };

    const handleChangeInfo = async () => {
        await updateInfo({
            full_name: userForm.full_name,
            email: userForm.email,
            phone: userForm.phone,
        });
    };

    const handleChangePassword = async () => {
        await changePassword(
            passwordForm.currentPassword,
            passwordForm.newPassword,
            passwordForm.confirmNewPassword
        );
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/admin/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        if (user) {
            setUserForm({
                full_name: user.full_name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="h-10 shrink-0 flex justify-between items-center">
                <Breadcrumb items={[{ label: "Thông tin tài khoản" }]} />
                <button
                    className="flex items-center gap-2 button-responsive rounded-md cursor-pointer bg-red-200/75 text-red-700 lg:hidden"
                    onClick={handleLogout}>
                    <HiOutlineArrowLeftOnRectangle className="icon-responsive" />
                    Đăng xuất
                </button>
            </div>
            <div className="flex flex-col md:flex-row h-fit gap-4">
                <div className="flex-1 flex flex-col h-fit p-4 border border-[#e7e7e8] bg-white rounded-md gap-4">
                    <div className="text-responsive">Thông tin cá nhân</div>
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="w-30 h-30 lg:w-48 lg:h-48 bg-gray-200 rounded-full"></div>
                            <div className="text-responsive">@{user?.username}</div>
                        </div>
                        <div className="flex-1 flex flex-col gap-4">
                            <UserInput
                                name="full_name"
                                label="Họ và tên"
                                value={userForm.full_name}
                                onChange={handleInputChange}
                            />
                            <UserInput
                                name="email"
                                label="Email"
                                value={userForm.email}
                                onChange={handleInputChange}
                            />
                            <UserInput
                                name="phone"
                                label="Số điện thoại"
                                value={userForm.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="self-end flex gap-4">
                        <button
                            className="self-end bg-green-200/75 text-green-700 rounded-md mt-4 transition duration-200 ease-in-out cursor-pointer button-responsive"
                            onClick={handleResetInfo}>
                            Xoá thay đổi
                        </button>
                        <button
                            className="self-end bg-[#4263eb] text-white rounded-md mt-4 hover:bg-[#365ac0] transition duration-200 ease-in-out cursor-pointer button-responsive"
                            onClick={handleChangeInfo}>
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col h-fit p-4 border border-[#e7e7e8] bg-white rounded-md gap-4 mb-4 lg:mb-0">
                    <div className="text-responsive">Đổi mật khẩu</div>
                    <div className="flex-1 flex flex-col gap-4">
                        <UserInput
                            name="currentPassword"
                            type="password"
                            label="Mật khẩu hiện tại"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordInputChange}
                        />
                        <UserInput
                            name="newPassword"
                            type="password"
                            label="Mật khẩu mới"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordInputChange}
                        />
                        <UserInput
                            name="confirmNewPassword"
                            type="password"
                            label="Xác nhận mật khẩu mới"
                            value={passwordForm.confirmNewPassword}
                            onChange={handlePasswordInputChange}
                        />
                    </div>
                    <button
                        className="self-end bg-[#4263eb] text-white rounded-md mt-4 hover:bg-[#365ac0] transition duration-200 ease-in-out cursor-pointer button-responsive"
                        onClick={handleChangePassword}>
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Account;
