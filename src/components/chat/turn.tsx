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
    bottomContent?: React.ReactNode
    rightContent?: React.ReactNode
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
        bottomContent,
        rightContent,
    }: TurnProps<T, M>) => {

    const [selectedForkedBranchId, setSelectedForkedBranchId] = useState<number | null>(null);
    const [forkedBranches, setForkedBranches] = useState<number[]>([])
    const [fbLookup, setFbLookup] = useState<Record<string, number>>({})
    // const [forkedBranches, setForkedBranches] = useState<number[]>(()=>{
    //     if (turn.forkedBranches.length){
    //         return [turn.branchId, ...turn.forkedBranches];
    //     }
    //     return [];
    // });
    // const [fbLookup, setFbLookup] = useState<Record<string, number>>({});
    // const [fbLookup, setFbLookup] = useState<Record<string, number>>(()=>{
    //     const lookup: Record<string, number> = {};
    //     forkedBranches.forEach((branch, index) => {
    //         lookup[branch] = index;
    //     });
    //     return lookup;
    // });
    const [nextBranch, setNextBranch] = useState<number | null>(null)
    const [prevBranch, setPrevBranch] = useState<number | null>(null)
    const [showNextBranch, setShowNextBranch] = useState(false);
    const [showPrevBranch, setShowPrevBranch] = useState(false);
    const ref = useRef(null);
    const [offset, setOffset] = useState(null);

    useEffect(() => {
        if (ref.current) {
            setOffset(ref.current.offsetTop)
        }
    }, [turn.id]);


    // useEffect(() => {
    //     if (forkedBranches.length === 0) {
    //         return
    //     }
    //     let targetBranch = null;
    //     if (branchId in fbLookup) {
    //         targetBranch = branchId;
    //     } else if (nextTurn && nextTurn.branchId in fbLookup) {
    //         targetBranch = nextTurn.branchId;
    //     } else {
    //         targetBranch = null;
    //     }

    //     if (targetBranch !== null) {
    //         setShowNextBranch(fbLookup[targetBranch] < forkedBranches.length - 1);
    //         setShowPrevBranch(fbLookup[targetBranch] > 0);
    //     } else {
    //         if (forkedBranches.length > 0) {
    //             setShowNextBranch(true);
    //             setShowPrevBranch(false);
    //         } else {
    //             setShowNextBranch(false);
    //             setShowPrevBranch(false);
    //         }
    //     }
    //     setSelectedForkedBranchId(targetBranch);

    // }, [branchId, forkedBranches]);
    console.log("#####", "prevTurn", prevTurn?.id, "turn", turn.id, "nextTurn", nextTurn?.id)
    console.log("#####", turn.id, "next", showNextBranch, "prev", showPrevBranch)
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

        if (prevTurn.branchId !== turn.branchId){
            const index =prevForkedBranches.findIndex(b => b == turn.branchId)
            if (index !== -1){                
                if (index == 0){
                    setPrevBranch(null)
                    setNextBranch(prevForkedBranches[1])
                } else if (index == prevForkedBranches.length - 1){
                    setPrevBranch(prevForkedBranches[prevForkedBranches.length - 2])
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

    }, [branchId]);
    
    


    const handlePrevBranch = () => {
        if (prevBranch){
            setBranchId(prevBranch)
        }
    };

    const handleNextBranch = () => {
        if (nextBranch){
            setBranchId(nextBranch)
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
                    {/* <div className="text-sm text-gray-400">chat idx: {index}</div> */}
                    {/* <div className="text-sm text-gray-400">Turn {turn.id}</div>
                    <div className="text-sm text-gray-400">Status: {turn.status}</div>
                    <div className="text-sm text-gray-400">Branch: {turn.branchId}</div>
                    <Divider orientation="vertical" className="mx-3"/> */}
                    <div className="flex gap-2 w-full px-10">
                        {/* <div className="text-sm text-gray-400">offset: {offset}</div> */}
                        {/* <div className="text-sm text-gray-400">Turn {turn.id}</div> */}
                        {/* <div className="text-sm text-gray-400">Partition: {turn.partitionId}</div> */}
                        {bottomContent}
                        {/* <div className="text-sm text-gray-400">Index: {turn.index}</div> */}
                        
                        {/* {forkedBranches.length > 0 && <div className="text-sm text-gray-400"> ({forkedBranches.join(", ")})</div>} */}
                    </div>                    
                    <div className="text-sm text-gray-400 flex flex-row items-center gap-2">
                        {prevBranch ? <Button isIconOnly variant="light" onPress={handlePrevBranch} size="sm">
                            <Icon icon="mdi:arrow-left" className="text-gray-400" />
                        </Button> :  <div className="w-8">&nbsp;</div>}
                        {forkedBranches.length > 0 && <span> {prevBranch ? fbLookup[turn.branchId] + 1 : 1}/{forkedBranches.length} </span>}
                        {/* {forkedBranches.length > 0 && <span> {prevBranch}/{nextBranch} </span>} */}
                        {nextBranch ? <Button isIconOnly variant="light" onPress={handleNextBranch} size="sm">
                            <Icon icon="mdi:arrow-right" className="text-gray-400" />
                        </Button> : <div className="w-8">&nbsp;</div>}
                    </div>
                </div>}
            </div>
            {rightContent && <div className="flex flex-col items-center justify-start">
                {rightContent}
            </div>}
            
            {/* {showSideControls && <div>
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
            </div>} */}
        </div>
    )
}