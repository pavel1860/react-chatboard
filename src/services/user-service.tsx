import useSWR, { useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../hooks/artifact-log-hook";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";
import { HeadType } from "./artifact-log-service";




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



export default function createUserService<T>(userModel: string, schema: ZodSchema<T>, baseUrl?: string) {
    baseUrl = baseUrl || "/api/ai/users";

    const UserSchema = BaseUserSchema.merge(schema)
    type UserType = T & BaseUserType

    function useGetUser(id: string) {

        const env = useHeadEnv();
        //@ts-ignore
        return useSWR<ModelArtifactType | null>([`${baseUrl}/${userModel}/id/${id}`, env], ([url, env]) => fetcher({ schema: UserSchema, endpoint: url, env }));
    }

    function useGetUserList(partitions?: any, limit: number = 10, offset: number = 0) {
        const env = useHeadEnv();

        //@ts-ignore
        return useSWR<ModelArtifactType[]>([`${baseUrl}/${userModel}/list`, partitions, limit, offset, env], ([url, partitions, limit, offset]) => fetcher({ schema: z.array(UserSchema), endpoint: url, queryParams: { ...partitions, limit, offset }, env }));

    }

    function useLastUser(partitions: any) {
        const env = useHeadEnv();

        //@ts-ignore
        return useSWR<UserType | null>([`${baseUrl}/${userModel}/last`, partitions, env], ([url, partitions, env]) => fetcher({ UserSchema, endpoint: url, queryParams: partitions, env }));
    }

    function useCreateUser() {
        const env = useHeadEnv();

        return useMutationHook<UserType, UserType>({ schema: UserSchema, endpoint: `${baseUrl}/${userModel}/create`, env });
    }

    function useUpdateUser(id?: string) {
        const env = useHeadEnv();

        return useMutationHook<UserType, UserType>({ schema: UserSchema, endpoint: id && `${baseUrl}/${userModel}/update/${id}`, env });
    }


    function useChangeUserHead() {
        const env = useHeadEnv();

        return useMutationHook<{head_id: number, branch_id?: number}, HeadType>({ 
            // schema: UserSchema, 
            endpoint: `${baseUrl}/${userModel}/change-head`, 
            env,
            callbacks: {
                onSuccess: (data) => {
                    console.log("onSuccess", data)
                    env.setSelectedHeadId(data.id)                    
                    env.setSelectedBranchId(data.branch_id)                    
                }
            }

        });
    }

    return {
        UserSchema,        
        useGetUser,
        useGetUserList,
        useLastUser,
        useCreateUser,
        useUpdateUser,
        useChangeUserHead,
    };
}





