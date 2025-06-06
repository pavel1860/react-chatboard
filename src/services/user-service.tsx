import useSWR, { useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../model/hooks/artifact-head-hooks";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";
import { HeadType } from "../model/services/artifact-log-service";
import createModelService from "../model/services/model-service";
import createHeadModelService from "./head-model-service";




export const BaseUserSchema = z.object({
    id: z.number(),
    cookie_id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    image: z.string().nullable(),
    emailVerified: z.string().nullable(),
    is_admin: z.boolean(),
    // head_id: z.number(),
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
                    env.setHeadEnv(data.id, data.branch_id, data.turn_id, data.main_branch_id)
                    callbacks?.onSuccess?.(data)
                },
                onError: (error) => {
                    console.error("onError", error)
                    callbacks?.onError?.(error)
                }
            }
        });
    
        return {
            // changeHead: (headId: number) => {
            //     return trigger({head_id: headId})
            // },
            changeBranch: (branchId: number, turnId: number) => {
                env.setBranchEnv(branchId, turnId)
            },
            changeHead: (head: HeadType) => {
                env.setHeadEnv(head.id, head.branch_id, head.turn_id, head.main_branch_id)
            },
            isMutating,
            error,
        }
    }
    
    const {
        HeadModelSchema: UserSchema,
        useHeadModelList: useGetUserList,
        useHeadModel: useGetUser,
        useCreateHeadModel: useCreateUser,
        useUpdateHeadModel: useUpdateUser,
    } = createHeadModelService(userModel, BaseUserSchema.merge(schema), { baseUrl })
    

    return {
        UserSchema,
        // useChangeHead,
        useGetUserList,
        useGetUser,
        useCreateUser,
        useUpdateUser,        
    }
}




