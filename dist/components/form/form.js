import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
/**
 * @param {Object} props
 * @param {ZodSchema} props.schema - The Zod schema to validate the form
 * @param {Function} props.onSubmit - Callback when the form is submitted
 * @param {Object} props.defaultValues - The initial form values
 * @param {React.ReactNode} props.children - The form fields
 */
export function Form({ isReadOnly, schema, onSubmit, defaultValues, variant, controls, iconPlacement, radius, size, gap, labelWidth, inputWidth, children }) {
    // Setup react-hook-form
    const methods = useForm({
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
    };
    const handleSubmit = methods.handleSubmit((data) => {
        if (onSubmit)
            onSubmit(data);
    });
    return (_jsxs(FormProvider, { ...extendedMethods, children: [_jsx("form", { onSubmit: handleSubmit, style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: gap,
                    // justifyContent: "flex-start", 
                    // alignItems: "flex-start"
                }, children: children }), _jsx("div", { className: "mt-2", children: _jsx(ErrorList, { errors: methods.formState.errors }) })] }));
}
export function ErrorList({ errors, prefix = "" }) {
    return (_jsx("div", { className: "mt-2", children: Object.keys(errors).map((field) => (_jsxs("p", { className: "text-xs text-red-500", children: [prefix, field, ": ", Array.isArray(errors[field]) ? errors[field].map((errItem, index) => _jsx(ErrorList, { errors: errItem, prefix: `${index}.` })) : errors[field]?.message] }, field))) }));
}
//# sourceMappingURL=form.js.map