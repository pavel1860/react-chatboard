// import { ArrayField } from "@/react-chatboard/src/components/form/array-field"
// import { Form } from "@/react-chatboard/src/components/form/form2"
// import { InputField } from "@/react-chatboard/src/components/form/input-field"
import { Message, MessageBubble, MessageContent, MessageFooter, MessageTime } from "@/react-chatboard/src/components/chat-view/chat-message"
import { Form, InputField, ArrayField, TextField } from "@/react-chatboard/src/components/form"
import { TestCaseBaseSchema, TestCaseSchema, useCreateTestCase, useDeleteTestCase, useGetTestCase, useRunTestCase, useUpdateTestCase } from "@/react-chatboard/src/services/testing-service"
import { Button, Spinner } from "@nextui-org/react"

import { MessageSchema, MessageType, useMessageList } from "@/src/services/message-service";

import { useEffect, useState } from "react"

import { useHeadEnv } from "@/react-chatboard/src/hooks/artifact-log-hook"
import { Wrapper } from "@/react-chatboard/src/components/layout/main-layout";
import { Play } from "lucide-react";
import { useArtifactLayout } from "@/react-chatboard/src/hooks/layout-hook";
import { useRouter } from "next/router";







export const useTestCaseMessages = (branchId: number, turnId: number) => {

    console.log(">>>>>>>>>>>>>>> branchId", branchId, "turnId", turnId)
    const {
        data: messages,
        isLoading: messagesLoading,
        error: messagesError,
        mutate: mutateMessages
    } = useMessageList(branchId, turnId, 10, 0)

    // const { turnId, setTurnId } = useHeadEnv()
    console.log("messages", messages)

    const [filteredMessages, setFilteredMessages] = useState<MessageType[]>([])

    useEffect(() => {
        let tempMessages = []
        if (turnId && messages) {
            console.log("branchId", branchId, "turnId", turnId)
            let found = false
            for (let i = messages?.length - 1; i >= 0; i--) {
                if (messages[i].turn_id === turnId) {
                    found = true
                }
                if (found && messages[i].turn_id !== turnId) {
                    break
                }
                tempMessages.push(messages[i])
            }
            setFilteredMessages(tempMessages)
        } else {
            setFilteredMessages([])
        }
    }, [turnId, messages])

    return {
        messages: filteredMessages,
        messagesLoading,
        messagesError,
        mutateMessages
    }
}



interface TestCaseFormProps {
    headerComponent?: React.ReactNode
    branchId?: number
    turnId?: number
    defaultValues?: any
    onSubmit: (data: any) => void
    loading: boolean
    error: any
}

export const TestCaseForm = ({ onSubmit, loading, error, defaultValues, headerComponent, branchId, turnId }: TestCaseFormProps) => {

    


    const [hideContext, setHideContext] = useState(false)
    

    const {
        messages,
        messagesLoading,
        messagesError,
        mutateMessages
    } = useTestCaseMessages(branchId, turnId)
    

    return (
        <Form
            schema={TestCaseBaseSchema}
            defaultValues={defaultValues}
            size="sm"            
            onSubmit={(data) => {
                onSubmit({...data, head: {branch_id: branchId, turn_id: turnId}})                
            }}
        >
            <Wrapper>
                {headerComponent || <Button size="sm" color="primary" type="submit" isLoading={loading}>Submit</Button>}
                {/* <input type="submit" /> */}
                <InputField type="text" label="Title" field="title" />
                <InputField type="text" label="Description" field="description" />
            </Wrapper>
            {messagesLoading && <div className="text-md p-4 flex justify-center"><Spinner /></div>}
            {messagesError && <div className="text-md p-4 flex justify-center text-red-500">Error loading messages</div>}
            {messages.length === 0 ? <div className="text-md p-4 flex justify-center">No Context</div> :
            <Wrapper>
                <div className="bg-blue-100 border-l-2 border-green-300 p-2 ml-1  ">
                    <div className="flex justify-flex-start items-center gap-4 bg-blue-200 shadow-sm rounded-md">
                        <Button size="sm" variant="light" color="primary" onPress={() => setHideContext(!hideContext)}>{hideContext ? "Show Context" : "Hide Context"}</Button>
                        {branchId && <span className="text-sm">Branch: {branchId}</span>}
                        {turnId && <span className="text-sm">Turn: {turnId}</span>}
                    </div>
                    {!hideContext && messages.map((message) => (
                        <div key={message.id} className="py-1">
                            <Message role={message.role} created_at={message.created_at} width="500px" >
                                <div className="text-sm">{message.content}</div>
                            </Message>  
                        </div>
                    ))}
                
                </div>
            </Wrapper>    
            }
            <ArrayField field="input_turns" addComponent={(addItem) => <Button onPress={addItem} variant="light" size="sm" color="primary">+ Add Turn</Button>}>
                {(item, index, prefix, remove) => (
                    <div key={index} className="border-2 border-gray-300 rounded-md p-2">
                        <h3>Turn {index + 1}</h3>
                        <Message role="user" created_at={undefined} width={"500px"} >
                            <TextField 
                                type="text" 
                                label="Input" 
                                field={`${prefix}.input`} 
                                color="primary" 
                                // classNames={{
                                //     inputWrapper: "!bg-blue-500 !hover:bg-blue-600",
                                //     input: "!text-[#FFFFFF]"
                                // }} 
                            />
                        </Message>
                        <h3>Expected Output</h3>
                        <Message role="assistant" created_at={undefined} width="50%" >
                            <TextField type="text" label="Output" field={`${prefix}.output`} />
                        </Message>
                        <Button size="sm" variant="light" color="danger" onPress={() => remove(index)}>Remove</Button>
                    </div>
                )}
            </ArrayField>

        </Form>
    )
}




export const TestCaseNewForm = () => {

    const {
        isMutating: isCreatingTestCase,
        trigger: createTestCase,
        error: createTestCaseError,
    } = useCreateTestCase()

    const router = useRouter()

    const { artifactView, setArtifactView } = useArtifactLayout()

    const { branchId, turnId } = useHeadEnv()

    if (!branchId || !turnId) {
        return <div>No branch or turn id found</div>
    }

    return (        
        <TestCaseForm 
            onSubmit={async (data: any) => {
                const res = await createTestCase({...data}) 
                router.push(`/admin/test-cases/${res.id}`)
            } }
            branchId={branchId}
            turnId={turnId}
            loading={isCreatingTestCase} 
            error={createTestCaseError} 
            defaultValues={{
                title: "",
                description: "",
                input_turns: [{
                    input: "",
                    output: ""
                }]
            }} 
            headerComponent={<div className="flex justify-between gap-8 w-full p-2">
                <Button 
                    size="sm" 
                    color="primary" 
                    type="submit" 
                    isLoading={isCreatingTestCase}
                >Submit</Button>   
                <Button size="sm" color="danger" variant="light" onPress={() => setArtifactView("version-tree")}>Cancel</Button>
                </div>
            }
            />        
    )
}



export const TestCaseUpdateForm = ({ testCaseId }: { testCaseId: number }) => {

    const {
        runTestCase,
        isRunningTestCase,
        runTestCaseError,
    } = useRunTestCase()

    const {
        data: testCase,
        isLoading: isLoadingTestCase,
        error: loadingTestCaseError,
    } = useGetTestCase(testCaseId)

    const {
        isMutating: isUpdatingTestCase,
        trigger: updateTestCase,
        error: updateTestCaseError,
    } = useUpdateTestCase(testCaseId)

    const {
        isMutating: isDeletingTestCase,
        trigger: deleteTestCase,
        error: deleteTestCaseError,
    } = useDeleteTestCase(testCaseId)

    // const testCase = {
    //     title: "sadfsadf",
    //     description: "sadfsadf",
    //     input_turns: [{
    //         input: "sadfsadf!!!!!!!!!!!!!!!!!!",
    //         output: "sadfsadf11112222221"
    //     }]
    // }

    return (
        <TestCaseForm
            key={testCaseId} 
            onSubmit={updateTestCase} 
            branchId={testCase?.head.branch_id}
            turnId={testCase?.head.turn_id}
            loading={isUpdatingTestCase} 
            error={updateTestCaseError} 
            defaultValues={testCase}
            headerComponent={<div className="flex justify-between gap-8 w-full p-2">
                <Button 
                    size="sm" 
                    color="success" 
                    type="button" 
                    variant="shadow" 
                    startContent={<Play />} 
                    onPress={() => runTestCase({test_case_id: testCaseId})} 
                    isLoading={isRunningTestCase}>Run</Button>
                <div className="flex justify-end gap-4">
                    <Button 
                        size="sm" 
                        color="primary" 
                        type="submit" 
                        isLoading={isUpdatingTestCase} 
                        onPress={() => updateTestCase({id: testCaseId})}
                    >Update</Button>
                    <Button 
                        size="sm" 
                        color="danger" 
                        type="button" 
                        variant="light" 
                        onPress={() => deleteTestCase({id: testCaseId})} 
                        isLoading={isDeletingTestCase}>Delete</Button>
                </div>
            </div>}
        />
    )
}