import { z } from "zod";
export const ModelContextSchema = z.object({
    branchId: z.number(),
    turnId: z.number(),
});
export function camelToSnake(str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}
export function convertKeysToSnakeCase(obj) {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToSnakeCase);
    }
    else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const snakeKey = camelToSnake(key);
            acc[snakeKey] = convertKeysToSnakeCase(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}
export function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
export function convertKeysToCamelCase(obj) {
    if (Array.isArray(obj)) {
        return obj.map(convertKeysToCamelCase);
    }
    else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = snakeToCamel(key);
            acc[camelKey] = convertKeysToCamelCase(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}
export function buildModelContextHeaders(ctx, contentType) {
    const ctxEntries = Object.entries(ctx || {})
        .filter(([_, v]) => v != null)
        .reduce((acc, [key, val]) => {
        // acc[key.toLowerCase()] = String(val);
        acc[camelToSnake(key)] = String(val);
        return acc;
    }, {});
    if (contentType === 'json') {
        ctxEntries['Content-Type'] = 'application/json';
    }
    else if (contentType === 'form') {
        ctxEntries['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return ctxEntries;
}
//# sourceMappingURL=model-context.js.map