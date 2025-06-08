

import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useCallback, useEffect, useMemo, useState } from "react";
import { camelToSnake, convertKeysToSnakeCase } from "../model/services/model-context";



export interface UseQueryBuilderHook<T extends Record<string, any>> {
    // The array of filter strings (including any default filters)
    filters: string[];

    // Adds a filter condition. The tuple's types are inferred from your Zod schema.
    where: <K extends keyof T>(
        filter: [K, FilterOperators<T[K]>, T[K]]
    ) => void;

    // Builds and returns the complete query string (e.g., "name==arnold&and&final_score>=15")
    build: () => string;

    // Resets the filter state to an empty array.
    reset: () => void;

    queryString: string;
}


export type FilterOperators<T> = T extends number
    ? '==' | '>' | '<' | '>=' | '<='
    : T extends string
    ? '==' | 'contains'
    : never;

// A tuple representing a condition for a given field.
export type FilterTuple<T> = [keyof T, FilterOperators<T[keyof T]>, T[keyof T]];

// A default filter can be a tuple or a logical operator ("and" or "or").
export type DefaultFilter<T> = FilterTuple<T> | 'and' | 'or';

/**
 * A React hook for building query parameters with Zod validation.
 *
 * @param schema A Zod object schema defining valid fields and their types.
 * @param defaultFilters Optional default filters provided as an array of tuples or logical operators.
 * @returns An object with functions to add filters, build the query string, and reset the filters.
 */
export function useQueryBuilder<T extends Record<string, any>>(
    schema: z.ZodObject<T>,
    defaultFilters?: DefaultFilter<T>[]
): UseQueryBuilderHook<T> {
    // Pre-populate the filters state if default filters are provided.
    const initialFilters: Array<FilterTuple<T> | string> = defaultFilters || [];

    const [filters, setFilters] = useState<Array<FilterTuple<T> | string>>(initialFilters);

    /**
     * Adds a filter condition to the query using a tuple.
     * The tuple is destructured into [field, operator, value] and validated.
     */
    const where = useCallback(
        <K extends keyof T>(filter: [K, FilterOperators<T[K]>, T[K]]) => {
            const [field, operator, value] = filter;
            if (!(field in schema.shape)) {
                throw new Error(`Field "${String(field)}" is not defined in the schema.`);
            }
            const fieldSchema = schema.shape[field];
            const result = fieldSchema.safeParse(value);
            if (!result.success) {
                throw new Error(
                    `Invalid value for field "${String(field)}": ${result.error.message}`
                );
            }
            
            // Store the filter tuple directly in the array
            setFilters((prev) => [...prev, filter as unknown as FilterTuple<T>]);
        },
        [schema]
    );

    // Build a JSON string representation of the filters array
    const build = useCallback(() => {
        return JSON.stringify(filters);
    }, [filters]);

    const reset = useCallback(() => setFilters([]), []);

    // Create the queryString as a JSON representation
    const queryString = useMemo(() => {
        // const snakeFilters = filters.map(ff => f.map(f => [camelToSnake(f[0]), f[1], f[2]]));
        const snakeFilters = filters.map(f => [camelToSnake(f[0]), f[1], f[2]])
        return JSON.stringify(snakeFilters);
        // return JSON.stringify(convertKeysToSnakeCase(filters));
    }, [filters]);

    return { filters, where, build, reset, queryString };
}

