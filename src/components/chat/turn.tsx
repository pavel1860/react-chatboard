import { Button, cn, Divider, Spinner, Card, CardBody, Chip } from "@heroui/react"
import { useEffect, useRef, useState } from "react"
import { Icon } from "@iconify-icon/react"
import { ToolCall, TurnType } from "./schema"
import { JSONTree } from "react-json-tree"











interface TurnProps <T extends TurnType, M> {
    children: (item: M, index: number, items: M[]) => React.ReactNode
    className?: string
    turn: T
    items: M[]
    showFooterControls?: boolean
    showSideControls?: boolean
    index: number
    nextTurn: T | undefined
    prevTurn: T | undefined
    branchId: number
    isSelected?: boolean
    setBranchId: (branchId: number) => void
    // sendMessage: (message: string, toolCalls: ToolCall[], state: any, prevTurnId: string, isFork: boolean) => void
    sendMessage: (
        content: string,
        toolCalls?: ToolCall[],
        state?: any,
        fromTurnId?: number | null,
        addBranch?: boolean,
        files?: any,
        role?: string
    ) => Promise<void>
    topContent?: React.ReactNode
    bottomContent?: React.ReactNode
    rightContent?: React.ReactNode
    handleApproval?: (status: "committed" | "reverted", refetchChat?: () => void) => void
    onBranchChange?: (branchId: number) => void
    evaluators?: React.ReactNode
    refetchChat?: () => void
}

interface TurnApprovalProps {
    onApprove?: () => void
    onReject?: () => void
    isProcessing?: boolean
    message?: string
}

export const TurnApproval = ({ 
    onApprove, 
    onReject, 
    isProcessing = false,
    message = "awaiting approval"
}: TurnApprovalProps) => {

    return (
        <div className="font-mono text-xs bg-gray-50 border border-gray-200 p-2 rounded">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:clock" className="text-gray-500" />
                    <span className="text-gray-700">{message}</span>
                    {isProcessing && <Spinner size="sm" />}
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        color="success"
                        onPress={onApprove}
                        disabled={isProcessing}
                        className="text-sm font-mono px-3 py-1 h-7 min-w-0 font-bold"
                    >
                        ✓
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        color="danger"
                        onPress={onReject}
                        disabled={isProcessing}
                        className="text-sm font-mono px-3 py-1 h-7 min-w-0 font-bold"
                    >
                        ✗
                    </Button>
                </div>
            </div>
        </div>
    )
} 


export const Turn = <T extends TurnType, M>({
        children: itemRender,
        turn, 
        items, 
        index, 
        nextTurn, 
        prevTurn, 
        branchId, 
        setBranchId, 
        sendMessage, 
        showFooterControls = false, 
        showSideControls = false,
        className = "",
        topContent,
        bottomContent,
        rightContent,
        onBranchChange,
        evaluators,
        isSelected = false,
        refetchChat,
        handleApproval,
    }: TurnProps<T, M>) => {

    const [forkedBranches, setForkedBranches] = useState<number[]>([])
    const [fbLookup, setFbLookup] = useState<Record<string, number>>({})
    const [nextBranch, setNextBranch] = useState<number | null>(null)
    const [prevBranch, setPrevBranch] = useState<number | null>(null)
    const [showRawData, setShowRawData] = useState(false);
    const ref = useRef(null);
    const [offset, setOffset] = useState(null);




    useEffect(() => {
        if (ref.current) {
            // @ts-ignore
            setOffset(ref.current.offsetTop)
        }
    }, [turn.id]);

    useEffect(() => {
        if (!prevTurn || prevTurn.forkedBranches.length === 0) {
            return
        }
        const prevForkedBranches = [prevTurn.branchId, ...prevTurn.forkedBranches]
        setForkedBranches(prevForkedBranches)
        const lookup: Record<string, number> = {};
        forkedBranches.forEach((branch, index) => {
            lookup[branch] = index;
        });
        setFbLookup(lookup);
    }, [prevTurn, turn])

    useEffect(() => {
        if (!prevTurn || prevTurn.forkedBranches.length === 0) {
            return
        }

        if (prevTurn.branchId !== turn.branchId){
            const index = forkedBranches.findIndex(b => b == turn.branchId)
            if (index !== -1){                
                if (index == 0){
                    setPrevBranch(null)
                    setNextBranch(forkedBranches[1])
                } else if (index == forkedBranches.length - 1){
                    setPrevBranch(forkedBranches[forkedBranches.length - 2])
                    setNextBranch(null)
                } else {
                    setPrevBranch(forkedBranches[index - 1])
                    setNextBranch(forkedBranches[index + 1])
                }
            }
        } else {
            setPrevBranch(null)
            setNextBranch(forkedBranches.length > 0 ? forkedBranches[1] : null)
        }

    }, [branchId, forkedBranches]);

    const handlePrevBranch = () => {
        if (prevBranch){
            setBranchId(prevBranch)
            onBranchChange?.(prevBranch)
        }
    };

    const handleNextBranch = () => {
        if (nextBranch){
            setBranchId(nextBranch)
            onBranchChange?.(nextBranch)
        }
    };

    if (!items || items.length === 0) {
        return null
    }

    const isStaged = turn.status === "staged"

    return (
        <div 
            key={turn.id} 
            ref={ref} 
            className={cn(
                "flex w-full pb-5",
                isStaged && "border-l-4 border-orange-400 bg-orange-50/30 rounded-r-lg p-2",
                className
            )}
        >                        
            <div className="flex-1">                
                {topContent && <div className="flex flex-row items-center gap-2 justify-between">
                    {topContent}
                    
                </div>}
                {isStaged && (
                    <div className="flex items-center gap-2 mb-2 font-mono text-xs text-orange-600">
                        <Icon icon="mdi:clock-outline" className="text-orange-500" />
                        <span>STAGED FOR APPROVAL</span>
                    </div>
                )}
                <div className={cn("flex flex-col justify-start")}>
                    {items.map((item, idx) => {                        
                        if (!item){
                            console.log(`Turn(${turn.id}) item`, item)
                        }
                        return itemRender(item, idx, items)
                    })}
                </div>
                {showFooterControls && <div className="flex flex-row items-center gap-2 justify-between">
                    {bottomContent}
                    {/* <div className="text-sm text-gray-400">next: {nextBranch}</div> */}
                    {/* <div className="text-sm text-gray-400">prev: {prevBranch}</div> */}
                    <Button variant={showRawData ? "solid" : "light"} className="text-sm text-gray-400" onPress={() => setShowRawData(!showRawData)} size="sm">{showRawData ? "Hide Raw" : "Raw"}</Button>
                    <div className="text-sm text-gray-400">Turn {turn.id}</div>
                    
                    {/* <div className="flex gap-2 w-full px-10">                        
                        
                    </div>                     */}
                    <div className="text-sm text-gray-400 flex flex-row items-center gap-2">
                        {prevBranch ? <Button isIconOnly variant="light" onPress={handlePrevBranch} size="sm">
                            <Icon icon="mdi:arrow-left" className="text-gray-400" />
                        </Button> :  <div className="w-8">&nbsp;</div>}
                        {forkedBranches.length > 0 && <span> {prevBranch ? fbLookup[turn.branchId] + 1 : 1}/{forkedBranches.length} </span>}                        
                        {nextBranch ? <Button isIconOnly variant="light" onPress={handleNextBranch} size="sm">
                            <Icon icon="mdi:arrow-right" className="text-gray-400" />
                        </Button> : <div className="w-8">&nbsp;</div>}
                    </div>
                </div>}
                {turn.status === "staged" && <TurnApproval onApprove={() => handleApproval?.("committed", refetchChat)} onReject={() => handleApproval?.("reverted", refetchChat)} />}
                {evaluators && isSelected && <div className="flex flex-col items-center justify-start">
                    {evaluators}
                </div>}
                {showRawData && <JSONTree data={turn} />}
            </div>
            {rightContent && <div className="flex flex-col items-center justify-start">
                {rightContent}
            </div>}

            


        </div>
    )
}