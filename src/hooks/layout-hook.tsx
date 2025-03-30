import { useChatStore } from "../stores/chat-store"




export const useArtifactLayout = () => {
    const { 
        artifactView, 
        setArtifactView,
        artifactId,
        setArtifactId,
        artifactType,
        setArtifactType,
    } = useChatStore()

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