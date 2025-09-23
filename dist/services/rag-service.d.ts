import { EndpointHook, PaginatableEndpointHook } from "./fetcher";
export declare function useRagNamespacesEndpoint(): EndpointHook<any>;
export declare function getRagDocumentsApi(namespace: string, page: number, pageSize?: number, sortField?: string | undefined, sortOrder?: string | undefined): Promise<any>;
export declare function useRagDocumentsEndpoint(namespace: string | null, pageSize?: number, pageIndex?: number): PaginatableEndpointHook<any>;
export declare function addDocumentEndpoint(namespace: string, input: any, output: any, id?: string): Promise<Response>;
//# sourceMappingURL=rag-service.d.ts.map