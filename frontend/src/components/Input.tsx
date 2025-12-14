import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineEdit } from "react-icons/ai";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/format-date";

interface InputProps {
    label: string;
    name: string;
    value: string | number;
    type?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    width?: string;
    showPenIcon?: boolean;
    disabled?: boolean;
}

const isValidISODateString = (str: string | number) => {
    if (!str) return false;
    return /^\d{4}-\d{2}-\d{2}$/.test(String(str));
};

const Input = ({
    label,
    name,
    value,
    type = "text",
    placeholder,
    onChange,
    width,
    showPenIcon,
    disabled,
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";

    let displayValue = value;

    if (type === "date") {
        if (isValidISODateString(value)) {
            displayValue = value;
        } else {
            const formatted = formatDate(String(value), "YYYY-MM-DD");
            displayValue =
                formatted === "Invalid date" || formatted === "Invalid Date" ? "" : formatted;
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="text-primary-text text-default">{label}</label>
            <div
                className={`input-container-default input-container-outline-default text-default transition-default ${width && width} ${disabled && "disabled"}`}>
                <input
                    name={name}
                    value={displayValue}
                    type={isPasswordField && showPassword ? "text" : type}
                    className="input-text-default"
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
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
                    showPenIcon && <AiOutlineEdit className="icon-default" />
                )}
            </div>
        </div>
    );
};

export default Input;
