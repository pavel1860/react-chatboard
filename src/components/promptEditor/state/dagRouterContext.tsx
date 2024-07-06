import React from 'react';



export const DagRouterContext = React.createContext<{
    currentDisplay: DisplayType
    setCurrentDisplay: (display: DisplayType) => void
    currentSideView: SideViewType
    setCurrentSideView: (sideView: SideViewType) => void,
    currentState: any,
    setCurrentState: (state: any) => void,
    editExample: (example: any) => void,
    clearExample: () => void,
}>({} as any);


export enum DisplayType {
    STATES,
    JSON
}

export enum SideViewType {
    NONE,
    EXAMPLE_EDIT,
}



export const DagRouterProvider = ({ children }: any) => {

    const [currentDisplay, setCurrentDisplay] = React.useState<DisplayType>(DisplayType.STATES)
    const [currentSideView, setCurrentSideView] = React.useState<SideViewType>(SideViewType.NONE)

    const [currentState, setCurrentState] = React.useState<any>(null)

    const editExample = (example: any) => {
        setCurrentSideView(SideViewType.EXAMPLE_EDIT)
        setCurrentState(example)

    }

    const clearExample = () => {
        setCurrentSideView(SideViewType.NONE)
        setCurrentState(null)
    }

    return (
        <DagRouterContext.Provider value={{
            currentDisplay,
            setCurrentDisplay,
            currentSideView,
            setCurrentSideView,
            currentState, 
            setCurrentState,
            editExample,
            clearExample,
        }}>
            {children}
        </DagRouterContext.Provider>
    )
}








export const useDagDisplayRouter = ()=> {
    const context = React.useContext(DagRouterContext)
    if (context === undefined) {
        throw new Error('useDagDisplayRouter must be used within a DagRouterProvider')
    }
    return context    
}
