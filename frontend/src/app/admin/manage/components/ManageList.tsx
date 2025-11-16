import formatDate from "@/utils/format-date";

const ManageList = ({
    data,
    colToFill,
}: {
    data: Array<Record<string, any>> | null;
    colToFill: Array<string>;
}) => {
    return (
        <tbody>
            {data?.map((item, rowIdx) => (
                <tr key={rowIdx} className="h-20">
                    {colToFill.map((col, colIdx) => {
                        const value = item[col];
                        if (col === "created_at" || col === "updated_at") {
                            return (
                                <td key={`${rowIdx}-${colIdx}`} className="px-4 text-center">
                                    {value ? formatDate(value) : ""}
                                </td>
                            );
                        }
                        return (
                            <td key={`${rowIdx}-${colIdx}`} className="px-4 text-center">
                                {value ?? ""}
                            </td>
                        );
                    })}
                </tr>
            ))}
            <tr>
                <td></td>
            </tr>
        </tbody>
    );
};

export default ManageList;
