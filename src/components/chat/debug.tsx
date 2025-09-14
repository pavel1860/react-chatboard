import {
    Button,
    cn,
} from "@heroui/react";

import { useChat } from "../../providers/chat-provider";

import { useCtx } from "../../providers/ctx-provider";

import { useComponentRegistry, UserComponentProvider } from "../blocks/UserComponentRegistry";

import VersionTree from "../tree/version-tree";




export const DebugPannel = () => {
    const { plainMode, setPlainMode, debugOutlines, setDebugOutlines } = useComponentRegistry();
    const {partitionId, branchId, setBranchId, refUserId} = useCtx()
    const { mutate } = useChat()

    return (
        <div>
            <Button size="sm" variant="light" onClick={() => setPlainMode(!plainMode)}>Plain Mode</Button>
            <Button size="sm" variant="light" onClick={() => setDebugOutlines(!debugOutlines)}>Debug Outlines</Button>
            {partitionId && <VersionTree
                partitionId={partitionId}
                branchId={branchId} 
                refetchChat={() => mutate()}
                setBranchId={(branchId) => setBranchId(branchId)}
                setTraceId={(traceId) => {
                    // setTraceId(traceId); 
                    // router.push(`/admin/user/${refUserId}/conversation/${partitionId}/tracer/${traceId}`)
                }} 
        />}
        </div>
    )
}