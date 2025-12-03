import { HiMiniChevronRight } from "react-icons/hi2";
import Link from "@/components/LoadingLink";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center">
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;

                    return (
                        <li key={idx} className="flex items-center">
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-primary-text hover:text-secondary-blue-dark-extra transition duration-200 ease-in-out text-default">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-default font-medium">{item.label}</span>
                            )}

                            {!isLast && <HiMiniChevronRight size={16} className="mx-2" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
