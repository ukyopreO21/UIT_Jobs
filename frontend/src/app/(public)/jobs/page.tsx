"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import JobCard from "./components/JobCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import Select from "@/components/Select";

import usePublicJobStore from "@/stores/public-job.store";

const jobTypes = [
    { label: "Tất cả", value: "" },
    { label: "Toàn thời gian", value: "full-time" },
    { label: "Bán thời gian", value: "part-time" },
    { label: "Thực tập", value: "internship" },
];

type SalaryMode = "all" | "negotiable" | "range";

const salaryMinSteps = [0, 5, 10, 20, 50];
const salaryMaxSteps = [5, 10, 20, 50, 100];

const Jobs = () => {
    const [salaryMode, setSalaryMode] = useState<SalaryMode>("all");
    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(salaryMaxSteps.length - 1);
    const [type, setType] = useState({ label: "Chọn loại hình công việc", value: "" });

    const jobs = usePublicJobStore((state) => state.jobs);
    const resultPerPage = usePublicJobStore((state) => state.resultPerPage);
    const currentPage = usePublicJobStore((state) => state.currentPage);
    const totalPages = usePublicJobStore((state) => state.totalPages);

    const setFields = usePublicJobStore((state) => state.setFields);
    const setSearchValue = usePublicJobStore((state) => state.setSearchValue);
    const setResultPerPage = usePublicJobStore((state) => state.setResultPerPage);
    const setCurrentPage = usePublicJobStore((state) => state.setCurrentPage);
    const findByFields = usePublicJobStore((state) => state.findByFields);

    const handleAllSalary = () => {
        setSalaryMode("all");

        setMinIndex(0);
        setMaxIndex(salaryMaxSteps.length - 1);

        handleSalaryChange("all");
    };

    const handleNegotiableSalary = () => {
        setSalaryMode("negotiable");

        setMinIndex(0);
        setMaxIndex(salaryMaxSteps.length - 1);

        handleSalaryChange("negotiable");
    };

    const applySalaryRange = () => {
        triggerSalaryRange(minIndex, maxIndex);
    };

    const handleRangeSalary = () => {
        setSalaryMode("range");
        handleSalaryChange("range");
    };

    const triggerSalaryRange = (newMinIndex: number, newMaxIndex: number) => {
        const min = salaryMinSteps[newMinIndex];
        const max = salaryMaxSteps[newMaxIndex];

        if (min > max) return;

        handleSalaryChange("range");
    };

    const handleSalaryChange = (type: string = "range") => {
        if (type === "all") {
            setFields({
                salaryType: undefined,
                salaryMin: undefined,
                salaryMax: undefined,
            });
            return;
        }
        if (type === "negotiable") {
            setFields({
                salaryType: "negotiable",
                salaryMin: undefined,
                salaryMax: undefined,
            });
            return;
        }

        if (type === "range") {
            setFields({
                salaryType: "range",
                salaryMin: salaryMinSteps[minIndex],
                salaryMax: salaryMaxSteps[maxIndex],
            });
        }
    };

    const handleTypeChange = (value: string) => {
        setType(
            jobTypes.find((type) => type.value === value) || {
                label: "Chọn loại hình công việc",
                value: "",
            }
        );
        setFields({ type: value || undefined });
    };

    const resetFilters = () => {
        setType({ label: "Chọn loại hình công việc", value: "" });
        setFields({});
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
                            <button
                                onClick={resetFilters}
                                className="button-default text-primary-text hover:text-secondary-blue-dark">
                                Xoá
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col flex-1 gap-3 text-primary-text">
                                <label className="text-lg bp4:text-xl font-semibold text-black">
                                    Mức lương
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5"
                                        checked={salaryMode === "all"}
                                        onChange={handleAllSalary}
                                    />
                                    <span>Tất cả</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5"
                                        checked={salaryMode === "negotiable"}
                                        onChange={handleNegotiableSalary}
                                    />
                                    <span>Thỏa thuận</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5"
                                        checked={salaryMode === "range"}
                                        onChange={handleRangeSalary}
                                    />
                                    <span>Tìm theo khoảng</span>
                                </div>

                                {salaryMode === "range" && (
                                    <div className="flex flex-col gap-4 w-full">
                                        {/* MIN */}
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-8">Từ</span>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={salaryMinSteps.length - 1}
                                                    step={1}
                                                    value={minIndex}
                                                    onChange={(e) =>
                                                        setMinIndex(Number(e.target.value))
                                                    }
                                                    onMouseUp={applySalaryRange}
                                                    onTouchEnd={applySalaryRange}
                                                    className="w-full"
                                                />
                                                <span className="w-14 text-right">
                                                    {salaryMinSteps[minIndex]} triệu
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-primary-text ml-10 mr-12 mt-1">
                                                {salaryMinSteps.map((s) => (
                                                    <span key={s}>{s}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* MAX */}
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-8">Đến</span>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={salaryMaxSteps.length - 1}
                                                    step={1}
                                                    value={maxIndex}
                                                    onChange={(e) =>
                                                        setMaxIndex(Number(e.target.value))
                                                    }
                                                    onMouseUp={applySalaryRange}
                                                    onTouchEnd={applySalaryRange}
                                                    className="w-full"
                                                />
                                                <span className="w-14 text-right">
                                                    {salaryMaxSteps[maxIndex]} triệu
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-primary-text ml-10 mr-12 mt-1">
                                                {salaryMaxSteps.map((s) => (
                                                    <span key={s}>{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-lg bp4:text-xl font-semibold text-black mt-6 mb-3">
                                    Loại hình công việc
                                </label>
                                <Select
                                    name="type"
                                    selected={{
                                        label: type.label,
                                        value: type.value,
                                    }}
                                    options={jobTypes}
                                    onChange={(value) => handleTypeChange(value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 flex-1 border border-primary-border rounded-md p-4 h-fit">
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
