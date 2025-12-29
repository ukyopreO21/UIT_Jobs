import { forwardRef } from "react";

const Modal = forwardRef<HTMLDivElement, { title: string; content: string; onClick: () => void }>(
    ({ title, content, onClick }, ref) => {
        return (
            <div
                ref={ref}
                className="fixed top-1/2 left-1/2 w-[calc(100%-32px)] max-w-120 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 rounded-md bg-white p-4">
                <div className="text-base bp4:text-lg font-medium">{title}</div>
                <div className="text-default text-primary-text whitespace-pre-line">{content}</div>
                <div className="flex justify-end">
                    <button
                        onClick={onClick}
                        className="button-default rounded-md text-secondary-blue-dark hover:text-secondary-blue-dark-extra bg-secondary-blue-light hover:bg-secondary-blue-light-extra transition-default">
                        OK
                    </button>
                </div>
            </div>
        );
    }
);

export default Modal;
