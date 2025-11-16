"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import useLoadingRouter from "@/hooks/useLoadingRouter";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import useUserStore from "@/stores/user.store";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useLoadingRouter();
    const user = useUserStore((state) => state.user);
    const loading = useUserStore((state) => state.loading);
    const login = useUserStore((state) => state.login);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        login(username, password);
    };

    useEffect(() => {
        if (user) router.push("/admin/manage/dashboard");
    }, [user, router]);

    return (
        <div className="bg-sky-100 flex h-screen justify-center items-center">
            <form className="w-fit h-fit flex flex-col gap-6 bg-purple-300 rounded-lg p-6">
                <span className="text-center block w-full">UIT - Cổng thông tin tuyển dụng</span>
                <div className="bg-white h-10 rounded-lg flex items-center gap-2 px-2">
                    <AiOutlineUser size={20} color="gray" />
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="w-90 h-6 outline-none"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    />
                </div>
                <div className="bg-white h-10 rounded-lg flex items-center gap-2 px-2">
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
                    disabled={loading}
                    className={`bg-blue-700 text-white font-semibold transition duration-200 hover:bg-blue-500 rounded-lg h-12 flex items-center justify-center gap-2 ${
                        loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                    }`}>
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
                            </svg>
                            Đang đăng nhập...
                        </>
                    ) : (
                        "Đăng nhập"
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
