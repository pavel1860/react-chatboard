import { useDropzone } from 'react-dropzone'
// import { DropzoneWrapper } from "./dropzone"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useCallback, useState } from 'react'
import { X } from 'lucide-react'




interface AddAssetDropzoneModalProps {
    endpoint: string
    title: string
    buttonTitle?: string
    onUpload?: (data: any) => void
    // renderPreview?: (data: any) => React.ReactNode
}



export default function AddAssetDropzoneModal({ endpoint, title, buttonTitle, renderPreview }: AddAssetDropzoneModalProps) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [currentFile, setCurrentFile] = useState<File | undefined>(undefined)
    const [fileName, setFileName] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false) 
    

    const onDrop = useCallback(async (acceptedFiles: any) => {
        setHightlightDropzone(false)
        // props.onUploadStart && props.onUploadStart()
        
        const file = acceptedFiles[0]
        setCurrentFile(file)
        setFileName(file.name)
        setError(undefined)
        // const formData = new FormData();
        // formData.append("file", acceptedFiles[0]);

        // Upload the file to the FastAPI server
        // fetch(props.endpoint, {
        //     method: "POST",
        //     body: formData,
        // })
        //     .then(async (response) => {
        //         if (!response.ok) {
        //             const error = await response.json();
        //             throw new Error(error.message || "File upload failed");
        //         }
        //         return response.json();
        //     })
        //     .then((data) => {
        //         console.log("File uploaded successfully:", data);
        //     })
        //     .catch((error) => {
        //         console.error("Error uploading file:", error.message);
        //     });
    }, [currentFile, fileName])


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


    const {getRootProps, getInputProps} = useDropzone({onDrop, noClick: true})
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
                                        Selected File
                                        <Button
                                            variant='light'
                                            size="sm"
                                            onPress={() => {
                                                setFileName(undefined)
                                                setCurrentFile(undefined)
                                            }}
                                            isIconOnly
                                            ><X/></Button>
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
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose} isDisabled={loading}>
                                    Close
                                </Button>
                                {<Button 
                                    color="primary" 
                                    isDisabled={!currentFile || !fileName || loading}
                                    isLoading={loading}
                                    onPress={async ()=>{
                                        const data = await uploadFile()
                                        if (data) {
                                            renderPreview && renderPreview(data)
                                            onClose()
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
