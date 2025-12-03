const ManageViewFooter = ({
    toggleSideView,
    handleChange,
    handleChangeTitle,
}: {
    toggleSideView: (value: boolean) => void;
    handleChange: () => void;
    handleChangeTitle: string;
}) => {
    return (
        <div className="flex-between-center border-t border-primary-border ml-4 pr-4 h-17 lg:h-18 shrink-0">
            <button
                className="button-default text-default bg-secondary-red-light text-secondary-red-dark hover:bg-secondary-red-light-extra hover:text-secondary-red-dark-extra rounded-md transition-default"
                onClick={() => {
                    toggleSideView(false);
                }}>
                Thoát
            </button>
            <button
                className="button-default text-default bg-secondary-blue-light text-secondary-blue-dark hover:bg-secondary-blue-light-extra hover:text-secondary-blue-dark-extra rounded-md transition-default"
                onClick={handleChange}>
                {handleChangeTitle}
            </button>
        </div>
    );
};

export default ManageViewFooter;
