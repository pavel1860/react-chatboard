import { useEffect, useState } from "react"
import { PydanticV2BaseModel, useChatboardMetadata } from "../services/chatboard-service"












export const useRunMetadata = (runType: string, promptName: string) => {
    const {
        data: metadata,
        isLoading,
        error,

    } = useChatboardMetadata()

    const [metadataClass, setMetadataClass] = useState<PydanticV2BaseModel | null>(null)
    const [isArray, setIsArray] = useState(false)

    useEffect(() => {
        if (metadata) {
            if (runType === 'prompt') {

                const promptMetadataRecord = metadata.prompts.find(p => p.name === promptName)
                if (promptMetadataRecord) {
                    setIsArray(promptMetadataRecord.output_class?.type === "array")
                    setMetadataClass(promptMetadataRecord.output_class.properties)

                }

            }
        }
    }, [metadata])


    return {
        isArray,
        metadataClass,
        error,
        loading: isLoading
    }

}