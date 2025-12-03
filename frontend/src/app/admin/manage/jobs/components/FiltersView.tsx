import { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import ManageViewHeader from "../../components/ManageViewHeader";
import ManageViewFooter from "../../components/ManageViewFooter";
import useAdminJobStore from "@/stores/admin-job.store";
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
    const setFields = useAdminJobStore((state) => state.setFields);

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
            <div className="admin-page-side-view-default text-default">
                <ManageViewHeader
                    title="Bộ lọc"
                    subTitle="Điều chỉnh"
                    toggleSideView={toggleSideView}
                />

                <div className="flex flex-col flex-1 overflow-y-auto">
                    <div className="admin-page-side-view-part-default">
                        <span className="font-medium text-lg">Hạn chót</span>
                        <div className="flex">
                            <span className="flex-1 text-primary-text">Từ ngày</span>
                            <input
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="outline-none"
                                type="date"
                            />
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-primary-text">Đến ngày</span>
                            <input
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="outline-none"
                                type="date"
                            />
                        </div>
                    </div>

                    <div className="admin-page-side-view-part-default">
                        <span className="font-medium text-lg">Vị trí ứng tuyển</span>
                        {availableFilterValues.positions.map((position) => (
                            <div key={position} className="flex">
                                <span className="flex-1 text-primary-text">- {position}</span>
                                <input
                                    type="checkbox"
                                    checked={!!checkedPositions[position]}
                                    onChange={() => handlePositionChange(position)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="admin-page-side-view-part-default border-none">
                        <span className="font-medium text-lg">Đơn vị tuyển dụng</span>
                        {availableFilterValues.faculties.map((faculty) => (
                            <div key={faculty.name} className="flex flex-col gap-3">
                                <div className="flex items-center">
                                    <span className="flex-1 text-primary-text">
                                        - {faculty.name}
                                    </span>
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
                                                <span className="flex-1 text-primary-text">
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

                <ManageViewFooter
                    toggleSideView={toggleSideView}
                    handleChange={() => {
                        updateFields();
                        toggleSideView(false);
                    }}
                    handleChangeTitle="Cập nhật bộ lọc"
                />
            </div>
        </Transition>
    );
};

export default FiltersView;
