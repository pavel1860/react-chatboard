import createModelService from "../services/model-service";
import { z, ZodSchema } from "zod";
import { StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { StateStorage, persist, createJSONStorage} from "zustand/middleware";
import useSearchParams from "../hooks/search-params-hook";
import { useEffect } from "react";





function capitalize(string: string) {
    if (!string) return ''; // Handle empty or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
}


interface SingleModelState<T> {
    selectedId: string | null;
    selectedItem: T | null;
    setSelectedId: (id: string | null) => void;
    setSelectedItem: (item: T | null) => void;
}


type ModelsState = {
    [modelName: string]: SingleModelState<any>;
};




// export const createModelSlice = <T, ModelName extends string>(
//     modelNameList: ModelName[]
// ): StateCreator<ModelsState, [], [], SingleModelState<T>> => {

//     const slice = (set: any, get: any) => (modelNameList.reduce((acc: any, modelName: string) => ({
//                     ...acc,
//                     [modelName]: null,
//                     [`set${capitalize(modelName)}`]: (id: string | null) =>
//                         set((state: any) => ({
//                             ...state,
//                             [modelName]: id,                            
//                         })),
//                     [`unset${capitalize(modelName)}`]: () =>
//                         set((state: any) => ({
//                             ...state,
//                             [modelName]: null,                            
//                         })),
//                 }), {}))
        

//     return slice
// }




// export const createModelSlice = <T>(
//     modelNameList: string[]
// ) => {

//     return (set: any, get: any) => (modelNameList.reduce((acc: any, modelName: string): T => ({
//                     ...acc,
//                     [modelName]: null,
//                     [`set${capitalize(modelName)}`]: (id: string | null) =>
//                         set((state: any) => ({
//                             ...state,
//                             [modelName]: id,                            
//                         })),
//                     [`unset${capitalize(modelName)}`]: () =>
//                         set((state: any) => ({
//                             ...state,
//                             [modelName]: null,                            
//                         })),
//                 }), {}))
// }

export function createModelSlice<T>(
    modelNameList: string[]
): StateCreator<T>{

    return (set: any, get: any) => (modelNameList.reduce((acc: any, modelName: string): T => ({
                    ...acc,
                    [modelName]: null,
                    [`set${capitalize(modelName)}`]: (id: string | null) =>
                        set((state: any) => ({
                            ...state,
                            [modelName]: id,                            
                        })),
                    // [`unset${capitalize(modelName)}`]: () =>
                    //     set((state: any) => ({
                    //         ...state,
                    //         [modelName]: null,                            
                    //     })),
                }), {}))
}





export function createModelStateHook<S extends UseBoundStore<StoreApi<object>>, ModelName extends string>(
    modelName: string,
    store: S
) {

    const useModel = () => {
        //@ts-ignore
        const modelId = store(state => state[modelName] as string)
        //@ts-ignore
        const setModelId = store(state => state[`set${capitalize(modelName)}`] as (id: string | null) => void)
        //@ts-ignore
        // const unsetModelId = store(state => state[`unset${capitalize(modelName)}`])

        const {
            searchParams,
            setSearchParams,
        } = useSearchParams()

        useEffect(() => {
            if (modelId) {
                setSearchParams({[modelName]: modelId})
            } else {
                setSearchParams({[modelName]: null})
            }
        }, [modelId])

        useEffect(() => {
            const param = searchParams.get(modelName)
            if (param && param !== modelId) {
                setModelId(param)
            } 
        }, [searchParams.get(modelName)])

        
        return [modelId, setModelId] as const
    }

    return useModel
}




