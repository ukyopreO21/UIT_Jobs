import { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import ManageViewHeader from "../../components/ManageViewHeader";
import ManageViewFooter from "../../components/ManageViewFooter";
import useAdminJobStore from "@/stores/admin-job.store";

const FiltersView = ({
    toggleSideView,
    isSideViewShowing,
}: {
    toggleSideView: (value: boolean) => void;
    isSideViewShowing: boolean;
}) => {
    const [checkedPositions, setCheckedPositions] = useState<Record<string, boolean>>({});
    const [checkedDepartments, setCheckedDepartments] = useState<Record<string, boolean>>({});
    const [checkedSubDepartments, setCheckedSubDepartments] = useState<Record<string, boolean>>({});
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const positions = useAdminJobStore((state) => state.positions);
    const departments = useAdminJobStore((state) => state.departments);
    const subDepartments = useAdminJobStore((state) => state.subDepartments);
    const setFields = useAdminJobStore((state) => state.setFields);

    const updateFields = () => {
        const selectedPositions = Object.keys(checkedPositions)
            .filter((id) => checkedPositions[+id])
            .map(Number);

        const selectedSubDepartments = Object.keys(checkedSubDepartments)
            .filter((id) => checkedSubDepartments[+id])
            .map(Number);

        setFields({
            positions: selectedPositions,
            subDepartments: selectedSubDepartments,
            startDate,
            endDate,
        });
    };

    const handleSubDepartmentChange = (subDepartmentId: number) => {
        const subDep = subDepartments.find((sd) => sd.id === subDepartmentId);
        if (!subDep) return;

        const departmentId = subDep.department_id;

        setCheckedSubDepartments((prev) => ({
            ...prev,
            [subDepartmentId]: !prev[subDepartmentId],
        }));

        // Luôn tick department cha khi có sub được tick
        setCheckedDepartments((prev) => ({
            ...prev,
            [departmentId]: true,
        }));
    };

    const handleDepartmentChange = (departmentId: number) => {
        const relatedSubDepartments = subDepartments.filter(
            (sd) => sd.department_id === departmentId
        );

        setCheckedDepartments((prev) => {
            const isChecked = !prev[departmentId];

            setCheckedSubDepartments((prevSub) => {
                const newState = { ...prevSub };

                if (isChecked) {
                    // Tick department thì tick tất cả sub (kể cả is_general)
                    relatedSubDepartments.forEach((sd) => {
                        newState[sd.id] = true;
                    });
                } else {
                    // Untick department thì bỏ tất cả sub
                    relatedSubDepartments.forEach((sd) => {
                        delete newState[sd.id];
                    });
                }

                return newState;
            });

            return {
                ...prev,
                [departmentId]: isChecked,
            };
        });
    };

    const handlePositionChange = (position: number) => {
        setCheckedPositions((prev) => ({
            ...prev,
            [position]: !prev[position],
        }));
    };

    const getVisibleSubDepartments = (departmentId: number) =>
        subDepartments?.filter((sd) => sd.department_id === departmentId && !sd.is_general) ?? [];

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
                        {positions.map((position) => (
                            <div key={position.id} className="flex">
                                <span className="flex-1 text-primary-text">- {position.name}</span>
                                <input
                                    type="checkbox"
                                    checked={!!checkedPositions[position.id]}
                                    onChange={() => handlePositionChange(position.id)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="admin-page-side-view-part-default border-none">
                        <span className="font-medium text-lg">Đơn vị tuyển dụng</span>
                        {departments.map((dep) => (
                            <div key={dep.id} className="flex flex-col gap-3">
                                <div className="flex items-center">
                                    <span className="flex-1 text-primary-text">- {dep.name}</span>
                                    <input
                                        type="checkbox"
                                        checked={!!checkedDepartments[dep.id]}
                                        onChange={() => handleDepartmentChange(dep.id)}
                                    />
                                </div>

                                {getVisibleSubDepartments(dep.id).length > 0 && (
                                    <div className="flex flex-col pl-6 gap-3">
                                        {getVisibleSubDepartments(dep.id).map((sd) => (
                                            <div key={sd.id} className="flex gap-10 items-center">
                                                <span className="flex-1 text-primary-text">
                                                    + {sd.name}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={!!checkedSubDepartments[sd.id]}
                                                    onChange={() =>
                                                        handleSubDepartmentChange(sd.id)
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
