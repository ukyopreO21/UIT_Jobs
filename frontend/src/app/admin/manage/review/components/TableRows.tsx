import Application from "@/types/Application";
import { formatDatetime } from "@/utils/format-date";
import { AiOutlineFileText } from "react-icons/ai";

const TableRows = ({
    data,
    colsToFill,
    toggleSideView,
    handleLoadData,
}: {
    data: Array<Application> | null;
    colsToFill: Array<keyof Application>;
    toggleSideView: () => void;
    handleLoadData: (item: Application) => void;
}) => {
    const statusOptions = [
        { label: "Đã ghi nhận", color: "text-sky-700", background: "bg-sky-200/75" },
        { label: "Đang phỏng vấn", color: "text-yellow-700", background: "bg-yellow-200/75" },
        { label: "Được tuyển dụng", color: "text-green-700", background: "bg-green-200/75" },
        { label: "Bị từ chối", color: "text-red-700", background: "bg-red-200/75" },
    ];

    return (
        <tbody>
            {data?.map((item, rowIdx) => (
                <tr
                    key={rowIdx}
                    className={`h-20 ${rowIdx % 2 === 0 ? "bg-white" : "bg-[#f9fafa]"}`}>
                    {colsToFill.map((col, colIdx) => {
                        const value = item[col];
                        return (
                            <td key={`${rowIdx}-${colIdx}`}>
                                <div className="px-4 py-2 text-center">
                                    {col === "status" ? (
                                        <span
                                            className={`p-2 rounded-lg inline-block ${
                                                statusOptions.find(
                                                    (option) => option.label === value
                                                )?.color ?? ""
                                            } ${
                                                statusOptions.find(
                                                    (option) => option.label === value
                                                )?.background ?? ""
                                            }`}>
                                            {value ?? ""}
                                        </span>
                                    ) : col === "created_at" || col === "updated_at" ? (
                                        value ? (
                                            formatDatetime(value)
                                        ) : (
                                            ""
                                        )
                                    ) : (
                                        value ?? ""
                                    )}
                                </div>
                            </td>
                        );
                    })}
                    <td>
                        <div className="px-4 py-2 flex justify-center items-center">
                            <button
                                onClick={() => {
                                    handleLoadData(item);
                                    toggleSideView();
                                }}
                                className="bg-[#dbe4ff] border-[#4263eb] rounded-md h-10 w-10 flex justify-center items-center cursor-pointer
											transition duration-200 ease-in-out hover:bg-[#4263eb] text-[#4263eb] hover:text-[#dbe4ff]">
                                <AiOutlineFileText size={20} />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default TableRows;
