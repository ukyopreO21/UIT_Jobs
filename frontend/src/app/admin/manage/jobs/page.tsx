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
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center h-10">
                <Breadcrumb items={[{ label: "Việc làm" }]} />
                <button
                    className="flex items-center gap-2 button-responsive rounded-md cursor-pointer bg-white border border-[#e7e7e8]
									hover:text-[#4263eb] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] transition duration-200 ease-in-out
									"
                    onClick={() => {
                        toggleCreateView(true);
                    }}>
                    <AiOutlinePlus className="icon-responsive" /> Thêm việc làm
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
