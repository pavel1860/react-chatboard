import { createContext, useContext, useEffect, useState } from 'react';
// import { getChatboardMetadata } from '@/services/metadata-service'
import { IMetadataResponse, getChatboardMetadata, getRagDocumentsApi } from '@/services/chatboard-service'
                                      


const ChatboardContext = createContext<{
  metadata: IMetadataResponse,
  documents: any,
  getRagDocuments: (namespace: string) => void
}>({} as any);




export function ChatboardProvider({children}: {children: any}) {
    const [isOpen, setIsOpen] = useState();
    const [metadata, setMetadata] = useState<IMetadataResponse>({
      rag_spaces: [],
      assets: [],
      profiles: []
    })
    const [documents, setDocuments] = useState([])

    useEffect(()=>{
      getChatboardMetadata((data: IMetadataResponse)=>{
          setMetadata(data)
      })
    }, [])


    const getRagDocuments = (namespace: string) => {
      getRagDocumentsApi(namespace, (data: any)=>{
        setDocuments(data)
      })
    }
    
  
    return (
      <ChatboardContext.Provider value={{ 
        metadata,
        documents,
        getRagDocuments,
      }} displayName="Chatbot-context">
        {children}
      </ChatboardContext.Provider>
    );
}


export const useChatboard = () => {
  return useContext(ChatboardContext) 
}