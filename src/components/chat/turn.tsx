import { Button, cn, Divider } from "@heroui/react"
import { useEffect, useRef, useState } from "react"
import { Icon } from "@iconify-icon/react"
import { ToolCall, TurnType } from "./schema"








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
    setBranchId: (branchId: number) => void
    sendMessage: (message: string, toolCalls: ToolCall[], state: any, prevTurnId: string, isFork: boolean) => void
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
    }: TurnProps<T, M>) => {

    const [selectedForkedBranchId, setSelectedForkedBranchId] = useState<number | null>(null);
    const [forkedBranches, setForkedBranches] = useState<number[]>(()=>{
        if (turn.forkedBranches.length){
            return [turn.branchId, ...turn.forkedBranches];
        }
        return [];
    });
    // const [fbLookup, setFbLookup] = useState<Record<string, number>>({});
    const [fbLookup, setFbLookup] = useState<Record<string, number>>(()=>{
        const lookup: Record<string, number> = {};
        forkedBranches.forEach((branch, index) => {
            lookup[branch] = index;
        });
        return lookup;
    });
    const [showNextBranch, setShowNextBranch] = useState(false);
    const [showPrevBranch, setShowPrevBranch] = useState(false);
    const ref = useRef(null);
    const [offset, setOffset] = useState(null);

    useEffect(() => {
        if (ref.current) {
            setOffset(ref.current.offsetTop)
        }
    }, [turn.id]);


    useEffect(() => {
        if (forkedBranches.length === 0) {
            return
        }
        let targetBranch = null;
        if (branchId in fbLookup) {
            targetBranch = branchId;
        } else if (nextTurn && nextTurn.branchId in fbLookup) {
            targetBranch = nextTurn.branchId;
        } else {
            targetBranch = null;
        }

        if (targetBranch !== null) {
            setShowNextBranch(fbLookup[targetBranch] < forkedBranches.length - 1);
            setShowPrevBranch(fbLookup[targetBranch] > 0);
        } else {
            if (forkedBranches.length > 0) {
                setShowNextBranch(true);
                setShowPrevBranch(false);
            } else {
                setShowNextBranch(false);
                setShowPrevBranch(false);
            }
        }
        setSelectedForkedBranchId(targetBranch);

    }, [branchId, forkedBranches]);
    
    


    const handlePrevBranch = () => {
        if (selectedForkedBranchId && fbLookup[selectedForkedBranchId] > 0) {
            setBranchId(forkedBranches[fbLookup[selectedForkedBranchId] - 1]);
        }
    };

    const handleNextBranch = () => {
        if (!selectedForkedBranchId){
            setBranchId(forkedBranches[0]);
        } else if (fbLookup[selectedForkedBranchId] < forkedBranches.length - 1) {
            setBranchId(forkedBranches[fbLookup[selectedForkedBranchId] + 1]);
        }
    };

    if (forkedBranches.length > 0) {        
        console.log("fbLookup", fbLookup)        
    }

    
    return (
        <div key={turn.id} ref={ref} className={cn("flex w-full pb-5", className)}>            
            <div className="flex-1">
                {items.map((item, idx) => itemRender(item, idx, items))}
                {showFooterControls && <div className="flex flex-row items-center gap-2 justify-between">
                    <div className="text-sm text-gray-400">chat idx: {index}</div>
                    <Divider orientation="vertical" className="mx-3"/>
                    <div className="flex gap-2">
                        <div className="text-sm text-gray-400">offset: {offset}</div>
                        <div className="text-sm text-gray-400">Turn {turn.id}</div>
                        <div className="text-sm text-gray-400">Partition: {turn.partitionId}</div>
                        <div className="text-sm text-gray-400">Status: {turn.status}</div>
                        <div className="text-sm text-gray-400">Index: {turn.index}</div>
                        <div className="text-sm text-gray-400">Branch: {turn.branchId}</div>
                        {forkedBranches.length > 0 && <div className="text-sm text-gray-400"> ({forkedBranches.join(", ")})</div>}
                    </div>                    
                    <div className="text-sm text-gray-400">
                        {showPrevBranch && <Button isIconOnly variant="light" onPress={handlePrevBranch} size="sm">
                            <Icon icon="mdi:arrow-left" />
                        </Button>}
                        {forkedBranches.length > 0 && <span> {selectedForkedBranchId ? fbLookup[selectedForkedBranchId] + 1 : 1}/{forkedBranches.length} </span>}
                        {showNextBranch && <Button isIconOnly variant="light" onPress={handleNextBranch} size="sm">
                            <Icon icon="mdi:arrow-right" />
                        </Button>}
                    </div>
                </div>}
            </div>
            {showSideControls && <div>
                <Button 
                    isIconOnly
                    variant="light"                                    
                    onPress={() => {
                        if (prevTurn) {
                            sendMessage(items[0].content, items[0].toolCalls, items[0].state, prevTurn.id, true)
                        }
                    }}>
                    <Icon icon="mdi:refresh" />
                </Button>
            </div>}
        </div>
    )
}