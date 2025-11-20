import { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";
import useAdminApplicationStore from "@/stores/admin-application.store";
import useAvailableFiltersStore from "@/stores/available-filters.store";

const FiltersView = ({
    toggleSideView,
    isSideViewShowing,
}: {
    toggleSideView: (value: boolean) => void;
    isSideViewShowing: boolean;
}) => {
    const [checkedPositions, setCheckedPositions] = useState<Record<string, boolean>>({});
    const [checkedFaculties, setCheckedFaculties] = useState<Record<string, boolean>>({});
    const [checkedDisciplines, setCheckedDisciplines] = useState<Record<string, boolean>>({});
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const availableFilterValues = useAvailableFiltersStore((state) => state);
    const fields = useAdminApplicationStore((state) => state.fields);
    const setFields = useAdminApplicationStore((state) => state.setFields);

    const updateFields = () => {
        const positions = Object.keys(checkedPositions).filter((pos) => checkedPositions[pos]);

        const filters: { faculty: string; disciplines: string[] }[] = [];

        availableFilterValues.faculties.forEach((facData) => {
            if (checkedFaculties[facData.name]) {
                const selectedDisciplinesInFaculty = (facData.disciplines || []).filter(
                    (disc) => checkedDisciplines[disc]
                );

                filters.push({
                    faculty: facData.name,
                    disciplines: selectedDisciplinesInFaculty,
                });
            }
        });

        setFields({
            positions,
            filters,
            startDate,
            endDate,
        });
    };

    const handleDisciplineChange = (facultyName: string, discipline: string) => {
        setCheckedDisciplines((prev) => ({
            ...prev,
            [discipline]: !prev[discipline],
        }));

        setCheckedFaculties((prev) => ({
            ...prev,
            [facultyName]: true,
        }));
    };

    const handleFacultyChange = (facultyName: string) => {
        setCheckedFaculties((prev) => {
            const isChecked = !prev[facultyName];
            if (!isChecked) {
                const facultyData = availableFilterValues.faculties.find(
                    (f) => f.name === facultyName
                );
                if (facultyData && facultyData.disciplines) {
                    setCheckedDisciplines((prevDisc) => {
                        const newDisc = { ...prevDisc };
                        facultyData.disciplines!.forEach((d) => delete newDisc[d]);
                        return newDisc;
                    });
                }
            }

            return {
                ...prev,
                [facultyName]: isChecked,
            };
        });
    };

    const handlePositionChange = (position: string) => {
        setCheckedPositions((prev) => ({
            ...prev,
            [position]: !prev[position],
        }));
    };

    useEffect(() => {
        if (isSideViewShowing) {
            setStartDate(fields.startDate || "");
            setEndDate(fields.endDate || "");

            const posMap: Record<string, boolean> = {};
            if (fields.positions) {
                fields.positions.forEach((p) => {
                    posMap[p] = true;
                });
            }
            setCheckedPositions(posMap);

            const facMap: Record<string, boolean> = {};
            const discMap: Record<string, boolean> = {};

            if (fields.filters) {
                fields.filters.forEach((item) => {
                    facMap[item.faculty] = true;
                    if (item.disciplines) {
                        item.disciplines.forEach((d) => {
                            discMap[d] = true;
                        });
                    }
                });
            }
            setCheckedFaculties(facMap);
            setCheckedDisciplines(discMap);
        }
    }, [isSideViewShowing, fields.startDate, fields.endDate, fields.positions, fields.filters]);

    return (
        <Transition
            as={Fragment}
            show={isSideViewShowing}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-x-2 scale-95"
            enterTo="opacity-100 translate-x-0 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-x-0 scale-100"
            leaveTo="opacity-0 translate-x-2 scale-95">
            <div className="absolute z-20 flex flex-col bg-white border border-[#e7e7e8] top-20 right-4 w-120 rounded-lg overflow-hidden h-fit max-h-[calc(100vh-6rem)] shadow-md">
                <div className="flex justify-between p-4 pl-0 ml-4 border-b border-[#e7e7e8] shrink-0">
                    <div className="flex flex-col gap-1">
                        <span className="text-xl font-medium">Bộ lọc</span>
                        <span className="text-[#535458]">Điều chỉnh</span>
                    </div>
                    <button className="cursor-pointer" onClick={() => toggleSideView(false)}>
                        <AiOutlineClose
                            size={20}
                            className="transition duration-200 ease-in-out hover:text-[#4263eb]"
                        />
                    </button>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">Thời gian nộp</span>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Từ ngày</span>
                            <input
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="outline-none"
                                type="date"
                            />
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Đến ngày</span>
                            <input
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="outline-none cursor-pointer"
                                type="date"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">Vị trí ứng tuyển</span>
                        {availableFilterValues.positions.map((position) => (
                            <div key={position} className="flex">
                                <span className="text-[#535458] flex-1">- {position}</span>
                                <input
                                    type="checkbox"
                                    checked={!!checkedPositions[position]}
                                    onChange={() => handlePositionChange(position)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 shrink-0">
                        <span className="font-medium text-lg">Đơn vị tuyển dụng</span>

                        {availableFilterValues.faculties.map((faculty) => (
                            <div key={faculty.name} className="flex flex-col gap-3">
                                <div className="flex items-center">
                                    <span className="flex-1 text-[#535458]">- {faculty.name}</span>
                                    <input
                                        type="checkbox"
                                        checked={!!checkedFaculties[faculty.name]}
                                        onChange={() => handleFacultyChange(faculty.name)}
                                    />
                                </div>

                                {faculty.disciplines && faculty.disciplines.length > 0 && (
                                    <div className="flex flex-col pl-6 gap-3">
                                        {faculty.disciplines.map((discipline) => (
                                            <div
                                                key={discipline}
                                                className="flex gap-10 items-center">
                                                <span className="flex-1 text-[#535458]">
                                                    + {discipline}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={!!checkedDisciplines[discipline]}
                                                    onChange={() =>
                                                        handleDisciplineChange(
                                                            faculty.name,
                                                            discipline
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-[#e7e7e8] h-18 ml-4 pr-4 shrink-0">
                    <button
                        className="px-4 h-10 bg-red-200/75 text-red-700 rounded-lg transition duration-200 ease-in-out cursor-pointer"
                        onClick={() => {
                            toggleSideView(false);
                        }}>
                        Thoát
                    </button>
                    <button
                        onClick={() => {
                            updateFields();
                            toggleSideView(false);
                        }}
                        className="px-4 h-10 bg-[#dbe4ff] text-[#4263eb] rounded-lg transition duration-200 ease-in-out cursor-pointer">
                        Cập nhật bộ lọc
                    </button>
                </div>
            </div>
        </Transition>
    );
};

export default FiltersView;
