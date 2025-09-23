type FileType = "png" | "jpeg" | "pdf" | "excel";
interface AddAssetDropzoneModalProps {
    endpoint: string;
    title: string;
    buttonTitle?: string;
    onUpload?: (data: any) => void;
    allowedTypes?: FileType[];
}
export default function AddAssetDropzoneModal({ endpoint, title, buttonTitle, allowedTypes, onUpload }: AddAssetDropzoneModalProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=dropzone-modal.d.ts.map