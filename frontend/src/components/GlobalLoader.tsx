"use client";

import useLoadingStore from "@/stores/loading.store";
import { AiOutlineLoading } from "react-icons/ai";

const GlobalLoader = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-100 flex-center bg-primary-backdrop">
            <div className="text-white text-4xl animate-spin">{<AiOutlineLoading />}</div>
        </div>
    );
};

export default GlobalLoader;
