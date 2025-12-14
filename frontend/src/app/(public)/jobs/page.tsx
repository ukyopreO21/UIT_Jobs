"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import JobCard from "./components/JobCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import Select from "@/components/Select";

import usePublicJobStore from "@/stores/public-job.store";

const jobTypes = [
    { label: "Toàn thời gian", value: "full-time" },
    { label: "Bán thời gian", value: "part-time" },
    { label: "Thực tập", value: "internship" },
];

const Jobs = () => {
    const [salary, setSalary] = useState({ min: "", max: "", type: "" });
    const [type, setType] = useState({ label: "", value: "" });

    const jobs = usePublicJobStore((state) => state.jobs);
    const resultPerPage = usePublicJobStore((state) => state.resultPerPage);
    const currentPage = usePublicJobStore((state) => state.currentPage);
    const totalPages = usePublicJobStore((state) => state.totalPages);

    const setFields = usePublicJobStore((state) => state.setFields);

    const setSearchValue = usePublicJobStore((state) => state.setSearchValue);
    const setResultPerPage = usePublicJobStore((state) => state.setResultPerPage);
    const setCurrentPage = usePublicJobStore((state) => state.setCurrentPage);

    const findByFields = usePublicJobStore((state) => state.findByFields);

    const updateFields = () => {
        setFields({
            type: type.value,
        });
    };

    const handleSalaryChange = (
        min: string,
        max: string,
        type: string = "range",
        all?: boolean
    ) => {
        if (all) {
            setSalary({ min: "", max: "", type: "" });
            setFields({});
            return;
        }
        if (type === "negotiable") {
            setSalary({ min: "", max: "", type: "negotiable" });
        }
        setSalary({ min, max, type });
        setFields({
            minSalary: min ? parseInt(min) : undefined,
            maxSalary: max ? parseInt(max) : undefined,
        });
    };

    useEffect(() => {
        const fetchJobs = async () => {
            await findByFields();
        };

        fetchJobs();
    }, [findByFields]);

    return (
        <div className="px-4">
            <div className="mx-auto max-w-360 mt-4">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Việc làm" }]} />
                <div className="flex flex-col bp3:flex-row text-default gap-8 mt-10">
                    <div className="w-full bp3:w-90 h-fit p-4 rounded-md border border-primary-border">
                        <div className="flex-between-center border-b border-primary-border pb-4 mb-4">
                            <label className="text-base bp4:text-lg font-bold">Bộ lọc</label>
                            <button className="button-default text-primary-text hover:text-secondary-blue-dark">
                                Xoá
                            </button>
                        </div>

                        <div className="flex flex-col flex-1 gap-3 text-primary-text">
                            <label className="text-lg bp4:text-xl font-semibold text-black">
                                Mức lương
                            </label>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5" />
                                <span>Tất cả</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5" />
                                <span>Thỏa thuận</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5" />
                                <span>0 - 10 triệu</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="salary-type"
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <span>10 - 20 triệu</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="salary-type"
                                    className="w-5 h-5 cursor-pointer "
                                />
                                <span>20 - 30 triệu</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5" />
                                <span>30 - 50 triệu</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" className="w-5 h-5" />
                                <span>Trên 50 triệu</span>
                            </div>
                        </div>

                        <Select
                            name="type"
                            selected={{
                                label: type.label,
                                value: type.value,
                            }}
                            options={jobTypes}
                            onChange={(value) => {
                                setType({
                                    label:
                                        jobTypes.find((type) => type.value === value)?.label || "",
                                    value: value,
                                });
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-4 flex-1 border border-primary-border rounded-md p-4">
                        <div className="flex-between-center flex-col bp2:flex-row gap-4 border-b border-primary-border pb-4 mb-4">
                            <div>
                                Tìm thấy&nbsp;
                                <span className="font-medium text-secondary-blue-dark">
                                    {jobs ? jobs.length : 0}
                                </span>
                                &nbsp;việc làm
                            </div>
                            <SearchBar
                                handleSearch={(value) => setSearchValue(value)}
                                placeholder="Nhập việc làm cần tìm..."
                                width="not-bp2:w-full"
                            />
                        </div>
                        <div className="grid gap-4 grid-cols-1 bp4:grid-cols-2 bp6:grid-cols-3">
                            {jobs &&
                                jobs.length > 0 &&
                                jobs.map((job) => <JobCard key={job.id} data={job} />)}
                        </div>
                        <Pagination
                            pageSizes={[12, 24, 36]}
                            resultPerPage={resultPerPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handleResultPerPage={setResultPerPage}
                            handleFirstPage={() => setCurrentPage(1)}
                            handlePrevPage={() => setCurrentPage(currentPage - 1)}
                            handleCurrentPage={setCurrentPage}
                            handleNextPage={() => setCurrentPage(currentPage + 1)}
                            handleLastPage={() => setCurrentPage(totalPages)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
