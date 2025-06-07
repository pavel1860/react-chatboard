import { ReactNode } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { ZodSchema, ZodTypeAny, z } from 'zod';


export interface InputStyleProps {
    variant?: "flat" | "bordered" | "faded" | "underlined"
    controls?: "top" | "bottom"
    iconPlacement?: "left" | "inputStart" | "inputEnd"
    radius?: "none" | "sm" | "md" | "lg" | "full" | undefined
    size?: "sm" | "md" | "lg",
    color?: "primary" | "secondary" | "tertiary" | "success" | "warning" | "error" | "info" | "default"
    inputWidth?: string;
    labelWidth?: string;
    isReadOnly?: boolean;
}



export interface FormProps<T extends ZodTypeAny = ZodTypeAny> extends InputStyleProps {
    schema: T;
    defaultValues?: Partial<z.infer<T>>;
    onSubmit: SubmitHandler<z.infer<T>>;
    isReadOnly?: boolean;
    gap?: string;
    labelWidth?: string;
    inputWidth?: string;
    children: React.ReactNode;
}



export interface InputFieldProps extends InputStyleProps {
    /** The input type (e.g., "text", "number", "email", etc.) */
    type: string;
    /** A user-friendly label for the field */
    label?: string;
    /**
     * The field name (e.g. "name" or "meals.0.calories").
     * This is **required**. 
     */
    field: string;
    /**
     * An optional prefix used for deeper nesting (e.g. "meals.0")
     * If provided, we'll combine it with `field` -> `${prefix}.${field}`
     */
    prefix?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    icon?: React.ReactNode;
    classNames?: any;
    inputWidth?: string;
    labelWidth?: string;
    isReadOnly?: boolean;
}








export interface ObjectFieldProps {
    /**
     * The field name for the nested object (e.g. "food").
     * This will be used to prefix child fields.
     */
    field: string;
    /**
     * An optional prefix for deeper nesting (e.g. "meals.0").
     * Combined with `field` to produce `"meals.0.food"`.
     */
    prefix?: string;
    /** The child fields (e.g. <InputField />, more <ObjectField/>, etc.) */
    children: ReactNode;
}




export interface ArrayFieldProps {
    /**
     * The array field name (e.g., "meals").
     * This will be used in `useFieldArray` and to prefix child fields.
     */
    field: string;
    /**
     * The child fields. Typically includes <InputField />, <ObjectField />,
     * or other nested components.
     */
    children: ReactNode;
    /**
     * An optional callback to render extra actions for each item (like a "Remove" button).
     * Provides the `index` of the item and the `remove` function from `useFieldArray`.
     */
    renderItemActions?: (index: number, remove: (index: number) => void) => ReactNode;
}
