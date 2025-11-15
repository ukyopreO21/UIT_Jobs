"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import useUserStore from "@/stores/user.store";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const login = useUserStore((state) => state.login);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        login(username, password);
    };

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                router.push("/admin/manage");
            }, 2000);
        }
    }, [user, router]);

    return (
        <div className="bg-sky-100 flex h-screen justify-center items-center">
            <form className="w-fit h-fit flex flex-col gap-6 bg-purple-300 rounded-lg p-6">
                <span className="text-center block w-full">UIT - Cổng thông tin tuyển dụng</span>
                <div className="bg-white h-10 rounded-lg flex items-center gap-2 pl-2">
                    <AiOutlineUser size={20} color="gray" />
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="w-90 h-6 outline-none"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    />
                </div>
                <div className="bg-white h-10 rounded-lg flex items-center gap-2 pl-2">
                    <AiOutlineLock size={20} color="gray" />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-90 h-6 outline-none"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleLogin}
                    className="bg-blue-700 text-white font-semibold transition duration-200 hover:bg-blue-500 rounded-lg h-12 cursor-pointer">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
