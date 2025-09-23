// import createModelService from "react-chatboard/src/model/services/model-service2";
import { createUseCreateModelHook, createUseFetchModelHook, createUseFetchModelListInfiniteHook, createUseUpdateModelHook } from "../hooks/modelHooks";
import { z } from "zod";
const UserPayloadSchema = z.object({
    guestToken: z.string().nullable(),
    email: z.string().nullable(),
    image: z.string().nullable().optional(),
    name: z.string().nullable(),
    isAdmin: z.boolean(),
    role: z.string().nullable(),
    autoRespond: z.string(),
});
const UserSchema = z.object({
    id: z.string(),
    authUserId: z.string().nullable().optional(),
    createdAt: z.preprocess((val) => typeof val === "string" ? new Date(val) : val, z.date()),
    ...UserPayloadSchema.shape,
});
const useUserList = createUseFetchModelListInfiniteHook({
    url: "/api/ai/model/User/list",
    schema: UserSchema
});
const useUser = createUseFetchModelHook({
    url: "/api/ai/model/User/record",
    schema: UserSchema
});
const useCreateUser = createUseCreateModelHook({
    url: "/api/ai/model/User/create",
    schema: UserSchema
});
const useUpdateUser = createUseUpdateModelHook({
    url: "/api/ai/model/User/update",
    schema: UserSchema
});
export { useUserList, useUser, useCreateUser, useUpdateUser, };
//# sourceMappingURL=userService.js.map