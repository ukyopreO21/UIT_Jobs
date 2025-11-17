import Application from "@/types/Application";
import { formatDatetime } from "@/utils/format-date";
import { AiOutlineFileText } from "react-icons/ai";

const ManageList = ({
    data,
    colsToFill,
    toggleViewDetail,
    handleLoadData,
}: {
    data: Array<Application> | null;
    colsToFill: Array<keyof Application>;
    toggleViewDetail: () => void;
    handleLoadData: (item: Application) => void;
}) => {
    return (
        <tbody>
            {data?.map((item, rowIdx) => (
                <tr
                    key={rowIdx}
                    className={`h-20 ${rowIdx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                    {colsToFill.map((col, colIdx) => {
                        const value = item[col];
                        return (
                            <td key={`${rowIdx}-${colIdx}`}>
                                <div className="px-4 py-2 text-center">
                                    {col === "created_at" || col === "updated_at"
                                        ? value
                                            ? formatDatetime(value)
                                            : ""
                                        : value ?? ""}
                                </div>
                            </td>
                        );
                    })}
                    <td>
                        <div className="px-4 py-2 flex justify-center items-center">
                            <button
                                onClick={() => {
                                    handleLoadData(item);
                                    toggleViewDetail();
                                }}
                                className="bg-[#dbe4ff] border-[#4263eb] rounded-md h-10 px-2 cursor-pointer
							transition duration-200 ease-in-out hover:bg-[#dbe4ff]">
                                <AiOutlineFileText size={20} className="text-[#4263eb]" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default ManageList;
