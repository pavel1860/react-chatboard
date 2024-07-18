// @ts-nocheck TODO - Fix the types
import { createContext, useContext, useEffect, useState } from 'react';
// import { getChatboardMetadata } from '@/services/metadata-service'
import { 
  IMetadataResponse, 
  getRagDocumentsApi, 
  useChatboardMetadata, 
  useProfileService,
  PromptOutputClass,
  PydanticV2BaseModel
} from '../services/chatboard-service'
                                      


const ChatboardContext = createContext<{
  metadata: IMetadataResponse,
  documents: any,
  getRagDocuments: (namespace: string) => void
}>({} as any);




export function ChatboardProvider({children}: {children: any}) {
    const [isOpen, setIsOpen] = useState();
    // const [metadata, setMetadata] = useState<IMetadataResponse>({
    //   rag_spaces: [],
    //   assets: [],
    //   profiles: [],
    //   prompts: []
    // })
    const [documents, setDocuments] = useState([])


    const chatboardMetadata = useChatboardMetadata()

    // useEffect(()=>{
    //   getChatboardMetadata((data: IMetadataResponse)=>{
    //       setMetadata(data)
    //   })
    // }, [])


    const getRagDocuments = (namespace: string) => {
      getRagDocumentsApi(namespace, (data: any)=>{
        setDocuments(data)
      })
    }    
    // const profile = useProfileService()
    console.log("metadata", chatboardMetadata.data)
  
    return (
      <ChatboardContext.Provider value={{ 
        metadata: chatboardMetadata.data || null,
        documents,
        getRagDocuments,
        //@ts-ignore
      }} displayName="Chatbot-context">
        {children}
      </ChatboardContext.Provider>
    );
}


export const useChatboard = () => {
  return useContext(ChatboardContext) 
}




export const useRunMetadata = (runType: string, promptName: string) => {
  const {
      data: metadata,
      isLoading,
      error,
      
  } = useChatboardMetadata()

  const [metadataClass, setMetadataClass] = useState<PydanticV2BaseModel | null>(null)
  const [isArray, setIsArray] = useState(false)

  useEffect(()=>{
    if (metadata){
      if (runType === 'prompt'){
        
        const promptMetadataRecord = metadata.prompts.find(p => p.name === promptName)
        if (promptMetadataRecord){
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