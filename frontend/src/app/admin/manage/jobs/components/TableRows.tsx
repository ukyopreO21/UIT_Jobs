import Job from "@/types/Job";
import { formatDate } from "@/utils/format-date";
import LoadingLink from "@/components/LoadingLink";
import { AiOutlineFileText } from "react-icons/ai";

const TableRows = ({
    data,
    colsToFill,
}: {
    data: Array<Job> | null;
    colsToFill: Array<keyof Job>;
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
                                            ? formatDate(String(value))
                                            : ""
                                        : (value ?? "")}
                                </div>
                            </td>
                        );
                    })}
                    <td>
                        <div className="px-4 py-2 flex-center">
                            <LoadingLink
                                href={`/admin/manage/jobs/${item.id}`}
                                className="rounded-md flex-center
										 	bg-secondary-blue-light text-secondary-blue-dark hover:bg-secondary-blue-light-extra hover:text-secondary-blue-dark-extra transition-default
											h-9 w-9 bp4:h-10 bp4:w-10">
                                <AiOutlineFileText className="icon-default" />
                            </LoadingLink>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default TableRows;
