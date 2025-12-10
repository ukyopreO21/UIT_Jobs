import { on } from "events";
import { useRef, useEffect } from "react";

interface TextareaProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name: string;
}

export default ({ label, value, name, onChange }: TextareaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    useEffect(() => {
        const handleWindowResize = () => adjustHeight();
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return (
        <div className="flex flex-col gap-2 h-fit">
            <label className="text-primary-text text-default">{label}</label>
            <div className="flex items-center gap-3 px-3 min-h-9 lg:min-h-10 input-container-outline-default text-default transition-default">
                <textarea
                    ref={textareaRef}
                    name={name}
                    value={value}
                    className="input-text-default overflow-hidden resize-none py-2"
                    onChange={onChange}
                    rows={1}
                />
            </div>
        </div>
    );
};
