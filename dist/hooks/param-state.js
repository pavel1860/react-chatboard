import { useEffect, useState } from "react";
import useSearchParams from "./search-params-hook";
import { useParams } from "next/navigation";
export function useParamState(defaultValue, paramName) {
    const [state, setState] = useState(defaultValue);
    const { searchParams, setSearchParams, } = useSearchParams();
    const param = searchParams.get(paramName);
    useEffect(() => {
        if (param && param !== state) {
            setState(param);
        }
    }, [param]);
    useEffect(() => {
        if (state) {
            setSearchParams({ [paramName]: state });
        }
    }, [state]);
    return [state, setState];
}
export const useIntParamId = (name) => {
    const params = useParams();
    const { [name]: paramId = undefined } = params || {};
    if (!paramId) {
        return undefined;
    }
    if (Array.isArray(paramId)) {
        return Number.parseInt(paramId[0]);
    }
    return Number.parseInt(paramId);
};
//# sourceMappingURL=param-state.js.map