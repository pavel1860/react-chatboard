import { useArtifact, useChatStore } from "../stores/chat-store"




export const useArtifactLayout = () => {
    
    const { artifactView, setArtifactView, artifactId, setArtifactId, artifactType, setArtifactType } = useArtifact()

    return {
        artifactView,
        setArtifactView,
        isTestFormOpen: artifactView === "test-case",
        artifactId,
        setArtifactId,
        artifactType,
        setArtifactType,
    }
}