"use client";

import { Toaster, ToastBar, toast } from "react-hot-toast";

const ToastProvider = () => {
    return (
        <Toaster position="top-right" reverseOrder={false}>
            {(t) => (
                <ToastBar
                    toast={t}
                    style={{
                        ...t.style,
                        cursor: "pointer",
                    }}>
                    {({ icon, message }) => (
                        <div
                            className="flex items-center w-full h-full"
                            onClick={() => toast.dismiss(t.id)}>
                            {icon}
                            <div>{message}</div>
                        </div>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
};

export default ToastProvider;
