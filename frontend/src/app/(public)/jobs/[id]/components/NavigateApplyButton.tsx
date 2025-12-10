"use client";

import { AiOutlineForm } from "react-icons/ai";
import { useRouter, useParams } from "next/navigation";

const NavigateApplyButton = () => {
    const router = useRouter();
    const params = useParams();

    const handleNavigateApply = () => {
        router.push(`/jobs/${params.id}/apply`);
    };

    return (
        <button
            onClick={handleNavigateApply}
            className="h-fit w-fit shrink-0 rounded-lg transition-default font-medium
						px-6 lg:px-7 py-3 lg:py-4
						text-secondary-blue-dark bg-secondary-blue-light hover:text-secondary-blue-dark-extra hover:bg-secondary-blue-light-extra">
            <div className="flex-center gap-2">
                <AiOutlineForm className="icon-default" />
                <span>Ứng tuyển ngay</span>
            </div>
        </button>
    );
};

export default NavigateApplyButton;
