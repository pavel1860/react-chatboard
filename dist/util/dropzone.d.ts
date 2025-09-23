import React from 'react';
interface DropzoneProps {
    endpoint: string;
    children: React.ReactNode;
    onUploadEnd?: (data: any, error: any) => void;
    onUploadStart?: () => void;
}
export declare const DropzoneWrapper: (props: DropzoneProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=dropzone.d.ts.map