import { useFormContext } from "react-hook-form";
import { InputStyleProps } from "./types";
import { z } from "zod";




function isNumeric(str: any) {
    // First ensure the input is actually a string
    if (typeof str !== 'string') return false;

    // Check if it's not NaN when parsed as a float
    // @ts-ignore
    return !isNaN(str) && !isNaN(parseFloat(str));
}


const toTitleCase = (str: string) => {
    return str
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (s) => s.toUpperCase())
        .replace("_", " ") // Capitalize first letter
        .trim();
};



// export function fieldExistsInSchema(schema: z.ZodTypeAny, fieldPath: string): boolean {
//     const pathSegments = fieldPath.split('.');
//     let currentSchema: z.ZodTypeAny = schema;

//     for (const segment of pathSegments) {
//         if (currentSchema instanceof z.ZodObject) {
//             const shape = currentSchema._def.shape();
//             if (!(segment in shape)) {
//                 return false;
//             }
//             currentSchema = shape[segment];
//         } else if (currentSchema instanceof z.ZodArray) {
//             currentSchema = currentSchema._def.type;
//         } else {
//             return false;
//         }
//     }

//     return true;
// }

export function fieldExistsInSchema(schema: z.ZodTypeAny, fieldPath: string): boolean {
    const pathSegments = fieldPath.split('.');
    let currentSchema: z.ZodTypeAny = schema;
    let prevSegment: string | number | undefined = undefined;   
    for (const segment of pathSegments) {
        if (currentSchema instanceof z.ZodObject) {
            const shape = currentSchema._def.shape();
            if (!(segment in shape)) {
                return false;
            }
            currentSchema = shape[segment];
        } else if (currentSchema instanceof z.ZodArray) {
            // If the current schema is an array, move to the element type
            currentSchema = currentSchema._def.type;
            // Check if the segment is a number (array index)
            if (!isNaN(Number(segment))) {
                continue; // Skip the index as it doesn't affect the schema structure
            } else {
                return false; // If it's not a number, the path is invalid
            }
        } else {
            return false;
        }
        prevSegment = segment;
    }

    return true;
}




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
    // @ts-ignore
    const { register, control, formState: { errors }, isReadOnly, schema, style } = useFormContext();


    return {
        register,
        control,
        errors,
        isReadOnly, // Ensure this is correctly passed down
        schema,     // Ensure this is correctly passed down
        style,      // Ensure this is correctly passed down
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
        color: props.color || style.color,
        inputWidth: props.inputWidth || style.inputWidth,
        labelWidth: props.labelWidth || style.labelWidth,
        isReadOnly: props.isReadOnly || style.isReadOnly,
    }
}



export const useFieldValues = (fieldPath: string) => {
    const {getFieldSchema: getFieldType} = useFormCtx();
    const enumValues = (getFieldType(fieldPath) as z.ZodEnum<[string, ...string[]]>).enum;
    const selectValues = Object.keys(enumValues).map((option) => ({ label: toTitleCase(option), value: enumValues[option] }));   
    return selectValues;
}