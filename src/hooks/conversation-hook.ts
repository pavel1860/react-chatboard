import { useCtx } from "../providers/ctx-provider";
import { useStore } from "../store/useStore";
import { useParams } from "next/navigation";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useCallback } from "react";






export const useConversationRouter = () => {
    const router = useRouter();

    const { partitionId, refUserId, setConversationId, setBranchId } = useCtx();
    const { setArtifactView, setIsArtifactViewOpen, setIsSidebarOpen, setStateUpdateMessageId } = useStore();


    const push = useCallback((path: string) => {
        let url = `/conversation/${partitionId}${path}`;
        if (refUserId) {
            url = `/admin/user/${refUserId}/conversation/${partitionId}${path}`;
        }
        router.push(url);
    }, [router, partitionId]);


    const back = useCallback(() => {
        router.back();
    }, [router]);

    const backFromProperty = useCallback(() => {
        let url = `/conversation/${partitionId}`;
        if (refUserId) {
            url = `/admin/user/${refUserId}/conversation/${partitionId}`;
        }
        router.push(url);
    }, [router, partitionId]);

    const goToNewConversation = useCallback(() => {
        setBranchId(1)
        // setConversationId(null)
        let url = `/`;
        if (refUserId) {
            url = `/admin/user/${refUserId}`;
        }
        router.push(url);
        setArtifactView(null);
        setIsSidebarOpen(false)
        setIsArtifactViewOpen(false)
        setStateUpdateMessageId(null)
    }, [router, partitionId]);


    const goToConversation = useCallback((conversationId: string) => {
        if (conversationId === partitionId) {
            return
        }
        setConversationId(conversationId)
        let url = `/conversation/${conversationId}`;
        if (refUserId) {
            url = `/admin/user/${refUserId}/conversation/${conversationId}`;
        }
        router.push(url)
        setStateUpdateMessageId(null)
    }, [router, partitionId]);

    return {
        push,
        back,
        backFromProperty,
        setIsArtifactViewOpen,
        goToNewConversation,
        goToConversation
    }
}