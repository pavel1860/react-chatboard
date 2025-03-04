// InputField.jsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Select, SelectItem, Skeleton, Form, Button, Textarea } from '@nextui-org/react';
import { InputFieldProps, InputStyleProps } from "./types";
import { useInputStyle } from "./form-utils";
import PromptTextEditor from "../promptEditor/editors/promptTextEditor";









export function TextField({ 
    type, 
    label, 
    field, 
    prefix,
    icon,
    classNames,
    ...props
}: InputFieldProps) {
    const { register, control, formState: { errors }, isReadOnly } = useFormContext();
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;
    const {
        variant,
        radius,
        size,
    } = props;
    const {
        variant: inputVariant,
        radius: inputRadius,
        size: inputSize,
    } = useInputStyle({variant, radius, size});
    
    return (
        <Controller
            //@ts-ignore
            name={fieldName as keyof z.infer<T>}
            control={control}
            render={({ field: fieldInfo }) => (
                <div className="flex items-center gap-3 justify-between">
                    {/* <div className="w-5">
                        {icon}
                    </div> */}
                    {/* { label && <label
                        htmlFor={fieldName}
                        className="whitespace-nowrap block z-10 subpixel-antialiased text-small pointer-events-none relative text-foreground will-change-auto origin-top-left rtl:origin-top-right !duration-200 !ease-out transition-[transform,color,left,opacity] motion-reduce:transition-none ps-2 pe-2 w-[150px]"
                    >
                        {label}
                    </label>} */}
                    {isReadOnly ? 
                        <span
                            className="relative inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium flex-1 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background is-filled"
                        >{fieldInfo.value}</span> :<Textarea
                            id={fieldName}
                            // isReadOnly={isReadOnly}
                            type="number"
                            variant={inputVariant}
                            radius={inputRadius}
                            size={inputSize}
                            {...fieldInfo}
                            // onChange={(e) => {
                            //     const value = e.target.value;
                            //     fieldInfo.onChange(value == "" ? undefined : Number(value));
                            // }}
                            placeholder={label}
                            classNames={classNames}
                            // classNames={{
                            //     // base: "bg-blue-500 text-red-400",
                            //     inputWrapper: "bg-blue-500",
                            //     // "innerWrapper": "text-gray-300",
                            //     // input: "!text-red-500 text-2xl"
                            //     input: "!text-[#FFFFFF]"

                            // }}
                            
                        />}

                    {errors[fieldName] && (
                        <div style={{ color: "red", marginTop: 4 }}>
                            {errors[fieldName].message?.toString()}
                        </div>
                    )}
                </div>
            )} 
        />
    );
}
