import { useEffect, useState } from "react"
import useSearchParams from "./search-params-hook"





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