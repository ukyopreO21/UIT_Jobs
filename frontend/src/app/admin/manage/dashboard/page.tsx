import Breadcrumb from "@/components/Breadcrumb";

const DashboardPage = () => {
    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="h-10 flex items-center">
                <Breadcrumb items={[{ label: "Dashboard" }]} />
            </div>
        </div>
    );
};

export default DashboardPage;
