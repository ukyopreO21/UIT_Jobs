"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Backdrop from "../components/ManageBackdrop";
import ComplexTable from "./components/ComplexTable";
import FiltersView from "./components/FiltersView";
import useAdminApplicationStore from "@/stores/admin-application.store";

const ReviewPage = () => {
    const [isDetailsViewShowing, setIsDetailsViewShowing] = useState<boolean>(false);
    const [isFiltersViewShowing, setIsFiltersViewShowing] = useState<boolean>(false);

    const findByFields = useAdminApplicationStore((state) => state.findByFields);

    const toggleDetailsView = (value: boolean) => {
        setIsDetailsViewShowing(value);
    };

    const toggleFiltersView = (value: boolean) => {
        setIsFiltersViewShowing(value);
    };

    const toggleBackdrop = () => {
        setIsDetailsViewShowing(false);
        setIsFiltersViewShowing(false);
    };

    useEffect(() => {
        const fetchApplications = async () => {
            await findByFields();
        };

        fetchApplications();
    }, [findByFields]);

    return (
        <div className="admin-page-layout-default">
            <div className="admin-page-first-container-default">
                <Breadcrumb items={[{ label: "Hồ sơ" }]} />
            </div>

            <ComplexTable
                toggleDetailsView={toggleDetailsView}
                toggleFiltersView={toggleFiltersView}
            />

            <Backdrop
                toggleBackdrop={toggleBackdrop}
                isSideViewShowing={isDetailsViewShowing || isFiltersViewShowing}
            />

            <FiltersView
                toggleSideView={toggleFiltersView}
                isSideViewShowing={isFiltersViewShowing}
            />
        </div>
    );
};

export default ReviewPage;
