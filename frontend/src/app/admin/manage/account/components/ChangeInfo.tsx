import { useState, useEffect } from "react";
import Input from "@/components/Input";
import useUserStore from "@/stores/user.store";

const ChangeInfo = () => {
    const user = useUserStore((state) => state.user);
    const updateInfo = useUserStore((state) => state.updateInfo);

    const [userForm, setUserForm] = useState({
        full_name: "",
        email: "",
        phone: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserForm((prevForm) => ({
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
        <div className="w-full bp10:w-3xl flex flex-col h-fit p-4 border border-primary-border bg-white rounded-md gap-4">
            <div className="text-default">Thông tin cá nhân</div>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-3 items-center">
                    <div className="w-30 h-30 bp4:w-48 bp4:h-48 bg-gray-200 rounded-full"></div>
                    <div className="text-default">@{user?.username}</div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <Input
                        name="full_name"
                        label="Họ và tên"
                        value={userForm.full_name}
                        onChange={handleInputChange}
                        width="bp6:w-90"
                        showPenIcon={true}
                    />
                    <Input
                        name="email"
                        label="Email"
                        value={userForm.email}
                        onChange={handleInputChange}
                        width="bp6:w-90"
                        showPenIcon={true}
                    />
                    <Input
                        name="phone"
                        label="Số điện thoại"
                        value={userForm.phone}
                        onChange={handleInputChange}
                        width="bp6:w-90"
                        showPenIcon={true}
                    />
                </div>
            </div>

            <div className="self-end flex gap-4 mt-4">
                <button
                    className="self-end bg-secondary-red-light hover:bg-secondary-red-light-extra text-secondary-red-dark hover:text-secondary-red-dark-extra rounded-md transition-default button-default text-default"
                    onClick={handleResetInfo}>
                    Xoá thay đổi
                </button>
                <button
                    className="self-end bg-secondary-blue-light hover:bg-secondary-blue-light-extra text-secondary-blue-dark hover:text-secondary-blue-dark-extra rounded-md transition-default button-default text-default"
                    onClick={handleChangeInfo}>
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default ChangeInfo;
