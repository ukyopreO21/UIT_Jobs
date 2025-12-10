const RecruitingUnit = ({
    company,
    department,
    unit,
    getListStyle,
}: {
    company: string;
    department: string;
    unit: string;
    getListStyle: (level: number) => string;
}) => {
    return (
        <div className="border border-primary-border rounded-lg p-4 flex flex-col">
            <label className="text-lg lg:text-xl font-medium border-b border-primary-border mb-3 pb-3">
                ĐƠN VỊ TUYỂN DỤNG
            </label>
            <ul className={`text-primary-text ${getListStyle(0)} pl-4`}>
                {company && <li>{company}</li>}
                <ul className={`text-primary-text ${getListStyle(1)} mt-2 pl-4`}>
                    {department && <li>{department}</li>}
                    <ul className={`text-primary-text ${getListStyle(2)} mt-2 pl-4`}>
                        {unit && <li>{unit}</li>}
                    </ul>
                </ul>
            </ul>
        </div>
    );
};

export default RecruitingUnit;
