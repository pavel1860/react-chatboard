import { FormProps } from "./types";
/**
 * @param {Object} props
 * @param {ZodSchema} props.schema - The Zod schema to validate the form
 * @param {Function} props.onSubmit - Callback when the form is submitted
 * @param {Object} props.defaultValues - The initial form values
 * @param {React.ReactNode} props.children - The form fields
 */
export declare function Form({ isReadOnly, schema, onSubmit, defaultValues, variant, controls, iconPlacement, radius, size, gap, labelWidth, inputWidth, children }: FormProps): import("react/jsx-runtime").JSX.Element;
export declare function ErrorList({ errors, prefix }: {
    errors: any;
    prefix?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=form.d.ts.map