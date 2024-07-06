// import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
// import { ADD_EXAMPLES, DELETE_EXAMPLE, EDIT_EXAMPLE, GET_EXAMPLES, GET_NAMESPACES, GET_RUNS, GET_RUN_TREE } from '../../../graphql/runQueries'
import { useLayout } from './promptLayoutContext'
import { MessageType } from '../messages'
import { ExampleType } from '../types'
import { useAddExampleService, useDeleteExample, useEditExampleService, useGetExamples, useGetNamespaces } from '@/services/chatboard-service'



export interface ExampleStateType {
    examples: any[]
    namespace: string | undefined
    vectorizer: string
    setVectorizer: (vectorizer: string) => void
    namespaceList: {name: string, vector_count: number}[]
    state: any
    setState: (state: any) => void
    actions: any
    setActions: (actions: any) => void
    keys: {[id: string]: ExampleKey}
    setKeys: (input: any) => void
    values: {[id: string]: ExampleValue}
    setValues: (output: any) => void
    openExamples: (namespace: string) => void
    isNewExamplesOpen: boolean    
    setIsNewExamplesOpen:   (isOpen: boolean) => void
    editExampleId: string | undefined
    setEditExampleId: (id: string | undefined) => void
    addExampleMessageKey: (message: MessageType, exampleNamespace: string) => void
    removeExampleMessageKey: (id: string) => void
    editExampleMessageKey: (id: string, text: string) => void
    addExampleMessageValue: (message: MessageType, exampleNamespace: string) => void
    addExampleMessageValueMulti: (example: ExampleType, exampleNamespace: string) => void
    removeExampleMessageValue: (id: string) => void
    editExampleMessageValue: (id: string, text: string) => void 
    clearExamples: () => void
    saveExample: () => void
    deleteExample: (id: string) => void
    selectNamespace: (newNamespace: string) => void
    addNewNamespace: (newNamespace: string, newVectorizer: string) => void
    editExampleAux: (id: string, values: any) => void
    exampleId: string | undefined
    setExampleId: (id: string | undefined) => void
}


export interface ExampleKey {
    id: string
    message: MessageType
}


export interface ExampleValue {
    id: string
    message: MessageType
}

export const useExampleState = () => {

    const [state, setState] = React.useState<any>(null)
    const [actions, setActions ] = React.useState<any>(null)
    const [keys, setKeys] = React.useState<{[id: string]: ExampleKey}>({})
    const [values, setValues] = React.useState<{[id: string]: ExampleValue}>({})

    const [namespace, setNamespace] = React.useState<string | undefined>()
    const [vectorizer, setVectorizer] = React.useState<string>("state")
    // const []

    // const [getExamples, examplesStatus] = useLazyQuery(GET_EXAMPLES)
    // const [addExamples, addExamplesStatus] = useMutation(ADD_EXAMPLES)
    // const [editExample, editExampleStatus] = useMutation(EDIT_EXAMPLE)
    // const [deleteExample, deleteExampleStatus] = useMutation(DELETE_EXAMPLE)

    const [getExamples, examplesStatus] = useGetExamples()
    // const [addExamples, addExamplesStatus] = useAddExampleService()
    const {addExample } = useAddExampleService()
    const [editExample, editExampleStatus] = useEditExampleService()
    const [deleteExample, deleteExampleStatus] = useDeleteExample()

    const [isNewExamplesOpen, setIsNewExamplesOpen] = React.useState<boolean>(false)
    const [editExampleId, setEditExampleId] = React.useState<string | undefined>(undefined)
    const [exampleId, setExampleId] = React.useState<string | undefined>(undefined)

    const [namespaceList, setNamespaceList] = React.useState<{name: string, vector_count: number, vectorizer: string}[]>([])
    // const namespacesStatus = useQuery(GET_NAMESPACES)
    const namespacesStatus = useGetNamespaces()

    const {
        isExamplesOpen,
        setIsExamplesOpen
    } = useLayout()



    useEffect(() => {
        if (namespacesStatus.data) {
            setNamespaceList(namespacesStatus.data.namespaces)
        }
    }, [namespacesStatus.data])


    const addNewNamespace = (newNamespace: string, newVectorizer: string) => {
        if (namespaceList.find(n => n.name === newNamespace)) {
            return
        }
        setNamespaceList([...namespaceList, {name: newNamespace, vector_count: 0, vectorizer: newVectorizer}])

    }

    const selectNamespace = (newNamespace: string) => {
        const namespaceData = namespaceList.find(n => n.name === newNamespace)
        if (namespace !== newNamespace) {
            getExamples({
                variables: {
                    namespace: newNamespace,
                    limit: 10,
                    vectorizer: namespaceData?.vectorizer || "messages"
                }
            })
        }
        
        setVectorizer(namespaceData?.vectorizer || "messages")
        setNamespace(newNamespace)
    }

    const openExamples = (namespace: string) => {
        const namespaceData = namespaceList.find(n => n.name === namespace)
        getExamples({
            variables: {
                namespace,
                vectorizer: namespaceData?.vectorizer || "messages",
                limit: 10
            }
        })
        
        setVectorizer(namespaceData?.vectorizer || "messages")
        setNamespace(namespace)
        setIsExamplesOpen(true)
    }

    const addExampleMessageKey = (message: MessageType, exampleNamespace: string) => {
        setIsExamplesOpen(true)
        if (!namespace) {
            const namespaceData = namespaceList.find(n => n.name === exampleNamespace)
            setVectorizer(namespaceData?.vectorizer || "messages")
            setNamespace(exampleNamespace)
        } else if (namespace != exampleNamespace) {
            console.warn("Namespace mismatch")
            // return
        }
        setKeys({...keys, [message.id]: {id: message.id, message}})
    }

    const addExampleMessageValue = (message: MessageType, exampleNamespace: string) => {        
        setIsExamplesOpen(true)
        if (!namespace) {
            setNamespace(exampleNamespace)
        } else if (namespace != exampleNamespace) {
            console.warn("Namespace mismatch")
            // return
        }
        setValues({...values, [message.id]: {id: message.id, message}})
    }

    // const addExampleMessageValueMulti = (messages: MessageType[], exampleNamespace: string) => {        
    //     setIsExamplesOpen(true)
    //     if (!namespace) {
    //         setNamespace(exampleNamespace)
    //     } else if (namespace != exampleNamespace) {
    //         console.warn("Namespace mismatch")
    //     }
    //     let newValues: any = {}
    //     messages.forEach((message, index) => { 
    //         newValues[index] = {id: index, message: {...message, id: index} }
    //     })
    //     setValues(newValues)
    // }
    const addExampleMessageValueMulti = (example: ExampleType, exampleNamespace: string) => {        
        setIsExamplesOpen(true)
        if (!namespace) {
            setNamespace(exampleNamespace)
        } else if (namespace != exampleNamespace) {
            console.warn("Namespace mismatch")
        }
        let newValues: any = {}
        example.value.messages.forEach((message: any, index: number) => { 
            newValues[index] = {id: index, message: {...message, id: index} }
        })
        let newKeys: any = {}
        example.key?.messages.forEach((message: any, index: number) => { 
            newKeys[index] = {id: index, message: {...message, id: index} }
        })
        setState(example.state)
        setValues(newValues)
        setKeys(newKeys)
        setActions(example.value.actions)
    }

    const removeExampleMessageKey = (id: string) => {
        setIsExamplesOpen(true)
        const newKeys = {...keys}
        delete newKeys[id]
        setKeys(newKeys)
        
    }

    const removeExampleMessageValue = (id: string) => {
        setIsExamplesOpen(true)
        const newValues = {...values}
        delete newValues[id]
        setValues(newValues)

    }

    const editExampleMessageKey = (id: string, text: string) => {
        // setIsExamplesOpen(true)
        keys[id].message.content = text
    }

    const editExampleMessageValue = (id: string, text: string) => {
        setIsExamplesOpen(true)
        values[id].message.content = text
    }

    const deleteExampleAux = async (id: string) => {
        if (!namespace) {
            console.error("No namespace")
            return
        }
        deleteExample({
            variables: {
                namespace,
                vectorizer,
                id
            },
            onCompleted: () => {
                examplesStatus.refetch()
            }
        })
    }

    const editExampleAux = (id: string, values: any) => {
        if (!namespace) {
            console.error("No namespace")
            return
        }
        editExample({
            variables: {
                namespace,
                vectorizer,
                id,
                values
            },
            onCompleted: () => {
                examplesStatus.refetch()
            }
        })
    }

    const clearExamples = () => {
        setKeys({})
        setValues({})
        setState(null)
        setActions(null)
        setExampleId(undefined)
        setEditExampleId(undefined)
        // setNamespace(undefined)
    }

    const saveExample = async () => {
        if (!namespace) {
            console.error("No namespace")
            return
        }
        if (editExampleId) {
            editExample({
                variables: {
                    namespace,
                    vectorizer,
                    example: {
                        id: editExampleId,
                        state: state,
                        key: {
                            messages: Object.values(keys).map((k: ExampleKey)=> k.message),
                        },
                        value: {
                            messages: Object.values(values).map((v: ExampleValue)=> v.message),
                            actions: actions
                        }
                    }
                },
                onCompleted: () => {
                    clearExamples()
                    setIsNewExamplesOpen(false)
                    examplesStatus.refetch()
                }
            })

        } else {
            addExample({
                variables: {
                    namespace,
                    vectorizer,
                    examples: [{
                        id: exampleId,
                        state: state,
                        key: {
                            messages: Object.values(keys).map((k: ExampleKey)=> k.message),
                        },
                        value: {
                            messages: Object.values(values).map((v: ExampleValue)=> v.message),
                            actions: actions
                        }
                    }]
                },
                onCompleted: () => {
                    clearExamples()
                    setIsNewExamplesOpen(false)
                    examplesStatus.refetch()
                }
            })
        }
    }

    

    return {
        examples: examplesStatus.data?.examples || [],
        namespaceList: namespaceList,
        namespace,
        vectorizer,
        setVectorizer,
        state,
        setState,
        actions,
        setActions,
        keys: keys,
        setKeys,
        values: values,
        setValues,
        openExamples,
        isNewExamplesOpen,
        setIsNewExamplesOpen,
        editExampleId,
        setEditExampleId,
        addExampleMessageKey,
        removeExampleMessageKey,
        editExampleMessageKey,
        addExampleMessageValue,
        addExampleMessageValueMulti,
        removeExampleMessageValue,
        editExampleMessageValue,
        clearExamples,
        saveExample,
        deleteExample: deleteExampleAux,
        selectNamespace,
        addNewNamespace,
        editExampleAux,
        exampleId,
        setExampleId
    }
}

