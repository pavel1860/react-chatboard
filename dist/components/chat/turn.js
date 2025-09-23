import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, cn, Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { JSONTree } from "react-json-tree";
export const TurnApproval = ({ onApprove, onReject, isProcessing = false, message = "awaiting approval" }) => {
    return (_jsx("div", { className: "font-mono text-xs bg-gray-50 border border-gray-200 p-2 rounded", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Icon, { icon: "mdi:clock", className: "text-gray-500" }), _jsx("span", { className: "text-gray-700", children: message }), isProcessing && _jsx(Spinner, { size: "sm" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "ghost", color: "success", onPress: onApprove, disabled: isProcessing, className: "text-sm font-mono px-3 py-1 h-7 min-w-0 font-bold", children: "\u2713" }), _jsx(Button, { size: "sm", variant: "ghost", color: "danger", onPress: onReject, disabled: isProcessing, className: "text-sm font-mono px-3 py-1 h-7 min-w-0 font-bold", children: "\u2717" })] })] }) }));
};
export const Turn = ({ children: itemRender, turn, items, index, nextTurn, prevTurn, branchId, setBranchId, sendMessage, showFooterControls = false, showSideControls = false, className = "", topContent, bottomContent, rightContent, onBranchChange, evaluators, isSelected = false, refetchChat, handleApproval, }) => {
    const [forkedBranches, setForkedBranches] = useState([]);
    const [fbLookup, setFbLookup] = useState({});
    const [nextBranch, setNextBranch] = useState(null);
    const [prevBranch, setPrevBranch] = useState(null);
    const [showRawData, setShowRawData] = useState(false);
    const ref = useRef(null);
    const [offset, setOffset] = useState(null);
    useEffect(() => {
        if (ref.current) {
            // @ts-ignore
            setOffset(ref.current.offsetTop);
        }
    }, [turn.id]);
    useEffect(() => {
        if (!prevTurn || prevTurn.forkedBranches.length === 0) {
            return;
        }
        const prevForkedBranches = [prevTurn.branchId, ...prevTurn.forkedBranches];
        setForkedBranches(prevForkedBranches);
        const lookup = {};
        forkedBranches.forEach((branch, index) => {
            lookup[branch] = index;
        });
        setFbLookup(lookup);
    }, [prevTurn, turn]);
    useEffect(() => {
        if (!prevTurn || prevTurn.forkedBranches.length === 0) {
            return;
        }
        if (prevTurn.branchId !== turn.branchId) {
            const index = forkedBranches.findIndex(b => b == turn.branchId);
            if (index !== -1) {
                if (index == 0) {
                    setPrevBranch(null);
                    setNextBranch(forkedBranches[1]);
                }
                else if (index == forkedBranches.length - 1) {
                    setPrevBranch(forkedBranches[forkedBranches.length - 2]);
                    setNextBranch(null);
                }
                else {
                    setPrevBranch(forkedBranches[index - 1]);
                    setNextBranch(forkedBranches[index + 1]);
                }
            }
        }
        else {
            setPrevBranch(null);
            setNextBranch(forkedBranches.length > 0 ? forkedBranches[1] : null);
        }
    }, [branchId, forkedBranches]);
    const handlePrevBranch = () => {
        if (prevBranch) {
            setBranchId(prevBranch);
            onBranchChange?.(prevBranch);
        }
    };
    const handleNextBranch = () => {
        if (nextBranch) {
            setBranchId(nextBranch);
            onBranchChange?.(nextBranch);
        }
    };
    if (!items || items.length === 0) {
        return null;
    }
    const isStaged = turn.status === "staged";
    return (_jsxs("div", { ref: ref, className: cn("flex w-full pb-5", isStaged && "border-l-4 border-orange-400 bg-orange-50/30 rounded-r-lg p-2", className), children: [_jsxs("div", { className: "flex-1", children: [topContent && _jsx("div", { className: "flex flex-row items-center gap-2 justify-between", children: topContent }), isStaged && (_jsxs("div", { className: "flex items-center gap-2 mb-2 font-mono text-xs text-orange-600", children: [_jsx(Icon, { icon: "mdi:clock-outline", className: "text-orange-500" }), _jsx("span", { children: "STAGED FOR APPROVAL" })] })), _jsx("div", { className: cn("flex flex-col justify-start"), children: items.map((item, idx) => {
                            if (!item) {
                                console.log(`Turn(${turn.id}) item`, item);
                            }
                            return itemRender(item, idx, items);
                        }) }), showFooterControls && _jsxs("div", { className: "flex flex-row items-center gap-2 justify-between", children: [bottomContent, _jsx(Button, { variant: showRawData ? "solid" : "light", className: "text-sm text-gray-400", onPress: () => setShowRawData(!showRawData), size: "sm", children: showRawData ? "Hide Raw" : "Raw" }), _jsxs("div", { className: "text-sm text-gray-400", children: ["Turn ", turn.id] }), _jsxs("div", { className: "text-sm text-gray-400 flex flex-row items-center gap-2", children: [prevBranch ? _jsx(Button, { isIconOnly: true, variant: "light", onPress: handlePrevBranch, size: "sm", children: _jsx(Icon, { icon: "mdi:arrow-left", className: "text-gray-400" }) }) : _jsx("div", { className: "w-8", children: "\u00A0" }), forkedBranches.length > 0 && _jsxs("span", { children: [" ", prevBranch ? fbLookup[turn.branchId] + 1 : 1, "/", forkedBranches.length, " "] }), nextBranch ? _jsx(Button, { isIconOnly: true, variant: "light", onPress: handleNextBranch, size: "sm", children: _jsx(Icon, { icon: "mdi:arrow-right", className: "text-gray-400" }) }) : _jsx("div", { className: "w-8", children: "\u00A0" })] })] }), turn.status === "staged" && _jsx(TurnApproval, { onApprove: () => handleApproval?.("committed", refetchChat), onReject: () => handleApproval?.("reverted", refetchChat) }), evaluators && isSelected && _jsx("div", { className: "flex flex-col items-center justify-start", children: evaluators }), showRawData && _jsx(JSONTree, { data: turn })] }), rightContent && _jsx("div", { className: "flex flex-col items-center justify-start", children: rightContent })] }, turn.id));
};
//# sourceMappingURL=turn.js.map