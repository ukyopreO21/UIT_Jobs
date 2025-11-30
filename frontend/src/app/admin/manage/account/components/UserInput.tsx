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
            <label className="text-[#535458] text-responsive">{label}</label>
            <div
                className="flex items-center h-10 outline-1 outline-[#e7e7e8] px-2 focus-within:outline-2 focus-within:outline-[#4263eb] transition duration-200 ease-in-out rounded-md
                xl:w-90 text-responsive">
                <input
                    name={name}
                    type={currentType}
                    value={value}
                    className="w-full border-none outline-none"
                    onChange={onChange}
                />

                {isPasswordField ? (
                    <button
                        className="cursor-pointer hover:text-[#4263eb] transition duration-200 ease-in-out flex items-center justify-center"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? (
                            <AiOutlineEyeInvisible className="icon-responsive" />
                        ) : (
                            <AiOutlineEye className="icon-responsive" />
                        )}
                    </button>
                ) : (
                    <AiOutlineEdit className="icon-responsive" />
                )}
            </div>
        </div>
    );
};

export default UserInput;
