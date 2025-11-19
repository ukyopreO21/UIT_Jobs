"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Backdrop from "../components/ManageBackdrop";
import ComplexTable from "./components/ComplexTable";
import DetailsView from "./components/DetailsView";
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
        <div className="flex flex-col gap-6 h-full">
            <Breadcrumb items={[{ label: "Hồ sơ" }]} />

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

            <DetailsView
                toggleSideView={toggleDetailsView}
                isSideViewShowing={isDetailsViewShowing}
            />
        </div>
    );
};

export default ReviewPage;
