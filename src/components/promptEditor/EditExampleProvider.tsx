import { useAddExampleService } from "../../services/chatboard-service";
import { useChatboard } from "../../state/chatboard-state";
import React, { use, useEffect, useState } from "react";



export const useRagNamespaceList = () => {

  const {
    metadata
  } = useChatboard()

  useEffect(() => {
    if (metadata.rag_spaces.length > 0) {
      setSelectedNamespace(metadata.rag_spaces[0].namespace);
    }
  }, [metadata]);

  const [selectedNamespace, setSelectedNamespace] = useState<string | undefined>();

  return {
    namespaces: metadata.rag_spaces.map(n => n.namespace),
    selectedNamespace, 
    setSelectedNamespace
  }
}



export function getNestedField(obj: any, fields: any[]) {
  return fields.reduce((acc, field) => acc && acc[field], obj);
}


export function setNestedField(obj: any, fields: any[], value: any) {
  let i;
  for (i = 0; i < fields.length - 1; i++) {
    if (!obj[fields[i]]) obj[fields[i]] = {};
    obj = obj[fields[i]];
  }
  obj[fields[i]] = value;
}


export const EditExampleContext = React.createContext<{
    example: any,
    namespaces: string[],
    selectedNamespace: string | undefined,
    setSelectedNamespace: (namespace: string) => void,
    getExampleField: (path: any[]) => any,
    setExampleField: (path: any[], value: any) => void,
    addExample: () => void
}>({} as any)


export const useEditExample = () => {
    return React.useContext(EditExampleContext)
}


export const EditExampleProvider = ({ children, example }: { children: any; example: any; }) => {

  const [localExample, setLocalExample] = React.useState(example);

  const { 
      data,
      error,
      addExample,
  } = useAddExampleService();

  const {
    namespaces,
    selectedNamespace,
    setSelectedNamespace,
  } = useRagNamespaceList();

  const setExampleField = (path: any[], value: any) => {
    setLocalExample((prev: any) => {
      const newExample = { ...prev };
      setNestedField(newExample, path, value);
      return newExample;
    });
  };

  return (
    <EditExampleContext.Provider value={{
        example: localExample,
        getExampleField: (path: any[]) => getNestedField(localExample, path),
        setExampleField,      
        addExample: () => {
          if (!selectedNamespace) {
            return
          }
          addExample(localExample.input, localExample.output, selectedNamespace);
        },
        namespaces,
        selectedNamespace,
        setSelectedNamespace,
    }}>
      {children}
    </EditExampleContext.Provider>
  );
};
