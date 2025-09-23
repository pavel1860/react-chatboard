import { EndpointHook } from "./fetcher";
import { RunTreeContext } from '../types/run-tree';
export interface IProperty {
}
export interface IParameter {
    type: "string" | "number" | "object";
    properties?: {
        [key: string]: IParameter;
    };
}
export interface MetadataClass {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: IParameter;
    };
}
export interface IRagSpaces {
    namespace: string;
    metadata_class: MetadataClass;
}
export interface IError {
    message: string;
    stack: string;
}
export interface IOAssetClass {
    type: string;
    function: {
        name: string;
        description: string;
        parameters: {
            [key: string]: IParameter;
        };
    };
}
export interface AssetItem<I, O, M> {
    id: string;
    input: I;
    output: O;
    metadata: M;
    asset_input_date?: string;
    asset_output_date: string;
    asset_update_ts: number;
}
export interface IAssetClass {
    name: string;
    asset_class: {
        input_class: MetadataClass;
        output_class: MetadataClass;
        metadata_class: MetadataClass;
    };
}
export interface IProfileClass {
    name: string;
    profile_fields: IParameter;
}
interface PydanticV2Definition {
    [key: string]: any;
    title: string;
    type: string;
}
interface PydanticV2Ref {
    $ref: string;
}
export interface PydanticV2BaseModel {
    $defs: {
        [key: string]: PydanticV2Definition;
    };
    properties: {
        [key: string]: PydanticV2Ref | IParameter;
    };
}
export interface PromptOutputClass {
    type: string;
    properties: PydanticV2BaseModel;
}
export interface IPromptClass {
    name: string;
    output_class: PromptOutputClass;
    namespace: string;
}
export interface IMetadataResponse {
    rag_spaces: IRagSpaces[];
    assets: IAssetClass[];
    profiles: IProfileClass[];
    prompts: IPromptClass[];
}
export declare function postRequest(endpoint: string, { arg }: any): Promise<any>;
export declare function useChatboardMetadata(): EndpointHook<any>;
export declare function useAssetPartitionService(asset: string, partition: string | null): {
    data: any;
    error: any;
    isLoading: boolean;
};
export declare function useProfilePartitionService(profile: string | null, partition: string | null): {
    data: any;
    error: any;
    isLoading: boolean;
};
export declare function useProfileService(): {
    data: any;
    error: any;
    isLoading: boolean;
};
export declare function useAssetDocumentsService(asset: string): {
    data: any;
    error: any;
    isLoading: boolean;
};
export declare function useGetRuns(limit: number, offset: number, runNames: string[]): EndpointHook<any>;
export declare function useGetTree(id: string | null): {
    runTree: RunTreeContext | null;
    error: any;
    loading: boolean;
};
export declare function useAddExampleService(): {
    data: any;
    addExample: (input: any, output: any, namespace: string, id?: string | number) => void;
    error: any;
    loading: boolean;
};
export declare function useDeleteExample(): readonly [() => Promise<void>, () => Promise<void>];
export declare function useEditExampleService(): readonly [() => Promise<void>, () => Promise<void>];
export declare function useGetExamples(): readonly [() => Promise<void>, () => Promise<void>];
export declare function useGetNamespaces(): {
    data: any;
    error: any;
    isLoading: boolean;
};
export {};
//# sourceMappingURL=chatboard-service.d.ts.map