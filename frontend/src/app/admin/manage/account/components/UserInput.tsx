const UserInput = ({
    label,
    name,
    value,
    type,
    onChange,
}: {
    label: string;
    name: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[#535458]">{label}</label>
            <input
                name={name}
                type={type ?? "text"}
                value={value}
                className="w-90 h-10 border-none outline outline-[#e7e7e8] px-2 focus-within:outline-2 focus-within:outline-[#4263eb] transition duration-200 ease-in-out rounded-md"
                onChange={onChange}></input>
        </div>
    );
};

export default UserInput;
