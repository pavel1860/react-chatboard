// import { useLazyQuery } from '@apollo/client'
// import axios from 'axios'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
// import { GET_EXAMPLES, GET_RUNS, GET_RUN_TREE } from '../../../graphql/runQueries'
// import { useRouter } from 'next/router'
import { ExampleStateType, useExampleState } from './useExamples'
import { useGetRuns, useGetTree } from '../../../services/chatboard-service'




interface RunStateType {
    hideHistory: boolean
    collapsed: boolean
    depth: number
    runType: string
}

const generateRunTreeState = (run: any, state: {[key: string]: RunStateType}, depth: number)=> {

    state[run.id] = {
        hideHistory: false,
        collapsed: run.run_type == "prompt" ? true : false,   
        depth: depth,
        runType: run.run_type     
    }
    if (run.child_runs){
        for (let child of run.child_runs){
            generateRunTreeState(child, state, depth + 1)
        }
    }
}



interface RunTreeStateType {
    runTree: any, 
    error: any, 
    loading: boolean
    runTreeState: {[key: string]: RunStateType}
    hideHistory: (isHidden: boolean, runId: string | undefined) => void
    collapse: (isCollaped: boolean, runId: string | undefined, depth: number | undefined) => void
    isShowPreview: boolean
    setIsShowPreview: (isShow: boolean) => void
}


export const useRunTreeState = (id: string): RunTreeStateType => {

    // const [getRunTree, runTreeStatus] = useLazyQuery(GET_RUN_TREE)
    // const [getRunTree, runTreeStatus] = useGetTree()
    const {
        runTree,
        error,
        loading,
    } = useGetTree(id)

    const [runTreeState, setRunTreeState] = React.useState<{[key: string]: RunStateType}>({})

    const [isShowPreview, setIsShowPreview] = React.useState<boolean>(false)

    // const router = useRouter()
    // const { id } = router.query
    

    // useEffect(() => {
    //     if (id){
    //         getRunTree({
    //             variables: {
    //                 id: id
    //             }
    //         })
    //     }
    // }, [id])

    // useEffect(() => {
        
    //     if(runTreeStatus.data){
    //         const newState: {[key: string]: RunStateType} = {}
    //         generateRunTreeState(runTreeStatus.data.runTree.run, newState, 0)
    //         setRunTreeState(newState)
    //         console.log('newState: ', newState)
    //     }
    // }, [runTreeStatus.data])

    useEffect(() => {
        
        if(runTree){
            const newState: {[key: string]: RunStateType} = {}
            generateRunTreeState(runTree, newState, 0)
            setRunTreeState(newState)
            console.log('newState: ', newState)
        }
    }, [runTree])


    const hideHistory = (isHidden: boolean, runId: string | undefined) => {
        const newState = {...runTreeState}
        if (!runId){
            for (let key in newState){
                newState[key].hideHistory = isHidden
            }
        }
        else {
            newState[runId].hideHistory = isHidden
        }
        setRunTreeState(newState)
    }

    const collapse = (isCollaped: boolean, runId: string | undefined, depth: number | undefined) => {
        const newState = {...runTreeState}
        if (!runId){
            if (depth !== undefined){
                for (let key in newState){
                    if (newState[key].depth >= depth){
                        newState[key].collapsed = isCollaped
                    }
                }
            } else {
                for (let key in newState){
                    newState[key].collapsed = isCollaped
                }
            }
        }
        else {
            newState[runId].collapsed = isCollaped
        }
        setRunTreeState(newState)
    }

    return {
        runTree: runTree || {},
        error: error,
        loading: loading,
        runTreeState,
        hideHistory,
        collapse,
        isShowPreview,
        setIsShowPreview
    }
}


export const RUN_NAMES = [
    "understan_task",
    "Art Director",
    "FrameAgentRunner",
    // "Transliterator",
    "transliterator",
    "Run Summarize Article",
    "Popup Image Prompt",
    "pirate_writer",
]





interface RunListStateType {
    runsList: any[]
    error: any
    loading: boolean,
    runNamesFilter: Set<string>,
    setRunNamesFilter: (runNames: Set<string>) => void
}

const useRunListState = (): RunListStateType => {

    // const [getRunList, RunListStatus] = useLazyQuery(GET_RUNS, {
    //     variables: {
    //            limit: 150,
    //            offset: 0
    //       }
    // })
    const [runNamesFilter, setRunNamesFilter] = React.useState<Set<string>>(new Set([]))

    // const [getRunList, RunListStatus] = useGetRuns(150, 0, Array.from(runNamesFilter))
    const {
        data: runs,
        error,
        isLoading: loading,
    } = useGetRuns(150, 0, Array.from(runNamesFilter))



    return {
        runsList: runs || [],
        error: error,
        loading: loading,
        runNamesFilter,
        setRunNamesFilter,
    }
}


interface RunsContextType {

    runListState: RunListStateType
    runTreeState: RunTreeStateType
    exampleState: ExampleStateType
}





const RunsContext = React.createContext<RunsContextType>({} as RunsContextType)



export const RunsContextProvider = ({ children, id }: any) => {

    const runListState = useRunListState()
    

    const runTreeState = useRunTreeState(id)

    const exampleState = useExampleState()



    return (
        <RunsContext.Provider value={{ 
            runListState: runListState,
            runTreeState: runTreeState,
            exampleState: exampleState
        }}>
            {children}
        </RunsContext.Provider>
    )
    
}



// const useRunList = () => {
//     const [getRuns, RunsStatus] = useLazyQuery(GET_RUNS, {
//         variables: {
//                limit: 50,
//                offset: 0
//           }
//      })

//     useEffect(() => {
//         getRuns({
//             variables: {
//                 limit: 50,
//                 offset: 0
//             }
        
//         })
//     },  [])

//     return {
//         runs: RunsStatus.data?.runs,
//         error: RunsStatus.error,
//         loading: RunsStatus.loading
//     }

// }


export const useRunContext = () => React.useContext(RunsContext)

export const useRunList = () => {
    
        const {
            runListState
        } = useRunContext()

        return {
            runNamesFilter: runListState.runNamesFilter,
            setRunNamesFilter: runListState.setRunNamesFilter,
            runList: runListState.runsList,
            error: runListState.error,
            loading: runListState.loading
        }
}

export const useRunTree = () => {

    const {
        runTreeState
    } = useRunContext()

    return {
        run: runTreeState.runTree,
        error: runTreeState.error,
        loading: runTreeState.loading,
        runTreeState: runTreeState.runTreeState,
        hideHistory: runTreeState.hideHistory,
        collapse: runTreeState.collapse,
        isShowPreview: runTreeState.isShowPreview,
        setIsShowPreview: runTreeState.setIsShowPreview
    }
}



export const useRunState = (runId: string) => {
    const {
        runTreeState,
        hideHistory,
        collapse,
    } = useRunTree()

    const [runState, setRunState] = React.useState<RunStateType>(runTreeState[runId])


    // const runState = runTreeState[runId]

    useEffect(() => {   
        setRunState(runTreeState[runId])
    }, [runTreeState])
    
    return {
        collapsed: runState && runState.collapsed,
        isHistoryHidden: runState && runState.hideHistory,
        toggleHistory: () => {
            hideHistory(!runState.hideHistory, runId)
        },
        toggleCollapse: () => {
            console.log(runTreeState)
            collapse(!runState.collapsed, runId, undefined)
        }
    }


}




export const useExamples = () => {
    const {
        exampleState
    } = useRunContext()

    return {
        examples: exampleState.examples,
        state: exampleState.state,
        setState: exampleState.setState,
        actions: exampleState.actions,
        setActions: exampleState.setActions,
        namespaceList: exampleState.namespaceList,
        keys: exampleState.keys,
        setInput: exampleState.setKeys,
        values: exampleState.values,
        setValues: exampleState.setValues,
        openExamples: exampleState.openExamples,
        namespace: exampleState.namespace,
        vectorizer: exampleState.vectorizer,
        setVectorizer: exampleState.setVectorizer,
        isNewExamplesOpen: exampleState.isNewExamplesOpen,
        setIsNewExamplesOpen: exampleState.setIsNewExamplesOpen,
        editExampleId: exampleState.editExampleId,
        setEditExampleId: exampleState.setEditExampleId,
        addExampleMessageKey: exampleState.addExampleMessageKey,
        removeExampleMessageKey: exampleState.removeExampleMessageKey,
        editExampleMessageKey: exampleState.editExampleMessageKey,
        addExampleMessageValue: exampleState.addExampleMessageValue,
        addExampleMessageValueMulti: exampleState.addExampleMessageValueMulti,
        removeExampleMessageValue: exampleState.removeExampleMessageValue,
        editExampleMessageValue: exampleState.editExampleMessageValue,
        clearExamples: exampleState.clearExamples,
        saveExample: exampleState.saveExample,
        deleteExample: exampleState.deleteExample,
        selectNamespace: exampleState.selectNamespace,
        addNewNamespace: exampleState.addNewNamespace,
        editExampleAux: exampleState.editExampleAux,
        exampleId: exampleState.exampleId,
        setExampleId: exampleState.setExampleId,
    }
}