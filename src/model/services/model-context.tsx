import { z } from "zod";



export interface ModelContext {
    [key: string]: string | number | undefined;
}



export const ModelContextSchema = z.object({
    branchId: z.number(),
    turnId: z.number(),
})


export type ModelContextType = z.infer<typeof ModelContextSchema>


export function camelToSnake(str: string) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function convertKeysToSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToSnakeCase);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const snakeKey = camelToSnake(key);
            acc[snakeKey] = convertKeysToSnakeCase(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}


export function snakeToCamel(str: string) {
    return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

export function convertKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToCamelCase);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const camelKey = snakeToCamel(key);
            acc[camelKey] = convertKeysToCamelCase(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}



export function buildModelContextHeaders<Ctx>(ctx?: Ctx, contentType?: 'json' | 'form'): Record<string, string> {
    const ctxEntries = Object.entries(ctx || {})
        .filter(([_, v]) => v != null)
        .reduce((acc, [key, val]) => {
            // acc[key.toLowerCase()] = String(val);
            acc[camelToSnake(key)] = String(val);
            return acc;
        }, {} as Record<string, string>);

    if (contentType === 'json') {
        ctxEntries['Content-Type'] = 'application/json';
    } else if (contentType === 'form') {
        ctxEntries['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return ctxEntries;
}




