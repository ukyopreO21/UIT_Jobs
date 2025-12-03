import { AiOutlineClose } from "react-icons/ai";

const ManageViewHeader = ({
    title,
    subTitle,
    toggleSideView,
}: {
    title: string;
    subTitle: string;
    toggleSideView: (value: boolean) => void;
}) => {
    return (
        <div className="admin-page-side-view-header-default">
            <div className="flex flex-col gap-1">
                <span className="text-lg lg:text-xl font-medium">{title}</span>
                <span className="text-primary-text">{subTitle}</span>
            </div>
            <button onClick={() => toggleSideView(false)}>
                <AiOutlineClose
                    size={20}
                    className="transition duration-200 ease-in-out hover:text-secondary-text-dark"
                />
            </button>
        </div>
    );
};

export default ManageViewHeader;
