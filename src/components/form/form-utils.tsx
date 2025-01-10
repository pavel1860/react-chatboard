import { useFormContext } from "react-hook-form";
import { InputStyleProps } from "./types";
import { z } from "zod";




function isNumeric(str: any) {
    // First ensure the input is actually a string
    if (typeof str !== 'string') return false;

    // Check if it's not NaN when parsed as a float
    return !isNaN(str) && !isNaN(parseFloat(str));
}


const toTitleCase = (str: string) => {
    return str
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (s) => s.toUpperCase())
        .replace("_", " ") // Capitalize first letter
        .trim();
};



export function getZodFieldByPath(
    schema: z.ZodTypeAny,
    path: Array<string | number>
): z.ZodTypeAny | undefined {
    let current: z.ZodTypeAny = schema;

    for (const segment of path) {
        if (current instanceof z.ZodObject) {
            // If we're dealing with an object, get its shape
            const shape = current._def.shape();
            // The path segment must be a string to index into an object
            if (typeof segment !== 'string') {
                // e.g., tried to use a numeric index in an object
                return undefined;
            }
            const next = shape[segment];
            if (!next) {
                // No field by that name
                return undefined;
            }
            current = next;
        } else if (current instanceof z.ZodArray) {
            // If we're dealing with an array, the next step is the element type
            // The path segment must be a number to index the array
            // if (typeof segment !== 'number') {
            //     // e.g., tried to use a string key on an array
            //     return undefined;
            // }
            if (!isNumeric(segment)) {
                // e.g., tried to use a string key on an array
                return undefined;
            }
            // We don't care about the actual array index for the schema, 
            // we just move to the element type
            current = current._def.type;
        } else {
            // We've hit a non-object, non-array schema and still have path left
            return undefined;
        }
    }

    return current;
}



interface UseFormCtx {
    isReadOnly: boolean
}

const useFormCtx = () => {
    const { register, control, formState: { errors }, isReadOnly, schema, style } = useFormContext();


    return {
        register,
        control,
        errors,
        isReadOnly,
        schema,
        style,
        getFieldSchema: (fieldPath: string) => {
            const fieldSchema = getZodFieldByPath(schema, fieldPath?.split("."));
            return fieldSchema
        }
    }

}




export const useInputStyle = (props: InputStyleProps) => {
    const { style } = useFormCtx();

    return {        
        variant: props.variant || style.variant,
        radius: props.radius || style.radius,
        size: props.size || style.size,
    }
}



export const useFieldValues = (fieldPath: string) => {
    const {getFieldSchema: getFieldType} = useFormCtx();
    const enumValues = (getFieldType(fieldPath) as z.ZodEnum<[string, ...string[]]>).enum;
    const selectValues = Object.keys(enumValues).map((option) => ({ label: toTitleCase(option), value: enumValues[option] }));   
    return selectValues;
}