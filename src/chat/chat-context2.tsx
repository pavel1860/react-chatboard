import { createContext, useContext, ReactNode, useState, useCallback, useRef } from "react";
import { z } from "zod";
import createArtifactService, { BaseArtifactType } from "../model/services/artifact-service";
import { useHeadEnv, useVersionHead } from "../model/hooks/artifact-head-hooks";
import { useArtifactLayout } from "../hooks/layout-hook";
import { buildHeaders } from "../services/utils";
import { useArtifact } from "../stores/chat-store";
import { create, StoreApi, useStore } from 'zustand'



export type HeadType = {
    branchId: number | null
    turnId: number | null
    partitionId: number | null
}



export type HeadActionsType = {
    setBranchId: (branchId: number) => void
    setTurnId: (turnId: number) => void    
    setPartitionId: (partitionId: number | null) => void
}


export type ArtifactLogStoreType = HeadType & HeadActionsType


// export type ArtifactLogStoreType = {
//     branchId: number | null
//     setBranchId: (branchId: number) => void
//     turnId: number | null
//     setTurnId: (turnId: number) => void    
//     partitionId: number | null
//     setPartitionId: (partitionId: number | null) => void
//     setBranchEnv: (branchId: number, turnId: number) => void

// }


export const createArtifactLogSlice = () => {
    
    return (set: any, get: any): ArtifactLogStoreType => ({
        branchId: 1,
        setBranchId: (branchId: number) => set({ branchId: branchId }),
        turnId: null,
        setTurnId: (turnId: number) => set({ turnId: turnId }),
        partitionId: null,
        setPartitionId: (partitionId: number | null) => set({ partitionId: partitionId }),
        setBranchEnv: (branchId: number, turnId: number) => set({ branchId: branchId, turnId: turnId }),
    })
}



export interface ToolCall {
    name: string;
    payload: any;
}


interface ChatOptions {
    completeUrl: string
}


function useChat<T>(
    mutate: (key: string, data: any, options?: any) => Promise<any>,    
    model: string,
    schema: z.ZodType<T>, 
    options: ChatOptions = {        
        completeUrl: "/api/ai/complete"
    }
) {


    const [sending, setSending] = useState(false);


    const {
        ArtifactSchema: MessageArtifactSchema,
        useArtifactList: useMessageList,
        useArtifact: useMessage,
        useCreateArtifact: useCreateMessage,
        useUpdateArtifact: useUpdateMessage,
    } = createArtifactService(model, schema)

    
    

    const complete = useCallback(
        async (
            message: T,
            toolCalls: ToolCall[],
            state: any,
            fromMessageId?: string | null,
            files?: any,
            onSucesss?:(toolCall: ToolCall) => void,
            head?: HeadType
        ) => {
            try {
                setSending(true);

                const mock_message = {
                    //@ts-ignore
                    id: currentData && currentData.length > 0 ? currentData[0].id + 1 : 10000,
                    score: -1,
                    //@ts-ignore
                    turn_id: currentData && currentData.length > 0 ? currentData[0].turn_id + 1 : 1,
                    created_at: new Date().toISOString(),
                    ...message,
                } as T & BaseArtifactType;

                const optimisticData = [mock_message, ...(currentData || [])];

                const completeRequest = async (message: T, toolCalls: ToolCall[], state: STATE, messageHistory: any[], files?: any) => {
                    const formData = new FormData();
                    formData.append("message_json", JSON.stringify(message));
                    formData.append("tool_calls_json", JSON.stringify(toolCalls));
                    formData.append("state_json", JSON.stringify(state));
                    if (files) {
                        formData.append('file', files);
                    }

                    const headers = buildHeaders({
                        "partition_id": head?.partitionId,
                        "branch_id": head?.branchId,
                        "turn_id": head?.turnId,
                        "from_message_id": fromMessageId,
                        "session_id": sessionId
                    })

                    const res = await fetch(completeUrl, {
                        method: "POST",
                        body: formData,
                        headers: headers,
                    });
                    if (res.ok) {
                        const responseMessages = await res.json();
                        console.log("### responseMessages", responseMessages)
                        for (const message of responseMessages) {
                            if (message.tool_calls.length > 0) {
                                for (const toolCall of message.tool_calls) {
                                    onSucesss && onSucesss(toolCall)
                                }
                            }
                        }
                        return [...responseMessages, ...messageHistory];
                    } else {
                        throw new Error("Failed to send message.", { cause: res.statusText });
                    }
                };

                await mutate(
                    // listKey,
                    completeRequest(
                        message,
                        toolCalls,
                        state,
                        currentData || [],
                        files
                    ),
                    {
                        optimisticData,
                        rollbackOnError: true,
                    }
                );
            } catch (error) {
                console.error(error);
            } finally {
                setSending(false);
            }
        }, [currentData, mutate]);


    return {
        complete,
        sending
    }
}
