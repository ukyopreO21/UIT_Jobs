"use client";

import { AiOutlineForm } from "react-icons/ai";
import LoadingLink from "@/components/LoadingLink";
import { useParams } from "next/navigation";

const NavigateApplyButton = () => {
    const params = useParams();

    return (
        <LoadingLink
            href={`/jobs/${params.id}/apply`}
            className="h-fit w-fit shrink-0 rounded-lg transition-default font-medium
						px-6 bp4:px-7 py-3 bp4:py-4
						text-secondary-blue-dark bg-secondary-blue-light hover:text-secondary-blue-dark-extra hover:bg-secondary-blue-light-extra">
            <div className="flex-center gap-2">
                <AiOutlineForm className="icon-default" />
                <span>Ứng tuyển ngay</span>
            </div>
        </LoadingLink>
    );
};

export default NavigateApplyButton;
