import Application from "@/types/Application";
import { formatDatetime } from "@/utils/format-date";
import { AiOutlineFileText } from "react-icons/ai";
import LoadingLink from "@/components/LoadingLink";

const statusOptions = [
    {
        label: "Đã ghi nhận",
        color: "text-secondary-blue-dark",
        background: "bg-secondary-blue-light",
    },
    {
        label: "Đang phỏng vấn",
        color: "text-secondary-yellow-dark",
        background: "bg-secondary-yellow-light",
    },
    {
        label: "Được tuyển dụng",
        color: "text-secondary-green-dark",
        background: "bg-secondary-green-light",
    },
    {
        label: "Bị từ chối",
        color: "text-secondary-red-dark",
        background: "bg-secondary-red-light",
    },
];

const TableRows = ({
    data,
    colsToFill,
}: {
    data: Array<Application> | null;
    colsToFill: Array<keyof Application>;
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
                                <div className="px-4 py-2 text-center">
                                    {col === "status" ? (
                                        <span
                                            className={`p-2 rounded-lg inline-block text-default ${
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
                                            <span className="text-default">
                                                {formatDatetime(String(value))}
                                            </span>
                                        ) : (
                                            ""
                                        )
                                    ) : (
                                        <span className="text-default">{value ?? ""}</span>
                                    )}
                                </div>
                            </td>
                        );
                    })}
                    <td>
                        <div className="px-4 py-2 flex-center">
                            <LoadingLink
                                href={`/admin/manage/review/${item.id}`}
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
