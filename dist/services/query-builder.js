// import { useModelEnv } from "../state/model-env";
import { useCallback, useMemo, useState } from "react";
import { camelToSnake } from "../model/services/model-context";
/**
 * A React hook for building query parameters with Zod validation.
 *
 * @param schema A Zod object schema defining valid fields and their types.
 * @param defaultFilters Optional default filters provided as an array of tuples or logical operators.
 * @returns An object with functions to add filters, build the query string, and reset the filters.
 */
export function useQueryBuilder(schema, defaultFilters) {
    // Pre-populate the filters state if default filters are provided.
    const initialFilters = defaultFilters || [];
    const [filters, setFilters] = useState(initialFilters);
    /**
     * Adds a filter condition to the query using a tuple.
     * The tuple is destructured into [field, operator, value] and validated.
     */
    const where = useCallback((filter) => {
        const [field, operator, value] = filter;
        if (!(field in schema.shape)) {
            throw new Error(`Field "${String(field)}" is not defined in the schema.`);
        }
        const fieldSchema = schema.shape[field];
        const result = fieldSchema.safeParse(value);
        if (!result.success) {
            throw new Error(`Invalid value for field "${String(field)}": ${result.error.message}`);
        }
        // Store the filter tuple directly in the array
        setFilters((prev) => [...prev, filter]);
    }, [schema]);
    // Build a JSON string representation of the filters array
    const build = useCallback(() => {
        return JSON.stringify(filters);
    }, [filters]);
    const reset = useCallback(() => setFilters([]), []);
    // Create the queryString as a JSON representation
    const queryString = useMemo(() => {
        // const snakeFilters = filters.map(ff => f.map(f => [camelToSnake(f[0]), f[1], f[2]]));
        // @ts-ignore
        const snakeFilters = filters.map(f => [camelToSnake(f[0]), f[1], f[2]]);
        return JSON.stringify(snakeFilters);
        // return JSON.stringify(convertKeysToSnakeCase(filters));
    }, [filters]);
    return { filters, where, build, reset, queryString };
}
//# sourceMappingURL=query-builder.js.map