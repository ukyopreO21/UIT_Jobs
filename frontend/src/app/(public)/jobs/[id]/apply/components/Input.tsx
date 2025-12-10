interface InputProps {
    label: string;
    name: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ label, name, value, type = "text", onChange }: InputProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-primary-text text-default">{label}</label>
            <div className="input-container-default input-container-outline-default text-default transition-default">
                <input
                    name={name}
                    value={value}
                    type={type}
                    className="input-text-default"
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default Input;
