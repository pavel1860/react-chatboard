import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import InputLabel from "./InputLabel";

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
export function ArrayFormWatcher({ 
    field, 
    value, 
    prefix, 
    label, 
    hideValue = false, 
    icon, 
    labelWidth 
}: ArrayFormWatcherProps) {
    const { setValue } = useFormContext();
    
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;
    
    useEffect(() => {
        // Only update if the value is not null/undefined and is an array
        if (value !== null && value !== undefined && Array.isArray(value)) {
            setValue(fieldName, value);
        }
    }, [value, fieldName, setValue]);

    if (hideValue) return null;
    
    return (
        <div className="flex items-center gap-3">
            <InputLabel
                fieldName={fieldName}
                label={label}
                icon={icon}
                labelWidth={labelWidth}
            />
            <div className="text-sm text-gray-400">
                {Array.isArray(value) ? `${value.length} items` : 'Not an array'}
            </div>
        </div>
    );
}

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
export function ArrayItemFormWatcher({ 
    field, 
    value, 
    arrayIndex, 
    prefix, 
    label, 
    hideValue = false, 
    icon, 
    labelWidth 
}: ArrayItemFormWatcherProps) {
    const { setValue, getValues } = useFormContext();
    
    // Build the final field name for the specific array item
    const fieldName = prefix ? `${prefix}.${field}.${arrayIndex}` : `${field}.${arrayIndex}`;
    
    useEffect(() => {
        // Only update if the value is not null/undefined
        if (value !== null && value !== undefined) {
            setValue(fieldName, value);
        }
    }, [value, fieldName, setValue]);

    if (hideValue) return null;
    
    return (
        <div className="flex items-center gap-3">
            <InputLabel
                fieldName={fieldName}
                label={label || `Item ${arrayIndex}`}
                icon={icon}
                labelWidth={labelWidth}
            />
            <div className="text-sm text-gray-400">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </div>
        </div>
    );
}

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

export function ArrayMergeFormWatcher({ 
    field, 
    value, 
    prefix, 
    label, 
    hideValue = false, 
    icon, 
    labelWidth,
    mergeStrategy = 'append'
}: ArrayMergeFormWatcherProps) {
    const { setValue, getValues } = useFormContext();
    
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;
    
    useEffect(() => {
        if (value !== null && value !== undefined && Array.isArray(value)) {
            const currentValue = getValues(fieldName);
            
            let newValue: any[];
            if (mergeStrategy === 'replace') {
                newValue = value;
            } else if (mergeStrategy === 'append') {
                newValue = Array.isArray(currentValue) ? [...currentValue, ...value] : value;
            } else if (mergeStrategy === 'prepend') {
                newValue = Array.isArray(currentValue) ? [...value, ...currentValue] : value;
            } else {
                newValue = value;
            }
            
            setValue(fieldName, newValue);
        }
    }, [value, fieldName, setValue, getValues, mergeStrategy]);

    if (hideValue) return null;
    
    return (
        <div className="flex items-center gap-3">
            <InputLabel
                fieldName={fieldName}
                label={label}
                icon={icon}
                labelWidth={labelWidth}
            />
            <div className="text-sm text-gray-400">
                {Array.isArray(value) ? `${value.length} items (${mergeStrategy})` : 'Not an array'}
            </div>
        </div>
    );
} 