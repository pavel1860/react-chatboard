import React, { useEffect, useState } from 'react';
import { useExamples } from './state/runsContext';
import { Message, MessageType } from './messages';
import PromptTextEditor from './editors/promptTextEditor';
import { ExampleKey, ExampleValue } from './state/useExamples';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spacer, Popover, PopoverTrigger, PopoverContent, Input } from '@heroui/react';
import { useLayout } from './state/promptLayoutContext';
import { ExampleType, RunType } from './types';
import { EditableJsonState, JsonState } from './stateJsonView';



const ExampleErrorPopover = ({children, error}: {children: any, error: string | null}) => {

    return (
        <Popover isOpen={error !== null} onOpenChange={(open) => {}}>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent>
                <div className="px-1 py-2">
                    <div className="text-small font-bold text-red-400">Error</div>
                    <p className="text-small text-red-400">{error}</p>
                </div>
            </PopoverContent>
        </Popover>        
    );

}


const ExampleButton = ({children, isAdd, onClick}: {children: any, isAdd?: boolean, onClick: () => void}) => {
    return (
        <button
            className="mx-2 text-purple-500 hover:text-blue-500"
            onClick={onClick}
    > {children}</button>) 
    
}


export const ExampleKeyButton = ({message, namespace}: {message: MessageType, namespace: string}) => {

    const {
        keys,
        addExampleMessageKey,
        removeExampleMessageKey,
        editExampleMessageKey,
        isNewExamplesOpen
    } = useExamples()

    if (!isNewExamplesOpen) return null

    return keys[message.id] ?
        (<ExampleButton
            onClick={() => {

                removeExampleMessageKey(message.id)            
            }}
        > remove key</ExampleButton>) :
        (<ExampleButton
            onClick={() => {
                addExampleMessageKey(message, namespace)
            }}
        >add key</ExampleButton>)
    
}

export const ExampleValueButton = ({message, namespace}: {message: MessageType, namespace: string}) => {

    const {
        values,
        addExampleMessageValue,
        removeExampleMessageValue,
        editExampleMessageValue,
        isNewExamplesOpen,
        setExampleId
    } = useExamples()

    if (!isNewExamplesOpen) return null

    return values[message.id] ?
        (<ExampleButton
            onClick={() => {                
                removeExampleMessageValue(message.id)            
            }}
        > remove value</ExampleButton>) :
        (<ExampleButton
            onClick={() => {
                setExampleId(message.id)
                addExampleMessageValue(message, namespace)
            }}
        >add value</ExampleButton>)
}


export const ExampleStateButton = ({run, parentRun, namespace}: {run: RunType, parentRun: RunType, namespace: string}) => {
    const {
        values,
        addExampleMessageValue,
        removeExampleMessageValue,
        editExampleMessageValue,
        vectorizer,
        examples,
        isNewExamplesOpen,
        setVectorizer,
        state,
        setState,
        setActions,
        setExampleId,
    } = useExamples()

    

    const [error, setError] = useState<string | null>(null)

    if (!isNewExamplesOpen) return null
    
    const getActions = (parentRun: RunType) => {
        const actions: any = []
        for (let c of parentRun.child_runs){
            if (c.run_type == "prompt"){
                if (c.outputs.tool_calls && c.outputs.tool_calls.length > 0){
                    actions.push(c.outputs.tool_calls[0])
                }                
            }
            
            if (c.id === run.id) break
        }
        return actions
    }

    return values[run.id] ?
        (<ExampleButton
            onClick={() => {
                setState(null)
                removeExampleMessageValue(`out_msg_${run.id}`)
            }}
        > remove state</ExampleButton>) :
        (
            <ExampleErrorPopover error={error}>
                <ExampleButton
                    onClick={() => {
                        if (examples.length > 0){
                            if (vectorizer != "state"){
                                setError("this RAG space is not supporting state vectorization")
                                return
                            }
                        } else {
                            setVectorizer("state")
                        }
                        setError(null)
                        if (run.outputs.state && run.inputs.state){
                            setExampleId(run.id)
                            setState(run.inputs.state)
                            const outMessages = run.outputs.state._conversation.messages
                            const message = outMessages[outMessages.length - 1]                    
                            addExampleMessageValue({
                                id: `out_msg_${run.id}`,
                                role: message.role,
                                content: message.content,
                                //@ts-ignore
                                toolCalls: message.tool_calls,
                            }, namespace)
                            const inActions = run.inputs.state._actions
                            const outActions = run.outputs.state._actions
                            setActions(outActions.slice(inActions.length))
                        }
                        
                    }}
                >add state</ExampleButton>
        </ExampleErrorPopover>
        )
}

// interface ExampleType {
//     id: string
//     key: {
//         // dense: number[],
//         // sparse: number[]
//         messages: any[],
//     },
//     value: {
//         feedback: string,
//         messages: any[],
//     },
//     state: any
// }

interface ExampleProps {
    example: ExampleType
    
}



// const useEditExample = (editableExample: ExampleType) => {


//     const {
//         editExampleAux,
//     } = useExamples()

//     const messagesToValues = (messages: any[]) => {
//         const values: {[id: string]: ExampleValue} = {}
//         messages.forEach((m, i) => {
//             values[i] = {
//                 id: `${i}`,
//                 message: m
//             }
//         })
//         return values
//     }

//     // const [editableExample, setEditableExample] = useState<ExampleType | undefined>(undefined)

//     const [values, setValues] = React.useState<{[id: string]: ExampleValue}>({})


//     useEffect(() => {
//         if (editableExample){
//             if (editableExample)
//                 setValues(messagesToValues(editableExample.value.messages))
//         } else {
//             setValues({})
//         }
//     }, [editableExample])

//     return {
//         // editableExample,
//         // setEditableExample,
//         editExample: () => {
//             editableExample && editExampleAux(editableExample.id, Object.values(values).map(v => v.message))
//         }, 
//         onChange:(text: string, i: number) => {
//             if (values[`${i}`]){
//                 const newValues = {...values}
//                 newValues[`${i}`].message.content = text
//                 setValues(newValues)
//             }
//         }
//     }

// }



// export const EditableExample = ({editableExample, setEditableExample} : ExampleProps) => {

//     const {
//         editExample,
//         onChange,
//     } = useEditExample(editableExample)


    
//     return (<div className='bg-slate-400 p-2'>
//         <div className='flex justify-between'>
//             <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-purple-600 text-slate-50' >Example</span>
//             <div>
//                 <button 
//                     className='bg-green-400 hover:bg-green-300 rounded-md p-1 px-2'
//                     onClick={() => {
//                         editExample()
//                         setEditableExample(undefined)
//                     }}    
//                 >Save</button>
//                 <button 
//                     className='bg-red-400 hover:bg-red-300 rounded-md p-1 px-2 mr-20'
//                     onClick={() => {
//                         setEditableExample(undefined)
//                     }}    
//                 >Cancel</button>
//             </div>
//         </div>
//         {editableExample && editableExample.value.messages.map((m, i) => (
//             <Message
//                 key={"example-editble-value-" + i}
//                 message={m}
//                 isEditable
//                 isExpended
//                 onChange={(text: string) => {
//                     onChange(text, i)                    
//                 }}
//             />
//         ))}
//     </div>)
    

// }

export const Example = ({example} : ExampleProps) => {

    const {
        namespace,
        deleteExample,
        editExampleAux,
        setIsNewExamplesOpen,
        addExampleMessageValueMulti,
        setEditExampleId,


    } = useExamples()


    

    

    // const [values, setValues] = React.useState<{[id: string]: ExampleValue}>(()=>{
    //     const values: {[id: string]: ExampleValue} = {}
    //     example.value.messages.forEach((m, i) => {
    //         values[i] = {
    //             id: `${i}`,
    //             message: m
    //         }
    //     })
    //     return values
    // })
    
    console.log("################")
    return (
        <div className='bg-slate-400 p-2'>
            <div className='flex justify-between'>
                <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-purple-600 text-slate-50' >Example</span>
                <div>
                    <button 
                        className='mx-2 text-purple-600 hover:text-blue-500 p-1 px-2'
                        onClick={() => {
                            if (namespace){
                                setIsNewExamplesOpen(true)
                                setEditExampleId(example.id)
                                addExampleMessageValueMulti(example, namespace)
                                // let i = 0

                                // for (let m of example.value.messages){
                                //     addExampleMessageValue(m, namespace)
                                //     // addExampleMessageValue(, namespace)
                                // }
                            }
                            
                            // setEditableExample(example)
                            // setValues(messagesToValues(example.value.messages))
                            // deleteExample(example.id)
                        }}    
                    >Edit</button>
                    <button 
                        className='mx-2 text-red-600 hover:text-blue-500 p-1 px-2'
                        onClick={() => {
                            deleteExample(example.id)
                        }}    
                    >Delete</button>
                </div>
            </div>
            {example.state && 
                <div className='flex'>
                    <JsonState data={example.state} />                    
                </div>}
            {example.value.messages.map((m, i) => (
                <Message 
                    key={"example-value-" + i}
                    message={m} 
                    isEditable={false}                   
                />
            ))}
        </div>
    )
}



export const ExampleKeyItem = ({exampleKey, onChange}: {exampleKey: ExampleKey, onChange?: (text: string) => void}) => {

    return (

        <div className="bg-neutral-200 rounded-md max-h-72 overflow-scroll border-1 border-slate-400 p-1">
            <PromptTextEditor 
            //@ts-ignore
                text={exampleKey.message.content} 
                onChangeText={onChange}
                paragraphLabel={'editor-paragraph-input'} 
            />
        </div>
    )
}


export const ExampleValueItem = ({exampleValue, namespace, onChange}: {exampleValue: ExampleValue, namespace: string, onChange?: (text: string) => void}) => {
    
    return (

        <div className="bg-neutral-200 rounded-sm">
            <Message 
                message={exampleValue.message} 
                isEditable 
                isExpended
                onChange={onChange}

                controls={[
                    <ExampleValueButton key={'value-btn'} message={exampleValue.message} namespace={namespace}/>
                ]}
            />
            {/* <PromptTextEditor 
                text={exampleValue.message.content} 
                onChangeText={(text: string)=>{}}
                paragraphLabel={'editor-paragraph-output'}/> */}
        </div>
    )
}


export const NewExampleForm = () => {


    const {
        examples,
        state,
        setState,
        actions,
        keys,
        values,
        openExamples,
        namespace,
        clearExamples,
        saveExample,
        setIsNewExamplesOpen,
        editExampleMessageKey,
        editExampleMessageValue
    } = useExamples()


    return (
        <div className='bg-slate-200 p-2 border-1 border-slate-400 rounded-md z-[5000]'>
            <div className='flex justify-between'>                
                <span className='text-lg'>New Example</span>
                <div className="flex">
                    <button 
                        className='bg-blue-400 hover:bg-blue-300 p-1 px-2 mr-4' 
                        onClick={()=>{
                            saveExample()
                        }}
                    >Add</button>
                    <button 
                        className='bg-red-400 hover:bg-red-300 p-1 px-2' 
                        onClick={()=>{
                            clearExamples()
                            setIsNewExamplesOpen(false)
                        }}
                    >Cancel</button>
                </div>
            </div>
            <div className=''>
                
                <span className='p-1 px-2 bg-purple-500 text-white rounded-lg'>keys</span>
                {state && <EditableJsonState data={state} onChange={(text: string, keyPath: string[]) => {
                    let curr = state
                    for (let i = 0; i < keyPath.length - 2; i++){
                        curr = curr[keyPath[i]]
                    }
                    curr[keyPath[keyPath.length - 1]] = text
                }}/>}
                {Object.values(keys).map((exampleKey: ExampleKey, i) => (<ExampleKeyItem key={i} exampleKey={exampleKey} 
                    onChange={(text: string)=>{
                        editExampleMessageKey(exampleKey.message.id, text)
                    }}/>))}
            </div>
            <div>
                <span className='p-1 px-2 bg-purple-500 text-white rounded-lg'>values</span>
                {actions && <EditableJsonState data={actions} />}
                {namespace && Object.values(values).map((exampleValue: ExampleValue, i) => (<ExampleValueItem key={i} exampleValue={exampleValue} namespace={namespace} 
                    onChange={(text: string)=> {
                        editExampleMessageValue(exampleValue.message.id, text)
                    }} />))}            
            </div>
        </div>
    )

}


const ChooseVectorizerButton = () => {
    const {
        vectorizer,
        setVectorizer,
    } = useExamples()

    return (
        <>
            <Dropdown  >
                <DropdownTrigger>
                    <Button 
                        variant="ghost" 
                        className="border-indigo-700 text-indigo-700"
                        // className="capitalize"
                        // color=''
                    >
                    {vectorizer}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Multiple selection example"
                    variant="flat"
                    onAction={(ns) => setVectorizer(ns as string)}
                >
                    <DropdownItem key={"state"}>{"state"}</DropdownItem>
                    <DropdownItem key={"messages"}>{"messages"}</DropdownItem>
                </DropdownMenu>
            </Dropdown>            
        </>
      );
}


const AddNamespaceButton = () => {
    const {
        namespace,
        namespaceList,
        selectNamespace,
        addNewNamespace,
        vectorizer
    } = useExamples()


    const [newNamespace, setNewNamespace] = useState('')
    const [newVectorizer, setNewVectorizer] = useState('messages')

  return (
    <>
        <Dropdown  >
            <DropdownTrigger>
                <Button 
                    variant="ghost" 
                    className="border-indigo-700 text-indigo-700 rounded-e-none"
                    // className="capitalize"
                    // color=''
                >
                {namespace}<span className="rounded px-1 ml-3 bg-purple-500 text-white text-sm">{vectorizer}</span>
                </Button>
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Multiple selection example"
                variant="flat"
                onAction={(ns) => selectNamespace(ns as string)}
                // closeOnSelect={false}
                // selectionMode="multiple"
                // selectedKeys={namespaceList.map((n: any) => n.name)}
                // onSelectionChange={() => {
                //     // selectNamespace as any
                //     console.log("$$$$$$$$$$$$")
                // }}
            >
                {namespaceList.map((ns: any) => (<DropdownItem key={ns.name}>{ns.name}<span className="rounded px-1 ml-3 bg-purple-500 text-white text-sm">{ns.vectorizer}</span></DropdownItem>))}                                        
            </DropdownMenu>
        </Dropdown>
        <Popover
        showArrow
        offset={10}
        placement="bottom"      
        >
        <PopoverTrigger>
            <Button className='rounded-l-none bg-custom-gradient text-white' isIconOnly>+</Button>
        </PopoverTrigger>
        <PopoverContent>
            <div className="px-1 py-2 flex">
                <Input size="sm" value={newNamespace} onChange={(e)=> setNewNamespace(e.target.value)}/>
                <Button isIconOnly onPress={() => addNewNamespace(newNamespace, newVectorizer)}> add</Button>
                <Dropdown  >
                <DropdownTrigger>
                    <Button 
                        variant="ghost" 
                        className="border-indigo-700 text-indigo-700"
                        // className="capitalize"
                        // color=''
                    >
                    {newVectorizer}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Multiple selection example"
                    variant="flat"
                    onAction={(ns) => setNewVectorizer(ns as string)}
                >
                    <DropdownItem key={"state"}>{"state"}</DropdownItem>
                    <DropdownItem key={"messages"}>{"messages"}</DropdownItem>
                </DropdownMenu>
            </Dropdown>            
            </div>
        </PopoverContent>
        </Popover>
    </>
  );
}




export const ExampleView = () => {

    const {
        examples,
        namespace,
        isNewExamplesOpen,
        setIsNewExamplesOpen,
        namespaceList,
        selectNamespace,
        editExampleId
    } = useExamples()

    const {
        isExamplesOpen,
        setIsExamplesOpen
    } = useLayout()


    
    return (
        <div>
            
            <div className="sticky top-0">
                <div className='flex justify-between bg-slate-400'>
                    <div>
                        {/* <span className='p-1 px-2 bg-blue-500 text-white rounded-lg'>prompt</span>                 */}
                        {/* <span>{namespace}</span> */}

                        <AddNamespaceButton/>                        
                    </div>
                    <span className='pl-4'>{examples.length} Examples</span>
                    <button 
                        className='p-1 px-2 hover:bg-slate-300 text-slate-600'
                        onClick={()=>{
                            setIsExamplesOpen(false)
                        }}    
                    >X</button>
                </div>
                
                {isNewExamplesOpen ?
                    <NewExampleForm/> :
                    <button 
                        className='bg-purple-400 hover:bg-purple-300 text-white p-1 px-2' 
                        onClick={()=>{
                            setIsNewExamplesOpen(true)
                        }}
                    >New Example</button> 
                    
                }
                    
                
            </div>
            {examples.length == 0 && <div className='w-full text-center p-10 text-slate-500'>No Examples</div>}
            {!isNewExamplesOpen && examples.map((example, i) => {
                if (example.id === editExampleId) return null
                return (
                    <div
                        className='py-1' 
                        key={i} 
                        onClick={() => {
                        // setState(example.state)
                        // setInput(example.input)
                        // setOutput(example.output)
                    }}>
                        <Example example={example} />
                    </div>
                )
            })}
        </div>
    )

}