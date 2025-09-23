import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useDropzone } from 'react-dropzone';
// import { DropzoneWrapper } from "./dropzone"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useCallback, useEffect, useState } from 'react';
import { CircleX, FileCheck, X } from 'lucide-react';
import { z } from "zod";
const fileTypeLookup = {
    "png": ["image/png"],
    "jpeg": ["image/jpeg"],
    "pdf": ["application/pdf"],
    "excel": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"],
};
const buildAllowedFileTypes = (allowedTypes) => {
    let allowedFileTypes = [];
    if (allowedTypes) {
        allowedTypes.forEach((type) => {
            allowedFileTypes = allowedFileTypes.concat(fileTypeLookup[type]);
        });
    }
    return allowedFileTypes;
};
export default function AddAssetDropzoneModal({ endpoint, title, buttonTitle, allowedTypes, onUpload }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [currentFile, setCurrentFile] = useState(undefined);
    const [fileName, setFileName] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [allowedFileTypes, setAllowedFileTypes] = useState(buildAllowedFileTypes(allowedTypes));
    useEffect(() => {
        setAllowedFileTypes(buildAllowedFileTypes(allowedTypes));
    }, [allowedTypes]);
    const fileSchema = z
        .instanceof(File)
        .refine((file) => allowedFileTypes.includes(file.type), {
        message: `Only ${allowedTypes?.join(", ")} files are allowed`,
    });
    const onDrop = useCallback(async (acceptedFiles) => {
        setHightlightDropzone(false);
        // props.onUploadStart && props.onUploadStart()
        try {
            const file = allowedTypes ? fileSchema.parse(acceptedFiles[0]) : acceptedFiles[0];
            setCurrentFile(file);
            setFileName(file.name);
            setError(undefined);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const errorStr = JSON.parse(error.message).reduce((acc, curr) => {
                    return acc + curr.message;
                }, "");
                setError(errorStr);
            }
            else {
                console.error(error);
                setError("Something went wrong");
            }
        }
    }, [currentFile, fileName]);
    const clearState = () => {
        setCurrentFile(undefined);
        setFileName(undefined);
        setError(undefined);
        setLoading(false);
    };
    const uploadFile = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", currentFile);
        formData.append("name", fileName);
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                setError("Something went wrong");
                setLoading(false);
                return;
            }
            const data = await res.json();
            setLoading(false);
            console.log(data);
            return data;
        }
        catch (error) {
            setLoading(false);
            setError("Something went wrong");
        }
    };
    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true });
    const [hightlightDropzone, setHightlightDropzone] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsx(Button, { onPress: onOpen, color: "primary", size: "sm", children: buttonTitle || "Add" }), _jsx(Modal, { isOpen: isOpen, onOpenChange: onOpenChange, isDismissable: false, isKeyboardDismissDisabled: true, children: _jsx(ModalContent, { children: (onClose) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { className: "flex flex-col gap-1", children: title }), _jsxs(ModalBody, { children: [currentFile && _jsx(Input, { placeholder: 'File name', value: fileName, onChange: (e) => setFileName(e.target.value) }), currentFile ?
                                        _jsxs("div", { className: "flex items-center gap-4 justify-center border-1 rounded-sm p-4", children: [_jsx(FileCheck, { size: 40, color: "gray" }), _jsx("span", { className: "text-gray-500", children: "Selected File" }), _jsxs("span", { className: "text-gray-500", children: [(currentFile.size / 1000000).toFixed(2), "MB"] }), _jsx(Button, { variant: 'light', size: "sm", onPress: () => {
                                                        setFileName(undefined);
                                                        setCurrentFile(undefined);
                                                        setError(undefined);
                                                    }, isIconOnly: true, children: _jsx(X, {}) })] }) :
                                        _jsx("div", { ...getRootProps(), style: { background: hightlightDropzone ? "#E4E4E7" : 'none', cursor: hightlightDropzone ? 'copy' : 'auto' }, onDragOver: () => { setHightlightDropzone(true); }, onDragLeave: () => { setHightlightDropzone(false); }, children: _jsx("div", { className: "flex items-center justify-center p-4 bg-slate-100 text-slate-400 h-40", children: "Drop a file" }) }), error && _jsxs("p", { className: "text-red-500 flex gap-2 items-center", children: [_jsx(CircleX, { size: 15 }), error] })] }), _jsxs(ModalFooter, { children: [_jsx(Button, { color: "danger", variant: "light", onPress: () => {
                                            onClose();
                                            clearState();
                                        }, isDisabled: loading, children: "Close" }), _jsx(Button, { color: "primary", isDisabled: !currentFile || !fileName || loading, isLoading: loading, onPress: async () => {
                                            const data = await uploadFile();
                                            if (data) {
                                                clearState();
                                                onClose();
                                                onUpload && onUpload(data);
                                            }
                                            else {
                                                throw new Error("Something went wrong. no data was returned.");
                                            }
                                        }, children: "Add" })] })] })) }) })] }));
}
//# sourceMappingURL=dropzone-modal.js.map