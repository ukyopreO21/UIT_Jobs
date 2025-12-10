import {
    AiOutlineUser,
    AiOutlineSolution,
    AiOutlineClockCircle,
    AiOutlineDollarCircle,
} from "react-icons/ai";

import Job from "@/types/Job";
import { formatDate } from "@/utils/format-date";
import { useRouter } from "next/navigation";

const JobCard = ({ data }: { data: Job }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/jobs/${data.id}`);
    };

    return (
        <div className="text-default flex flex-col gap-2 border border-primary-border p-3 lg:p-4 rounded-md flex-1">
            <div className="text-medium mb-4 line-clamp-2 leading-5 lg:leading-6 h-10 lg:h-12 overflow-hidden">
                {data.title}
            </div>
            <div className="flex gap-4">
                <div className="text-xs lg:text-sm text-primary-text flex items-center gap-1">
                    <AiOutlineUser className="text-sm" />
                    <span>{data.position}</span>
                </div>
                <div className="text-xs lg:text-sm text-primary-text flex items-center gap-1">
                    <AiOutlineSolution className="text-sm" />
                    <span>{data.degree}</span>
                </div>
            </div>

            <div className="text-xs lg:text-sm text-primary-text flex items-center gap-1">
                <AiOutlineClockCircle className="text-sm" />
                <span>Hạn chót: {formatDate(data.deadline)}</span>
            </div>
            <div className="flex-between-center border-t border-primary-border pt-4 mt-4">
                <div className="flex items-center gap-1 text-secondary-blue-dark-extra">
                    <AiOutlineDollarCircle className="icon-default" />
                    <span>{data.salary}</span>
                </div>
                <button
                    onClick={handleClick}
                    className="button-default shrink-0 rounded-md text-secondary-blue-dark hover:text-secondary-blue-dark-extra bg-secondary-blue-light hover:bg-secondary-blue-light-extra transition-default">
                    Ứng tuyển
                </button>
            </div>
        </div>
    );
};

export default JobCard;
