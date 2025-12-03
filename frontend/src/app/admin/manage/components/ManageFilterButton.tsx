import { VscFilter } from "react-icons/vsc";

const ManageFilterButton = ({
    toggleSideView,
    hasNoti,
}: {
    toggleSideView: () => void;
    hasNoti: boolean;
}) => {
    return (
        <button
            className="relative flex-center rounded-md border bg-primary-bg border-primary-border gap-3 cursor-pointer
			w-9 sm:w-fit h-9 lg:h-10 px-0 sm:px-3
			hover:bg-secondary-blue-light hover:border-secondary-blue-light hover:text-secondary-blue-dark-extra transition-default"
            onClick={() => toggleSideView()}>
            <VscFilter className="icon-default" />
            <span className="hidden sm:block text-default">Tạo bộ lọc</span>
            {hasNoti && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 translate-x-1.25 -translate-y-1.25 rounded-full bg-secondary-blue-dark"></div>
            )}
        </button>
    );
};

export default ManageFilterButton;
