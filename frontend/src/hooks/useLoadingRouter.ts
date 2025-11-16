"use client";

import useLoadingStore from "@/stores/loading.store";
import { useRouter as useNextRouter, usePathname } from "next/navigation";

type NextRouter = ReturnType<typeof useNextRouter>;
type PushParameters = Parameters<NextRouter["push"]>;

const useLoadingRouter = () => {
    const router = useNextRouter();
    const pathname = usePathname();
    const showLoading = useLoadingStore((state) => state.showLoading);

    const push = (...args: PushParameters) => {
        const href = args[0];

        if (href.toString() !== pathname) {
            showLoading();
        }

        router.push(...args);
    };

    const replace = (...args: Parameters<NextRouter["replace"]>) => {
        const href = args[0];
        if (href.toString() !== pathname) {
            showLoading();
        }
        router.replace(...args);
    };

    return {
        ...router,
        push,
        replace,
    };
};

export default useLoadingRouter;
