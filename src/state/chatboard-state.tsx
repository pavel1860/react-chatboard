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


