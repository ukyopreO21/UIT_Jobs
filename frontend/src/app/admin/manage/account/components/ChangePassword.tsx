import { useState } from "react";
import Input from "@/components/Input";
import useUserStore from "@/stores/user.store";

const ChangePassword = () => {
    const changePassword = useUserStore((state) => state.changePassword);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleChangePassword = async () => {
        await changePassword(
            passwordForm.currentPassword,
            passwordForm.newPassword,
            passwordForm.confirmNewPassword
        );
    };

    return (
        <div className="w-full bp10:w-3xl flex flex-col h-fit p-4 border border-primary-border bg-white rounded-md gap-4 mb-4 bp4:mb-0">
            <div className="text-default">Đổi mật khẩu</div>
            <div className="flex-1 flex flex-col gap-4">
                <Input
                    name="currentPassword"
                    type="password"
                    label="Mật khẩu hiện tại"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    width="bp6:w-90"
                    showPenIcon={true}
                />
                <Input
                    name="newPassword"
                    type="password"
                    label="Mật khẩu mới"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    width="bp6:w-90"
                    showPenIcon={true}
                />
                <Input
                    name="confirmNewPassword"
                    type="password"
                    label="Xác nhận mật khẩu mới"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordInputChange}
                    width="bp6:w-90"
                    showPenIcon={true}
                />
            </div>
            <button
                className="self-end bg-secondary-blue-light hover:bg-secondary-blue-light-extra text-secondary-blue-dark hover:text-secondary-blue-dark-extra rounded-md mt-4 transition-default button-default text-default"
                onClick={handleChangePassword}>
                Đổi mật khẩu
            </button>
        </div>
    );
};

export default ChangePassword;
