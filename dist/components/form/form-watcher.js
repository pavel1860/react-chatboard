import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import InputLabel from "./InputLabel";
/**
 * A component that watches external state and syncs it with the form
 * This component doesn't render any UI - it just connects external state to the form
 *
 * @param {string} props.field - The field name to sync
 * @param {any} props.value - The external value to watch
 * @param {string} [props.prefix] - Optional prefix for nested usage
 */
export function FormWatcher({ field, value, prefix, label, hideValue = false, icon, labelWidth }) {
    const { setValue } = useFormContext();
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;
    useEffect(() => {
        // Only update if the value is not null/undefined
        if (value !== null && value !== undefined) {
            setValue(fieldName, value);
        }
    }, [value, fieldName, setValue]);
    // This component doesn't render anything
    // return <div className="text-sm text-gray-400">{label}: {!hideValue && value}</div>;
    if (hideValue)
        return null;
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(InputLabel, { fieldName: fieldName, label: label, icon: icon, labelWidth: labelWidth }), _jsx("div", { className: "text-sm text-gray-400", children: value })] }));
}
//# sourceMappingURL=form-watcher.js.map