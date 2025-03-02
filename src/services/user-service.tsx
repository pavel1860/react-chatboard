import useSWR, { useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../hooks/artifact-log-hook";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";
import { HeadType } from "./artifact-log-service";
import createModelService from "./model-service";




export const BaseUserSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
    emailVerified: z.string(),
    is_admin: z.boolean(),
    head_id: z.number(),
})


export type BaseUserType = z.infer<typeof BaseUserSchema>




export type UserServiceOptions = {
    baseUrl?: string,
}


export const ProtoUserSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string(),
    image: z.string().nullable(),
    emailVerified: z.string(),
    is_admin: z.boolean(),
    phone_number: z.string().nullable(),
})



export default function createUserService<T>(userModel: string, schema: ZodSchema<T>, options: UserServiceOptions = {}) {
    const { baseUrl = "/api/ai/users" } = options;

    

    function useChangeHead(
        callbacks?: {
            onSuccess?: (data: HeadType) => void,
            onError?: (error: Error) => void,
        }
    ) {
        const env = useHeadEnv()
        
        const { trigger, isMutating, error } = useMutationHook<{head_id: number, branch_id?: number}, HeadType>({ 
            // schema: UserSchema, 
            endpoint: `${baseUrl}/${userModel}/change-head`, 
            env,
            callbacks: {
                onSuccess: (data) => {
                    console.log("onSuccess", data)
                    env.setHeadEnv(data.id, data.branch_id, data.main_branch_id)
                    callbacks?.onSuccess?.(data)
                },
                onError: (error) => {
                    console.error("onError", error)
                    callbacks?.onError?.(error)
                }
            }
        });
    
        return {
            changeHead: (headId: number) => {
                return trigger({head_id: headId})
            },
            isMutating,
            error,
        }
    }
    
    const {
        ModelArtifactSchema: UserSchema,
        useGetModelList: useGetUserList,
        useGetModel: useGetUser,
        useCreateModel: useCreateUser,
        useUpdateModel: useUpdateUser,
    } = createModelService("Manager", BaseUserSchema.merge(schema), {isArtifact: false, isHead: true, baseUrl})
    

    return {
        UserSchema,
        useChangeHead,
        useGetUserList,
        useGetUser,
        useCreateUser,
        useUpdateUser,        
    }
}




