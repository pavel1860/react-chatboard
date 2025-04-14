import { create, StoreApi } from 'zustand'
import { createArtifactLogSlice, ArtifactLogStoreType } from "../model/state/artifact-log-slice";
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';



export type ChatStoreType = ArtifactLogStoreType




// export const useAdminStore = create<ChatStoreType>((...a) => ({
//     ...createArtifactLogSlice(...a),
// }))



export const createChatStore = (artifactViews: string[], defaultView: string | null = null) =>
    create<ChatStoreType>((...a) => ({
        ...createArtifactLogSlice(artifactViews, defaultView)(...a),
    }))


const ChatContext = createContext<StoreApi<ChatStoreType> | null>(null);



interface ChatStoreProviderProps {
    children: React.ReactNode,
    artifactViews: string[],
    defaultView?: string | null
}

export const ChatStoreProvider = ({ children, artifactViews, defaultView }: ChatStoreProviderProps) => {
    const storeRef = useRef<StoreApi<ChatStoreType>>(null);

    if (!storeRef.current) {
        storeRef.current = createChatStore(artifactViews, defaultView);
    }

    return <ChatContext.Provider value={storeRef.current}>{children}</ChatContext.Provider>
}





export const useChatStore = <T,>(selector: (state: ChatStoreType) => T) => {
    const store = useContext(ChatContext);
    if (!store) {
        throw new Error('useChatStore must be used within a ChatProvider');
    }
    return useStore(store, selector);
}


export const useArtifact = () => {
    const artifactView = useChatStore((state) => state.artifactView);
    const setArtifactView = useChatStore((state) => state.setArtifactView);
    const artifactId = useChatStore((state) => state.artifactId);
    const setArtifactId = useChatStore((state) => state.setArtifactId);
    const artifactType = useChatStore((state) => state.artifactType);
    const setArtifactType = useChatStore((state) => state.setArtifactType);
    return { 
        artifact: {
            artifactView, 
            artifactId, 
        },
        setArtifact: ( artifactId: string, artifactView: string) => {
            setArtifactId(artifactId)
            setArtifactView(artifactView)
        },
        artifactView, 
        setArtifactView, 
        artifactId, 
        setArtifactId, 
        artifactType, 
        setArtifactType
    };
}


