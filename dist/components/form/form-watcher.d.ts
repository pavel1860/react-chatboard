import React from "react";
interface FormWatcherProps {
    field: string;
    value: any;
    prefix?: string;
    label?: string;
    hideValue?: boolean;
    icon?: React.ReactNode;
    labelWidth?: string;
}
/**
 * A component that watches external state and syncs it with the form
 * This component doesn't render any UI - it just connects external state to the form
 *
 * @param {string} props.field - The field name to sync
 * @param {any} props.value - The external value to watch
 * @param {string} [props.prefix] - Optional prefix for nested usage
 */
export declare function FormWatcher({ field, value, prefix, label, hideValue, icon, labelWidth }: FormWatcherProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=form-watcher.d.ts.map