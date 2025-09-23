interface HeaderParam {
    [key: string]: number | string | null | undefined;
}
interface HeaderType {
    [key: string]: string;
}
type ContentType = 'json' | 'form';
export declare const buildHeaders: (headers: HeaderParam, contentType?: ContentType) => HeaderType;
export {};
//# sourceMappingURL=utils.d.ts.map