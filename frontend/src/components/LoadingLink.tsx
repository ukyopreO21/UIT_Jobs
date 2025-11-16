"use client";

import Link, { LinkProps } from "next/link";
import useLoadingStore from "@/stores/loading.store";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type LoadingLinkProps = LinkProps & {
    children: ReactNode;
    className?: string;
    [key: string]: any;
};

const LoadingLink = ({ children, href, ...props }: LoadingLinkProps) => {
    const showLoading = useLoadingStore((state) => state.showLoading);
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const hrefStr = href.toString();
        if (hrefStr && !hrefStr.startsWith("#") && hrefStr !== pathname) {
            showLoading();
        }

        if (props.onClick) {
            props.onClick(e);
        }
    };

    return (
        <Link href={href} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
};

export default LoadingLink;
