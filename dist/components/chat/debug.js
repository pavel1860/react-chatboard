import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, } from "@heroui/react";
import { useChat } from "../../providers/chat-provider";
import { useCtx } from "../../providers/ctx-provider";
import { useComponentRegistry } from "../blocks/UserComponentRegistry";
import VersionTree from "../tree/version-tree";
export const DebugPannel = () => {
    const { plainMode, setPlainMode, debugOutlines, setDebugOutlines } = useComponentRegistry();
    const { partitionId, branchId, setBranchId, refUserId } = useCtx();
    const { mutate } = useChat();
    return (_jsxs("div", { children: [_jsx(Button, { size: "sm", variant: "light", onClick: () => setPlainMode(!plainMode), children: "Plain Mode" }), _jsx(Button, { size: "sm", variant: "light", onClick: () => setDebugOutlines(!debugOutlines), children: "Debug Outlines" }), partitionId && _jsx(VersionTree, { partitionId: partitionId, branchId: branchId, refetchChat: () => mutate(), setBranchId: (branchId) => setBranchId(branchId), setTraceId: (traceId) => {
                    // setTraceId(traceId); 
                    // router.push(`/admin/user/${refUserId}/conversation/${partitionId}/tracer/${traceId}`)
                } })] }));
};
//# sourceMappingURL=debug.js.map