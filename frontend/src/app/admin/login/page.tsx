"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import useLoadingRouter from "@/hooks/useLoadingRouter";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import useLoadingStore from "@/stores/loading.store";
import useUserStore from "@/stores/user.store";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useLoadingRouter();
    const isLoading = useLoadingStore((state) => state.isLoading);
    const user = useUserStore((state) => state.user);
    const login = useUserStore((state) => state.login);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        login(username, password);
    };

    useEffect(() => {
        if (user) router.push("/admin/manage/dashboard");
    }, [user, router]);

    return (
        <div className="flex-center h-screen text-default bg-cover bg-center bg-fixed bg-[url('/auth-background.png')]">
            <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10"></div>
            <form
                className="z-1 w-full max-w-100 h-fit flex flex-col gap-6 rounded-2xl p-6 not-bp2:m-4
							bg-white/30 backdrop-blur-sm shadow-2xl border-2 border-white/20">
                <span className="text-center block w-full">UIT - Cổng thông tin tuyển dụng</span>

                <div className="flex items-center input-container-default input-container-outline-black transition-default">
                    <AiOutlineUser className="icon-default text-primary-text" />
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="input-text-default text-default"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    />
                </div>

                <div className="flex items-center input-container-default input-container-outline-black transition-default">
                    <AiOutlineLock className="icon-default text-primary-text" />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="input-text-default text-default"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </div>

                <button className="self-end text-xs bp4:text-sm">Quên mật khẩu?</button>

                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`font-medium transition-default rounded-lg flex-center gap-2
								text-white bg-secondary-blue-dark hover:bg-secondary-blue-dark-extra
								h-11 bp4:h-12
								${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
