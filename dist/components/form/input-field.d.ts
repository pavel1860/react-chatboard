import { InputFieldProps } from "./types";
/**
 * @param {Object} props
 * @param {string} props.type - The input type (e.g. "text", "number", etc.)
 * @param {string} props.label - A user-friendly label for the field
 * @param {string} props.field - The field name (can be nested, e.g. "meals.0.calories")
 * @param {string} [props.prefix] - Optional prefix for nested usage (ArrayField / ObjectField)
 */
export declare function InputField({ type, label, field, prefix, icon, inputWidth, labelWidth, ...props }: InputFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=input-field.d.ts.map