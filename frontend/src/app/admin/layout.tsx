import { ReactNode } from "react";
import NavigationEvents from "@/components/NavigationEvents";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
            <NavigationEvents />
        </>
    );
}
