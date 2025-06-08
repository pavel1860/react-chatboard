import React from "react";

interface InputLabelProps {
    fieldName: string;
    label?: string;
    icon?: React.ReactNode;
    labelWidth?: string;
}

const InputLabel: React.FC<InputLabelProps> = ({ fieldName, label, icon, labelWidth }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5">
                {icon}
            </div>
            {label && (
                <label
                    htmlFor={fieldName}
                    className="whitespace-nowrap block z-10 subpixel-antialiased text-small pointer-events-none relative text-foreground will-change-auto origin-top-left rtl:origin-top-right !duration-200 !ease-out transition-[transform,color,left,opacity] motion-reduce:transition-none ps-2 pe-2"
                    style={{ width: labelWidth || "150px" }}
                >
                    {label}
                </label>
            )}
        </div>
    );
};

export default InputLabel; 