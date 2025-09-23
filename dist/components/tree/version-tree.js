import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBranchTurns, useUpdateTurn } from '../../model/services/artifact-log-service';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react';
import { useVersionTree, VersionTreeProvider } from './version-tree-context';
import { Ellipsis, Eye, EyeOff, GitMerge, TextSearch } from 'lucide-react';
// Assuming TurnType and BranchType types from the Zod schemas are already defined in the service
// Helper: Get commit dot color based on status.
function getStatusColor(status) {
    if (status === 'staged')
        return '#f7b500';
    if (status === 'committed')
        return '#28a745';
    return '#dc3545';
}
const TurnDropdown = ({ turn, refetch }) => {
    const { trigger: updateTurn } = useUpdateTurn(turn.id);
    const { refetchChat } = useVersionTree();
    return (_jsxs(Dropdown, { children: [_jsx(DropdownTrigger, { children: _jsx(Button, { size: "sm", isIconOnly: true, variant: "light", color: "default", startContent: _jsx(Ellipsis, { size: 15, color: "gray" }) }) }), _jsx(DropdownMenu, { "aria-label": "Dropdown menu with description", variant: "faded", selectedKeys: [turn.status], selectionMode: "single", onSelectionChange: async (keys) => {
                    console.log("keys", keys);
                    // @ts-ignore
                    const newStatus = [...keys];
                    if (newStatus.length > 0) {
                        // @ts-ignore
                        await updateTurn({ status: newStatus[0] });
                        refetch();
                        refetchChat && refetchChat();
                    }
                }, children: _jsxs(DropdownSection, { showDivider: true, title: "Change Status", children: [_jsx(DropdownItem, { color: "success", children: "Committed" }, "committed"), _jsx(DropdownItem, { color: "warning", children: "Staged" }, "staged"), _jsx(DropdownItem, { color: "danger", children: "Reverted" }, "reverted")] }) })] }));
};
// Component to render a single turn node
function TurnNode({ turn, indent = 0, refetch }) {
    const { isExpanded, toggleTurn, branchId, setBranchId, refetchChat, setTraceId } = useVersionTree();
    const hasBranches = turn.forked_branches && turn.forked_branches.length > 0;
    // @ts-ignore
    const { trigger: updateTurn } = useUpdateTurn(turn.id, { branchId: branchId });
    return (_jsxs("div", { style: {
            marginLeft: indent * 20 + 40,
            position: 'relative',
            borderLeft: `4px solid ${getStatusColor(turn.status)}`,
            marginTop: 4,
            cursor: 'pointer'
        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'flex-start' }, children: [_jsx("div", { style: { position: 'relative', marginRight: 8, width: 20 } }), _jsx("div", { style: {
                            // backgroundColor: '#f9f9f9',
                            // borderRadius: 4,
                            // padding: 6,
                            minWidth: 200,
                            // boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            cursor: hasBranches ? 'pointer' : 'default',
                        }, onClick: () => hasBranches && toggleTurn(turn.id), children: _jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsxs("span", { style: { color: '#666', fontSize: '12px' }, children: ["#", turn.id] }), _jsx("span", { style: { marginLeft: 8, color: '#666', fontSize: '12px' }, children: new Date(turn.created_at).toLocaleTimeString() }), turn.message && (_jsxs("span", { style: { marginLeft: 8, fontStyle: 'italic', fontSize: '12px' }, children: ["- ", turn.message] })), hasBranches && (_jsxs("span", { style: { marginLeft: 8, fontSize: '12px' }, children: ["[", turn.forked_branches.length, " branches]"] })), turn.trace_id && _jsx(Button, { size: "sm", isIconOnly: true, variant: "light", color: "default", onClick: () => {
                                        // setSideView("tracer-view")
                                        setTraceId(turn.trace_id);
                                    }, children: _jsx(TextSearch, { size: 15, color: "gray" }) }), turn.status !== 'staged' && _jsx(Button, { size: "sm", isIconOnly: true, variant: "light", color: "default", onClick: async () => {
                                        if (turn.status === 'staged') {
                                            return;
                                        }
                                        const newStatus = turn.status === 'committed' ? 'reverted' : 'committed';
                                        // @ts-ignore
                                        await updateTurn({ status: newStatus });
                                        refetch();
                                        refetchChat && refetchChat();
                                        setBranchId(branchId);
                                    }, children: turn.status === 'committed' ? _jsx(Eye, { size: 15, color: "gray" }) : _jsx(EyeOff, { size: 15, color: "gray" }) }), turn && _jsx(TurnDropdown, { turn: turn, refetch: refetch })] }) })] }), hasBranches && isExpanded(turn.id) && (_jsx("div", { style: {
                    marginTop: 4,
                    // display: 'flex',
                }, children: turn.forked_branches.map((branch) => (_jsx(ForkBranchTree, { branch: branch, indent: indent }, branch.id))) }))] }));
}
// Component to fetch and render turns for a given forked branch.
function ForkBranchTree({ branch, indent = 1 }) {
    const { branchId, setBranchId, partitionId } = useVersionTree();
    // const headers = { head_id: String(selectedHeadId) };
    const { data: turns, isLoading, error, mutate } = useBranchTurns(branch.id, partitionId);
    if (isLoading)
        return (_jsxs("div", { style: { marginLeft: indent * 20, fontSize: '12px' }, children: ["Loading branch ", branch.name, "..."] }));
    if (error)
        return (_jsxs("div", { style: {
                marginLeft: indent * 20,
                fontSize: '12px',
                color: 'red',
            }, children: ["Error loading branch ", branch.name, ": ", error.message] }));
    const isSelected = branchId === branch.id;
    return (_jsxs("div", { style: {
            // marginLeft: indent * 20, 
            marginTop: 4,
        }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 4
                }, children: [_jsxs("div", { style: { position: 'relative', marginRight: 8, width: 20 }, children: [_jsx("div", { style: {
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 9,
                                    width: 2,
                                    backgroundColor: '#ccc',
                                } }), _jsx("div", { style: {
                                    position: 'relative',
                                    width: 20,
                                    height: 4,
                                    // borderRadius: '50%',
                                    backgroundColor: '#666',
                                    // border: '2px solid white',
                                    marginLeft: 5,
                                    zIndex: 1,
                                } })] }), _jsxs("div", { style: { zIndex: 5 }, children: [_jsx(Button, { radius: "full", size: "sm", color: isSelected ? "primary" : "secondary", variant: isSelected ? 'solid' : 'bordered', onClick: () => setBranchId(branch.id), startContent: _jsx(GitMerge, { size: 16, color: isSelected ? 'white' : 'purple', className: 'mx-2' }), children: _jsxs("span", { className: 'text-sm ', children: ["#", branch.id] }) }), _jsx("span", { className: 'text-sm mx-3 text-gray-500', children: branch.name })] })] }), isSelected && turns &&
                turns.map((turn) => (_jsx(TurnNode, { turn: turn, indent: indent + 1, refetch: () => mutate() }, turn.id)))] }));
}
// Component for the Master Branch—that is, the top-level tree
// which uses the `/all_turns` endpoint.
function MasterBranchTree({ partitionId }) {
    // const { head, setSelectedBranchId, selectedBranchId } = useArtifactLog()
    const { branchId, setBranchId } = useVersionTree();
    const mainBranchId = 1;
    // const headers = { head_id: String(mainBranchId) };
    // console.log("MasterBranchTree", mainBranchId)
    const { data: turns, isLoading, error, mutate } = useBranchTurns(mainBranchId ?? null, partitionId);
    if (!mainBranchId)
        return _jsx("div", { children: "No head selected" });
    if (isLoading)
        return _jsx("div", { children: "Loading master branch turns..." });
    if (error)
        return _jsxs("div", { children: ["Error loading master branch turns: ", error.message] });
    const isSelected = branchId === mainBranchId;
    return (_jsxs("div", { children: [_jsx(Button, { radius: "full", size: "sm", startContent: _jsx(GitMerge, { size: 16, color: isSelected ? 'white' : 'gray', className: 'mx-2' }), color: isSelected ? "primary" : "secondary", onClick: () => setBranchId(mainBranchId ?? null), variant: isSelected ? 'solid' : 'bordered', children: _jsxs("span", { children: ["#", mainBranchId] }) }), _jsx("span", { className: 'text-sm mx-3 text-gray-500', children: "main branch" }), turns &&
                turns.map((turn) => (_jsx(TurnNode, { turn: turn, indent: 0, refetch: () => mutate() }, turn.id)))] }));
}
// Main component wraps the tree with the context provider
function VersionTree({ partitionId, branchId, setBranchId, setTraceId, refetchChat }) {
    return (_jsx(VersionTreeProvider, { branchId: branchId, setBranchId: setBranchId, setTraceId: setTraceId, refetchChat: refetchChat, partitionId: partitionId, children: _jsx("div", { className: "p-10", children: _jsx(MasterBranchTree, { partitionId: partitionId }) }) }));
}
export default VersionTree;
//# sourceMappingURL=version-tree.js.map