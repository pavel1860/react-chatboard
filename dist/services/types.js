import { z } from 'zod';
export var Role;
(function (Role) {
    Role["CLIENT"] = "user";
    Role["MANAGER"] = "manager";
    Role["BOT"] = "assistant";
    Role["TOOL"] = "tool";
})(Role || (Role = {}));
export const BaseUserSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
    emailVerified: z.string(),
    is_admin: z.boolean(),
    head_id: z.number(),
});
//# sourceMappingURL=types.js.map