import { useDropzone } from 'react-dropzone'
// import { DropzoneWrapper } from "./dropzone"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useCallback, useEffect, useState } from 'react'
import { CircleX, FileCheck, X } from 'lucide-react'
import { z } from "zod";


const fileTypeLookup = {
    "png": ["image/png"],
    "jpeg": ["image/jpeg"],
    "pdf": ["application/pdf"],
    "excel": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"],
}


type FileType = "png" | "jpeg" | "pdf" | "excel"

interface AddAssetDropzoneModalProps {
    endpoint: string
    title: string
    buttonTitle?: string
    onUpload?: (data: any) => void
    allowedTypes?: FileType[]
    // renderPreview?: (data: any) => React.ReactNode
}



const buildAllowedFileTypes = (allowedTypes: FileType[] | undefined) => {
    let allowedFileTypes: string[] = []
    if (allowedTypes) {
        allowedTypes.forEach((type) => {
            allowedFileTypes = allowedFileTypes.concat(fileTypeLookup[type])
        })
    }
    return allowedFileTypes
}


export default function AddAssetDropzoneModal({ endpoint, title, buttonTitle, allowedTypes, onUpload }: AddAssetDropzoneModalProps) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [currentFile, setCurrentFile] = useState<File | undefined>(undefined)
    const [fileName, setFileName] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)
    const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(buildAllowedFileTypes(allowedTypes))


    useEffect(() => {
        setAllowedFileTypes(buildAllowedFileTypes(allowedTypes))
    }, [allowedTypes])


    const fileSchema = z
        .instanceof(File)
        .refine((file) => allowedFileTypes.includes(file.type), {
            message: `Only ${allowedTypes?.join(", ")} files are allowed`,
        });


    const onDrop = useCallback(async (acceptedFiles: any) => {
        setHightlightDropzone(false)
        // props.onUploadStart && props.onUploadStart()
        try {
            const file = allowedTypes ? fileSchema.parse(acceptedFiles[0]) : acceptedFiles[0]
            setCurrentFile(file)
            setFileName(file.name)
            setError(undefined)
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const errorStr = JSON.parse(error.message).reduce((acc: string, curr: any) => {
                    return  acc + curr.message
                }, "")
                setError(errorStr)
            } else {
                console.error(error)
                setError("Something went wrong")
            }
        }
        
    }, [currentFile, fileName])


    const clearState = () => {
        setCurrentFile(undefined)
        setFileName(undefined)
        setError(undefined)
        setLoading(false)
    }


    const uploadFile = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append("file", currentFile as Blob);
        formData.append("name", fileName as string);
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                body: formData,
            })
            if (!res.ok) {
                setError("Something went wrong")
                setLoading(false)
                return
            }
            const data = await res.json()
            setLoading(false)
            console.log(data)
            return data

        } catch (error) {
            setLoading(false)
            setError("Something went wrong")
        }
    }


    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true })
    const [hightlightDropzone, setHightlightDropzone] = useState(false)

    return (
        <>
            <Button onPress={onOpen} color="primary" size="sm">{buttonTitle || "Add"}</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                            <ModalBody>
                                {currentFile && <Input
                                    placeholder='File name'
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                />}
                                {
                                    currentFile ?
                                        <div className="flex items-center gap-4 justify-center border-1 rounded-sm p-4">
                                            <FileCheck size={40} color="gray"/>
                                            <span className="text-gray-500">Selected File</span>
                                            <span className="text-gray-500">{(currentFile.size / 1000000).toFixed(2)}MB</span>
                                            <Button
                                                variant='light'
                                                size="sm"
                                                onPress={() => {
                                                    setFileName(undefined)
                                                    setCurrentFile(undefined)
                                                    setError(undefined)
                                                }}
                                                isIconOnly
                                            ><X /></Button>
                                        </div> :
                                        <div
                                            {...getRootProps()}
                                            style={{ background: hightlightDropzone ? "#E4E4E7" : 'none', cursor: hightlightDropzone ? 'copy' : 'auto' }}

                                            onDragOver={() => { setHightlightDropzone(true) }}
                                            onDragLeave={() => { setHightlightDropzone(false) }}
                                        >
                                            <div className="flex items-center justify-center p-4 bg-slate-100 text-slate-400 h-40">
                                                Drop a file
                                            </div>
                                        </div>
                                }
                                {error && <p className="text-red-500 flex gap-2 items-center"><CircleX size={15} />{error}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={() => {
                                    onClose()
                                    clearState()
                                }} isDisabled={loading}>
                                    Close
                                </Button>
                                {<Button
                                    color="primary"
                                    isDisabled={!currentFile || !fileName || loading}
                                    isLoading={loading}
                                    onPress={async () => {
                                        const data = await uploadFile()
                                        if (data) {
                                            clearState()
                                            onClose()
                                            onUpload && onUpload(data)
                                        } else {
                                            throw new Error("Something went wrong. no data was returned.");
                                            
                                        }
                                    }}>
                                    Add
                                </Button>}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
