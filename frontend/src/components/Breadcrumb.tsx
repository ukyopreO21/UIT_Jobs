import { HiMiniChevronRight } from "react-icons/hi2";
import LoadingLink from "./LoadingLink";

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
                                <LoadingLink
                                    href={item.href}
                                    className="text-[#535458] hover:text-[#4263eb] transition-colors">
                                    {item.label}
                                </LoadingLink>
                            ) : (
                                <span className="text-responsive font-medium">{item.label}</span>
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
