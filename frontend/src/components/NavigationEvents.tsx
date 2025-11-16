"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useLoadingStore from "@/stores/loading.store";

function NavigationEvents() {
    const pathname = usePathname();
    const hideLoading = useLoadingStore((state) => state.hideLoading);

    useEffect(() => {
        hideLoading();
    }, [pathname, hideLoading]);

    return null;
}

export default NavigationEvents;
