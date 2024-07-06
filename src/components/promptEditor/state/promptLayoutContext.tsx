
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'



interface PromptLayoutContextType {
    openRunId: string
    isExamplesOpen: boolean
    setIsExamplesOpen: (isOpen: boolean) => void
}


export const PromptLayoutContext = React.createContext<PromptLayoutContextType>({} as any);


export const PromptLayoutProvider = ({ children, id }: any) => {

    const [isExamplesOpen, setIsExamplesOpen] = React.useState<boolean>(false)

    // const router = useRouter()
    // const { id } = router.query

    return (
        <PromptLayoutContext.Provider value={{
            openRunId: id as string,
            isExamplesOpen,
            setIsExamplesOpen,
        }}>
            {children}
        </PromptLayoutContext.Provider>
    )
}



export const useLayout = () => {
    return React.useContext(PromptLayoutContext)
}   