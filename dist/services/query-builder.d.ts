import { z } from "zod";
export interface UseQueryBuilderHook<T extends Record<string, any>> {
    filters: Array<DefaultFilter<T>>;
    where: <K extends keyof T>(filter: [K, FilterOperators<T[K]>, T[K]]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
}
export type FilterOperators<T> = T extends number ? '==' | '>' | '<' | '>=' | '<=' : T extends string ? '==' | '!=' | 'contains' : never;
export type FilterTuple<T> = [keyof T, FilterOperators<T[keyof T]>, T[keyof T]];
export type MultiFilter<T> = [FilterTuple<T>, 'and' | 'or', FilterTuple<T>];
export type DefaultFilter<T> = FilterTuple<T> | MultiFilter<T>;
/**
 * A React hook for building query parameters with Zod validation.
 *
 * @param schema A Zod object schema defining valid fields and their types.
 * @param defaultFilters Optional default filters provided as an array of tuples or logical operators.
 * @returns An object with functions to add filters, build the query string, and reset the filters.
 */
export declare function useQueryBuilder<T extends Record<string, any>>(schema: z.ZodObject<T>, defaultFilters?: Array<DefaultFilter<T>>): UseQueryBuilderHook<T>;
//# sourceMappingURL=query-builder.d.ts.map