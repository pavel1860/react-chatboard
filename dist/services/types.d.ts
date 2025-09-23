import { z } from 'zod';
export declare enum Role {
    CLIENT = "user",
    MANAGER = "manager",
    BOT = "assistant",
    TOOL = "tool"
}
export interface IMessage {
    id: string;
    content: string;
    prompt?: string;
    role: Role;
    run_id?: string;
    created_at: string;
    updated_at: string;
    phone_number: string;
    manager_phone_number: string;
}
export declare const BaseUserSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodNullable<z.ZodString>;
    email: z.ZodString;
    image: z.ZodNullable<z.ZodString>;
    emailVerified: z.ZodString;
    is_admin: z.ZodBoolean;
    head_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string | null;
    id: number;
    image: string | null;
    email: string;
    is_admin: boolean;
    emailVerified: string;
    head_id: number;
}, {
    name: string | null;
    id: number;
    image: string | null;
    email: string;
    is_admin: boolean;
    emailVerified: string;
    head_id: number;
}>;
//# sourceMappingURL=types.d.ts.map