"use client";
import { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import JobCard from "./components/JobCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

import usePublicJobStore from "@/stores/public-job.store";

const Jobs = () => {
    const jobs = usePublicJobStore((state) => state.jobs);
    const resultPerPage = usePublicJobStore((state) => state.resultPerPage);
    const currentPage = usePublicJobStore((state) => state.currentPage);
    const totalPages = usePublicJobStore((state) => state.totalPages);

    const setSearchValue = usePublicJobStore((state) => state.setSearchValue);
    const setResultPerPage = usePublicJobStore((state) => state.setResultPerPage);
    const setCurrentPage = usePublicJobStore((state) => state.setCurrentPage);

    const findByFields = usePublicJobStore((state) => state.findByFields);

    useEffect(() => {
        const fetchJobs = async () => {
            await findByFields();
        };

        fetchJobs();
    }, [findByFields]);

    return (
        <div className="px-4">
            <div className="mx-auto max-w-7xl mt-4">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Việc làm" }]} />
                <div className="flex flex-col md:flex-row text-default gap-12 mt-10">
                    <div className="w-60">
                        <div className="flex-between-center  border-b border-primary-border pb-4 mb-4">
                            <label className="text-lg font-bold">Bộ lọc</label>
                            <button className="button-default text-primary-text hover:text-secondary-blue-dark">
                                Xoá
                            </button>
                        </div>

                        <div>
                            <label>Mức lương</label>
                        </div>

                        <div>
                            <label>Ngành làm việc</label>
                        </div>

                        <div>
                            <label>Địa điểm</label>
                        </div>

                        <div>
                            <label>Loại hình công việc</label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="flex-between-center border-b border-primary-border pb-4 mb-4">
                            <div>
                                Tìm thấy&nbsp;
                                <span className="font-medium text-secondary-blue-dark">
                                    {jobs ? jobs.length : 0}
                                </span>
                                &nbsp;việc làm
                            </div>
                            <SearchBar
                                handleSearch={(value) => setSearchValue(value)}
                                placeholder="Nhập việc làm cần tìm kiếm..."
                            />
                        </div>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
