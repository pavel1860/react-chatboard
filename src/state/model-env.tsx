// import { useModelEnvsEndpoint } from "../services/model-service";
import { createContext, useContext, useEffect } from "react";
import useSWR from "swr";
import { useState } from "react";
import useSearchParams from "../hooks/search-params-hook";
import { useParamState } from "../hooks/param-state";



export function useModelEnvsEndpoint() {
    const { data, isLoading, error } = useSWR<string[]>("/api/model/manager/envs", async (url: string) => {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    });

    return {
        data,
        isLoading,
        error
    }
}





interface ModelEnvContextProps {
    envs: string[] | undefined;
    loading: boolean;
    selectedEnv: string;
    setSelectedEnv: (env: string) => void;
}

const ModelEnvContext = createContext<ModelEnvContextProps | undefined>({
    envs: ["default"],
    loading: false,
    selectedEnv: "default",
    setSelectedEnv: () => {}
});

export const ModelEnvProvider: React.FC = ({ children }: any) => {
    // const [selectedEnv, setSelectedEnv] = useState("default");
    const [selectedEnv, setSelectedEnv] = useParamState<string>("default", "env")

    const {
        data,
        error,
        isLoading
    } = useModelEnvsEndpoint()


    const {
        searchParams,
        setSearchParams,
    } = useSearchParams()


    return (
        <ModelEnvContext.Provider value={{ selectedEnv, setSelectedEnv, envs: data, loading: isLoading  }}>
            {children}
        </ModelEnvContext.Provider>
    );
};

export const useModelEnv = () => {
    const context = useContext(ModelEnvContext);
    if (!context) {
        // throw new Error("useModelEnv must be used within a ModelEnvProvider");
        return { envs: ["default"], loading: false, selectedEnv: "default", setSelectedEnv: () => {} }
    }
    return context;
};