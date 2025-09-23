import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createRef, useCallback, useState } from 'react';
import { Progress } from '@heroui/react';
import { useDropzone } from 'react-dropzone';
export const DropzoneWrapper = (props) => {
    const [progress, setProgress] = useState(undefined);
    const onDrop = useCallback(async (acceptedFiles) => {
        setHightlightDropzone(false);
        props.onUploadStart && props.onUploadStart();
        // uploadMedia(acceptedFiles, undefined, props.onUploadEnd)
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);
        // Upload the file to the FastAPI server
        fetch(props.endpoint, {
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "File upload failed");
            }
            return response.json();
        })
            .then((data) => {
            console.log("File uploaded successfully:", data);
        })
            .catch((error) => {
            console.error("Error uploading file:", error.message);
        });
    }, [progress, props.onUploadEnd, props.onUploadStart]);
    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true });
    const dropzoneRef = createRef();
    const [hightlightDropzone, setHightlightDropzone] = useState(false);
    return (_jsxs("div", { ...getRootProps(), 
        // style={{background: hightlightDropzone ? "#E4E4E7" : 'none', cursor: hightlightDropzone ? 'copy': 'auto', height: '100%', width: '100%'}}
        style: { background: hightlightDropzone ? "#E4E4E7" : 'none', cursor: hightlightDropzone ? 'copy' : 'auto' }, onDragOver: () => { setHightlightDropzone(true); }, onDragLeave: () => { setHightlightDropzone(false); }, children: [props.children, progress !== undefined && _jsx(Progress, { color: "primary", value: 35 })] }));
};
//# sourceMappingURL=dropzone.js.map