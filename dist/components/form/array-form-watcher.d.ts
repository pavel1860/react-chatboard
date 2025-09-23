import React from "react";
interface ArrayFormWatcherProps {
    field: string;
    value: any[];
    prefix?: string;
    label?: string;
    hideValue?: boolean;
    icon?: React.ReactNode;
    labelWidth?: string;
}
/**
 * A component that watches external array state and syncs it with the form
 * This component replaces the entire array field with the watched value
 *
 * @param {string} props.field - The array field name to sync
 * @param {any[]} props.value - The external array value to watch
 * @param {string} [props.prefix] - Optional prefix for nested usage
 */
export declare function ArrayFormWatcher({ field, value, prefix, label, hideValue, icon, labelWidth }: ArrayFormWatcherProps): import("react/jsx-runtime").JSX.Element | null;
interface ArrayItemFormWatcherProps {
    field: string;
    value: any;
    arrayIndex: number;
    prefix?: string;
    label?: string;
    hideValue?: boolean;
    icon?: React.ReactNode;
    labelWidth?: string;
}
/**
 * A component that watches external state for a specific array item and syncs it with the form
 * This component updates a specific index in an array field
 *
 * @param {string} props.field - The array field name
 * @param {any} props.value - The external value to watch for this array item
 * @param {number} props.arrayIndex - The index in the array to update
 * @param {string} [props.prefix] - Optional prefix for nested usage
 */
export declare function ArrayItemFormWatcher({ field, value, arrayIndex, prefix, label, hideValue, icon, labelWidth }: ArrayItemFormWatcherProps): import("react/jsx-runtime").JSX.Element | null;
/**
 * A component that watches external state and merges it into an existing array
 * This is useful when you want to add items to an existing array without replacing it
 */
interface ArrayMergeFormWatcherProps {
    field: string;
    value: any[];
    prefix?: string;
    label?: string;
    hideValue?: boolean;
    icon?: React.ReactNode;
    labelWidth?: string;
    mergeStrategy?: 'append' | 'prepend' | 'replace';
}
export declare function ArrayMergeFormWatcher({ field, value, prefix, label, hideValue, icon, labelWidth, mergeStrategy }: ArrayMergeFormWatcherProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=array-form-watcher.d.ts.map