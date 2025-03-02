// InputField.jsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Select, SelectItem, Skeleton, Form, Button } from '@nextui-org/react';
import { InputFieldProps, InputStyleProps } from "./types";
import { useInputStyle } from "./form-utils";





const InputComp = ({ 
        type, 
        label, 
        field, 
        fieldInfo,
        prefix, 
        fieldName, 
        variant, 
        radius, 
        size, 
        // icon 
    }: InputFieldProps & {fieldName: string, fieldInfo: any}) => {


    const {
        variant: inputVariant,
        radius: inputRadius,
        size: inputSize,
    } = useInputStyle({variant, radius, size});

    if (type === "text") {
        return (
            <Input
                // isReadOnly={isReadOnly}
                id={fieldName}
                variant={inputVariant}
                radius={inputRadius}
                size={inputSize}
                // startContent={icon}

                {...fieldInfo}
                placeholder={label}
            />
        );
    } else if (type=="number") {
        return (
            <Input
                id={fieldName}
                // isReadOnly={isReadOnly}
                type="number"
                variant={inputVariant}
                radius={inputRadius}
                size={inputSize}
                {...fieldInfo}
                onChange={(e) => {
                    const value = e.target.value;
                    fieldInfo.onChange(value == "" ? undefined : Number(value));
                }}
                placeholder={label}
                // classNames={{
                //     // mainWrapper: "h-1",
                //     // inputWrapper: "h-1",
                //     // helperWrapper: "h-1",
                // }}
            />
        )
    }


};



/**
 * @param {Object} props
 * @param {string} props.type - The input type (e.g. "text", "number", etc.)
 * @param {string} props.label - A user-friendly label for the field
 * @param {string} props.field - The field name (can be nested, e.g. "meals.0.calories")
 * @param {string} [props.prefix] - Optional prefix for nested usage (ArrayField / ObjectField)
 */
export function InputField({ 
    type, 
    label, 
    field, 
    prefix,
    icon,
    ...props
}: InputFieldProps) {
    const { register, control, formState: { errors }, isReadOnly } = useFormContext();
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;
    
    return (
        <Controller
            //@ts-ignore
            name={fieldName as keyof z.infer<T>}
            control={control}
            render={({ field: fieldInfo }) => (
                <div className="flex items-center gap-3 justify-between  w-full">
                    <div className="w-5">
                        {icon}
                    </div>
                    { label && <label
                        htmlFor={fieldName}
                        // style={{ display: "block", marginBottom: 4 }}
                        className="whitespace-nowrap block z-10 subpixel-antialiased text-small pointer-events-none relative text-foreground will-change-auto origin-top-left rtl:origin-top-right !duration-200 !ease-out transition-[transform,color,left,opacity] motion-reduce:transition-none ps-2 pe-2 w-[150px]"
                    >
                        {label}
                    </label>}
                    {/* <input
                        id={fieldName}
                        type={type}
                        {...register(fieldName)}
                        style={{ padding: 8, width: "100%" }}
                    /> */}
                    {isReadOnly ? 
                        <span
                            className="relative inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium flex-1 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background is-filled"
                        >{fieldInfo.value}</span> : InputComp({ type, label, field, fieldInfo, prefix, fieldName, ...props })}

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
