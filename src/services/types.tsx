import { z } from 'zod';


export enum Role {
    CLIENT = "user",
    MANAGER = "manager",
    BOT = "assistant",
    TOOL = "tool"
}


export interface IMessage {
    id: string
    content: string
    prompt?: string
    role: Role
    run_id?: string
    created_at: string
    updated_at: string
    phone_number: string
    manager_phone_number: string   
}





export const BaseUserSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
    emailVerified: z.string(),
    is_admin: z.boolean(),
    head_id: z.number(),
})
