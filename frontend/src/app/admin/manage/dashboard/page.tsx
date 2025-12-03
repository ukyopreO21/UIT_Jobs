import Breadcrumb from "@/components/Breadcrumb";

const DashboardPage = () => {
    return (
        <div className="admin-page-layout-default">
            <div className="admin-page-first-container-default">
                <Breadcrumb items={[{ label: "Dashboard" }]} />
            </div>
        </div>
    );
};

export default DashboardPage;
