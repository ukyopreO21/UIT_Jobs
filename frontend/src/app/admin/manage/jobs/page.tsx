"use client";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcrumb";
import Backdrop from "../components/ManageBackdrop";
import ComplexTable from "./components/ComplexTable";
import DetailsView from "./components/DetailsView";
import FiltersView from "./components/FiltersView";
import useAdminJobStore from "@/stores/admin-job.store";
import CreateView from "./components/CreateView";

const JobsPage = () => {
    const [isDetailsViewShowing, setIsDetailsViewShowing] = useState<boolean>(false);
    const [isFiltersViewShowing, setIsFiltersViewShowing] = useState<boolean>(false);
    const [isCreateViewShowing, setIsCreateViewShowing] = useState<boolean>(false);

    const findByFields = useAdminJobStore((state) => state.findByFields);

    const toggleDetailsView = (value: boolean) => {
        setIsDetailsViewShowing(value);
    };

    const toggleFiltersView = (value: boolean) => {
        setIsFiltersViewShowing(value);
    };

    const toggleCreateView = (value: boolean) => {
        setIsCreateViewShowing(value);
    };

    const toggleBackdrop = () => {
        setIsDetailsViewShowing(false);
        setIsFiltersViewShowing(false);
        setIsCreateViewShowing(false);
    };

    useEffect(() => {
        const fetchJobs = async () => {
            await findByFields();
        };

        fetchJobs();
    }, [findByFields]);
    return (
        <div className="admin-page-layout-default">
            <div className="admin-page-first-container-default">
                <Breadcrumb items={[{ label: "Việc làm" }]} />
                <button
                    className="flex items-center gap-3 rounded-md button-default transition-default
								bg-white hover:bg-secondary-blue-light-extra
								border border-primary-border hover:border-secondary-blue-light-extra
								hover:text-secondary-blue-dark-extra
								"
                    onClick={() => {
                        toggleCreateView(true);
                    }}>
                    <AiOutlinePlus className="icon-default" />
                    <span className="text-default">Thêm việc làm</span>
                </button>
            </div>

            <ComplexTable
                toggleDetailsView={toggleDetailsView}
                toggleFiltersView={toggleFiltersView}
            />

            <Backdrop
                toggleBackdrop={toggleBackdrop}
                isSideViewShowing={
                    isDetailsViewShowing || isFiltersViewShowing || isCreateViewShowing
                }
            />

            <CreateView
                toggleSideView={setIsCreateViewShowing}
                isSideViewShowing={isCreateViewShowing}
            />

            <FiltersView
                toggleSideView={toggleFiltersView}
                isSideViewShowing={isFiltersViewShowing}
            />

            <DetailsView
                toggleSideView={toggleDetailsView}
                isSideViewShowing={isDetailsViewShowing}
            />
        </div>
    );
};

export default JobsPage;
