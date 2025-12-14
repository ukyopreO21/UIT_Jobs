"use client";
import { useEffect, useState } from "react";
import LoadingLink from "@/components/LoadingLink";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Breadcrumb from "@/components/Breadcrumb";
import Backdrop from "../components/ManageBackdrop";
import ComplexTable from "./components/ComplexTable";
import FiltersView from "./components/FiltersView";
import useAdminJobStore from "@/stores/admin-job.store";

const JobsPage = () => {
    const [isFiltersViewShowing, setIsFiltersViewShowing] = useState<boolean>(false);

    const findByFields = useAdminJobStore((state) => state.findByFields);

    const toggleDetailsView = (value: boolean) => {};

    const toggleFiltersView = (value: boolean) => {
        setIsFiltersViewShowing(value);
    };

    const toggleBackdrop = () => {
        setIsFiltersViewShowing(false);
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
                <LoadingLink
                    href={"/admin/manage/jobs/add"}
                    className="flex items-center gap-3 rounded-md button-default transition-default
								bg-secondary-blue-light text-secondary-blue-dark
								hover:bg-secondary-blue-light-extra hover:text-secondary-blue-dark-extra
								">
                    <AiOutlinePlusCircle className="icon-default" />
                    <span className="text-default">Thêm việc làm</span>
                </LoadingLink>
            </div>

            <ComplexTable toggleFiltersView={toggleFiltersView} />

            <Backdrop toggleBackdrop={toggleBackdrop} isSideViewShowing={isFiltersViewShowing} />

            <FiltersView
                toggleSideView={toggleFiltersView}
                isSideViewShowing={isFiltersViewShowing}
            />
        </div>
    );
};

export default JobsPage;
