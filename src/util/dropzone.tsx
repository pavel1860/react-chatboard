




import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { Progress } from '@nextui-org/react'
import {useDropzone} from 'react-dropzone'



interface DropzoneProps {
    endpoint: string
    children: React.ReactNode
    onUploadEnd?: (data: any, error: any) => void
    onUploadStart?: () => void
}


export const DropzoneWrapper = (props: DropzoneProps) => {

    const [progress, setProgress] = useState<number | undefined>(undefined)


    const onDrop = useCallback(async (acceptedFiles: any) => {
        setHightlightDropzone(false)
        props.onUploadStart && props.onUploadStart()
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
        
        
    }, [progress, props.onUploadEnd, props.onUploadStart])
    const {getRootProps, getInputProps} = useDropzone({onDrop, noClick: true})
    
    const dropzoneRef = createRef<any>()

    const [hightlightDropzone, setHightlightDropzone] = useState(false)


    return (
        <div 
            {...getRootProps()}
            // style={{background: hightlightDropzone ? "#E4E4E7" : 'none', cursor: hightlightDropzone ? 'copy': 'auto', height: '100%', width: '100%'}}
            style={{background: hightlightDropzone ? "#E4E4E7" : 'none', cursor: hightlightDropzone ? 'copy': 'auto'}}

            onDragOver={()=>{setHightlightDropzone(true)}} 
            onDragLeave={()=>{setHightlightDropzone(false)}}
            // onMouseLeave={()=>{setHightlightDropzone(false)}}
            // isHighlighted={hightlightDropzone}
            >
            {props.children}            
            {progress !== undefined && <Progress color="primary" value={35} />}
        </div>
    )
}
