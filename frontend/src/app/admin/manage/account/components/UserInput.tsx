import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineEdit } from "react-icons/ai";
import { useState } from "react";

interface UserInputProps {
    label: string;
    name: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserInput = ({ label, name, value, type = "text", onChange }: UserInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";
    const currentType = isPasswordField && showPassword ? "text" : type;

    return (
        <div className="flex flex-col gap-2">
            <label className="text-primary-text text-default">{label}</label>
            <div className="input-container-default input-container-outline-default text-default transition-default xl:w-90">
                <input
                    name={name}
                    type={currentType}
                    value={value}
                    className="input-text-default"
                    onChange={onChange}
                />

                {isPasswordField ? (
                    <button
                        className="flex-center h-full transition-default hover:text-secondary-text-dark"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? (
                            <AiOutlineEyeInvisible className="icon-default" />
                        ) : (
                            <AiOutlineEye className="icon-default" />
                        )}
                    </button>
                ) : (
                    <AiOutlineEdit className="icon-default" />
                )}
            </div>
        </div>
    );
};

export default UserInput;
