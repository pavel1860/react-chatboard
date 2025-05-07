import { z } from "zod";



export interface ModelContext {
    [key: string]: string | number | undefined;
}



export const ModelContextSchema = z.object({
    branchId: z.number(),
    turnId: z.number(),
})


export type ModelContextType = z.infer<typeof ModelContextSchema>



export function buildModelContextHeaders(ctx?: ModelContextType): Record<string, string> {
    return Object.entries(ctx || {})
        .filter(([_, v]) => v != null)
        .reduce((acc, [key, val]) => {
            acc[key.toLowerCase()] = String(val);
            return acc;
        }, {} as Record<string, string>);
}




