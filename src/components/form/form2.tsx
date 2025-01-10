// Form.jsx
import React from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProps } from "./types";





interface UseFormCtx {
    isReadOnly: boolean
}


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
        }
    }

    const handleSubmit = methods.handleSubmit(onSubmit);

    return (
        <FormProvider {...extendedMethods}>
            <form onSubmit={handleSubmit}>{children}</form>
        </FormProvider>
    );
}




