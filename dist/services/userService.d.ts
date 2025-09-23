import { z } from "zod";
declare const UserPayloadSchema: z.ZodObject<{
    guestToken: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodNullable<z.ZodString>;
    isAdmin: z.ZodBoolean;
    role: z.ZodNullable<z.ZodString>;
    autoRespond: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string | null;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
}, {
    name: string | null;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
}>;
declare const UserSchema: z.ZodObject<{
    guestToken: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodNullable<z.ZodString>;
    isAdmin: z.ZodBoolean;
    role: z.ZodNullable<z.ZodString>;
    autoRespond: z.ZodString;
    id: z.ZodString;
    authUserId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
}, "strip", z.ZodTypeAny, {
    name: string | null;
    id: string;
    createdAt: Date;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
    authUserId?: string | null | undefined;
}, {
    name: string | null;
    id: string;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    createdAt?: unknown;
    image?: string | null | undefined;
    authUserId?: string | null | undefined;
}>;
export type UserType = z.infer<typeof UserSchema>;
export type UserPayloadType = z.infer<typeof UserPayloadSchema>;
declare const useUserList: (params: import("../hooks/modelHooks").UseFetchModelListParams<{
    name: string | null;
    id: string;
    createdAt: Date;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
    authUserId?: string | null | undefined;
}, {
    branchId: number;
}> & {
    defaultFilters?: import("./query-builder").DefaultFilter<{
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    }>[] | undefined;
}, hookConfig?: import("../hooks/modelHooks").InfiniteConfiguration<{
    name: string | null;
    id: string;
    createdAt: Date;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
    authUserId?: string | null | undefined;
}> | undefined) => {
    items: {
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    }[];
    trigger: () => void;
    filters: import("./query-builder").DefaultFilter<{
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    } & Record<string, any>>[];
    where: <K extends string>(filter: [K, import("./query-builder").FilterOperators<({
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    } & Record<string, any>)[K]>, ({
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    } & Record<string, any>)[K]]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    }[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<{
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    }[][]>;
    error: any;
    data: {
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    }[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
declare const useUser: (params: Partial<import("../hooks/modelHooks").UseFetchModelParams<{
    branchId: number;
}>>, hookConfig?: import("../hooks/modelHooks").SingleConfiguration<{
    name: string | null;
    id: string;
    createdAt: Date;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
    authUserId?: string | null | undefined;
}> | undefined) => import("../hooks/modelHooks").UseFetchModelReturn<{
    name: string | null;
    id: string;
    createdAt: Date;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
    authUserId?: string | null | undefined;
}>;
declare const useCreateUser: (params?: {
    ctx?: {
        branchId: number;
    } | undefined;
    headers?: Record<string, string>;
} | undefined) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<{
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    }, {
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    }, any, any>;
    data: {
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    } | undefined;
    error: {
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    } | undefined;
    isMutating: boolean;
};
declare const useUpdateUser: (params?: import("../hooks/modelHooks").UseMutateModelParams<{
    name: string | null;
    id: string;
    createdAt: Date;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
    authUserId?: string | null | undefined;
}, {
    name: string | null;
    role: string | null;
    guestToken: string | null;
    email: string | null;
    isAdmin: boolean;
    autoRespond: string;
    image?: string | null | undefined;
}, {
    branchId: number;
}> | undefined) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<{
        name: string | null;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
    }, {
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    }, any, any>;
    data: {
        name: string | null;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
    } | undefined;
    error: {
        name: string | null;
        id: string;
        createdAt: Date;
        role: string | null;
        guestToken: string | null;
        email: string | null;
        isAdmin: boolean;
        autoRespond: string;
        image?: string | null | undefined;
        authUserId?: string | null | undefined;
    } | undefined;
    isMutating: boolean;
};
export { useUserList, useUser, useCreateUser, useUpdateUser, };
//# sourceMappingURL=userService.d.ts.map