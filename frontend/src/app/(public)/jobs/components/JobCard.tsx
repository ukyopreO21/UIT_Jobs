import {
    AiOutlineUser,
    AiOutlineSolution,
    AiOutlineClockCircle,
    AiOutlineDollarCircle,
} from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi2";

import { Job } from "@/types/Job";
import { formatDate } from "@/utils/format-date";
import LoadingLink from "@/components/LoadingLink";

const JobCard = ({ data }: { data: Job }) => {
    return (
        <div className="text-default flex flex-col gap-2 border border-primary-border p-3 bp4:p-4 rounded-md flex-1">
            <div className="font-medium mb-4 line-clamp-2 leading-5 bp4:leading-6 h-10 bp4:h-12 overflow-hidden">
                {data.title}
            </div>

            <div>
                <div className="text-xs bp4:text-sm text-primary-text flex gap-2">
                    <HiOutlineBriefcase className="text-xs bp4:text-sm shrink-0 mt-0.5 bp4:mt-0.75" />
                    <span>{data.employer_name}</span>
                </div>
            </div>

            <div className="flex gap-8">
                <div className="text-xs bp4:text-sm text-primary-text flex items-center gap-2">
                    <AiOutlineUser className="text-xs bp4:text-sm shrink-0" />
                    <span>{data.position_name}</span>
                </div>
                <div className="text-xs bp4:text-sm text-primary-text flex items-center gap-2">
                    <AiOutlineSolution className="text-xs bp4:text-sm shrink-0" />
                    <span>{data.degree}</span>
                </div>
            </div>

            <div className="text-xs bp4:text-sm text-primary-text flex items-center gap-2">
                <AiOutlineClockCircle className="text-xs bp4:text-sm shrink-0" />
                <span>Hạn chót: {formatDate(data.deadline)}</span>
            </div>
            <div className="flex-between-center border-t border-primary-border pt-4 mt-4">
                <div className="flex items-center gap-2 text-secondary-blue-dark-extra">
                    <AiOutlineDollarCircle className="icon-default" />
                    <span>
                        {data.salary_type == "negotiable"
                            ? "Thoả thuận"
                            : `${data.salary_min} - ${data.salary_max} triệu`}
                    </span>
                </div>
                <LoadingLink
                    href={`/jobs/${data.id}`}
                    className="flex-center button-default shrink-0 rounded-md text-secondary-blue-dark hover:text-secondary-blue-dark-extra bg-secondary-blue-light hover:bg-secondary-blue-light-extra transition-default">
                    Ứng tuyển
                </LoadingLink>
            </div>
        </div>
    );
};

export default JobCard;
