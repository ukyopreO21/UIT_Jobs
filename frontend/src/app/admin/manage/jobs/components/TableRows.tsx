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
                    className={`h-20 ${rowIdx % 2 === 0 ? "bg-white" : "bg-primary-bg-50"}`}>
                    {colsToFill.map((col, colIdx) => {
                        const value = item[col];
                        return (
                            <td key={`${rowIdx}-${colIdx}`}>
                                <div className="px-4 py-2 text-center text-default">
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
                        <div className="px-4 py-2 flex-center">
                            <button
                                onClick={() => {
                                    handleLoadData(item);
                                    toggleSideView();
                                }}
                                className="rounded-md flex-center
										 	bg-secondary-blue-light text-secondary-blue-dark hover:bg-secondary-blue-light-extra hover:text-secondary-blue-dark-extra transition-default
											h-9 w-9 lg:h-10 lg:w-10">
                                <AiOutlineFileText className="icon-default" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default TableRows;
