// Form.jsx
import React from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProps, UseFormCtx } from "./types";








/**
 * @param {Object} props
 * @param {ZodSchema} props.schema - The Zod schema to validate the form
 * @param {Function} props.onSubmit - Callback when the form is submitted
 * @param {Object} props.defaultValues - The initial form values
 * @param {React.ReactNode} props.children - The form fields
 */
export function Form({ 
        isReadOnly,
        schema, 
        onSubmit, 
        defaultValues, 
        variant,
        controls,
        iconPlacement,
        radius,
        size,
        gap,
        labelWidth,
        inputWidth,
        children
    }: FormProps) {
    // Setup react-hook-form
    const methods = useForm<UseFormCtx>({
        resolver: zodResolver(schema),
        defaultValues,
    });


    const extendedMethods = {
        ...methods,
        // Add a custom submit handler
        isReadOnly: isReadOnly,
        schema,
        style: {
            variant,
            controls,
            iconPlacement,
            radius,
            size,
            gap,
            labelWidth,
            inputWidth,
            isReadOnly: isReadOnly,
        }
    }

    


    const handleSubmit = methods.handleSubmit((data) => {
        if (onSubmit) onSubmit(data);
    });
    

    return (
        <FormProvider {...extendedMethods}>
            <form onSubmit={handleSubmit} style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: gap, 
                // justifyContent: "flex-start", 
                // alignItems: "flex-start"
            }}>{children}</form>
            <div className="mt-2">
                {/* {Object.keys(methods.formState.errors).map((field) => (
                    <p key={field} className="text-xs text-red-500">
                        {field}: {methods.formState.errors[field as keyof UseFormCtx]?.message}                       
                    </p>
                    ))} */}
                <ErrorList errors={methods.formState.errors} />
                </div>
        </FormProvider>
    );
}







export function ErrorList({errors, prefix = ""}: {errors: any, prefix?: string}){    
    return (
        <div className="mt-2">
            {Object.keys(errors).map((field) => (
                <p key={field} className="text-xs text-red-500">
                    {prefix}{field}: {Array.isArray(errors[field as keyof UseFormCtx]) ? errors[field as keyof UseFormCtx].map((errItem: any, index: number) => <ErrorList errors={errItem} prefix={`${index}.`} />) : errors[field as keyof UseFormCtx]?.message}
                </p>
            ))}
        </div>
    )
}