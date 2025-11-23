import Job from "@/types/Job";
import { formatDate } from "@/utils/format-date";
import { AiOutlineFileText } from "react-icons/ai";

const TableRows = ({
    data,
    colsToFill,
    toggleSideView,
    handleLoadData,
}: {
    data: Array<Job> | null;
    colsToFill: Array<keyof Job>;
    toggleSideView: () => void;
    handleLoadData: (item: Job) => void;
}) => {
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
                                <div className="px-4 py-2 text-center text-responsive">
                                    {col === "deadline"
                                        ? value
                                            ? formatDate(value)
                                            : ""
                                        : (value ?? "")}
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
                                className="rounded-md flex justify-center items-center cursor-pointer
										bg-[#dbe4ff] border-[#4263eb] transition duration-200 ease-in-out hover:bg-[#4263eb] text-[#4263eb] hover:text-[#dbe4ff]
										h-9 w-9 lg:h-10 lg:w-10">
                                <AiOutlineFileText className="icon-responsive" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default TableRows;
