import { useEffect, useState } from "react"
import useSearchParams from "./search-params-hook"
import { useParams } from "next/navigation"





export function useParamState<T>(defaultValue: T, paramName: string){
    const [state, setState] = useState<T>(defaultValue)

    const {
        searchParams,
        setSearchParams,
    } = useSearchParams()

    const param = searchParams.get(paramName)
    useEffect(() => {
        if (param && param !== state) {
            setState(param as T)
        }
    }, [param])

    useEffect(() => {
        if (state) {
            setSearchParams({[paramName]: state as any})
        }
    }, [state])

    return [state, setState] as const
}




export const useIntParamId = (name: string) => {
    const params = useParams();
    const { [name]: paramId = undefined } = params || {}
    if (!paramId) {
        return undefined
    }
    if (Array.isArray(paramId)) {
        return Number.parseInt(paramId[0])
    }
    return Number.parseInt(paramId)
}
