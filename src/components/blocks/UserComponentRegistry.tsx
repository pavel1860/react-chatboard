// UserComponentRegistry.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { BlockType, BlockSentType, BlockChunkType, SpanType } from "../chat/schema";
import { BasicBlock, BasicSpan } from "./defaultComponents";

type BlockRendererFn = (block: BlockType | BlockSentType | BlockChunkType) => React.ReactNode;
type SpanRendererFn = (span: SpanType) => React.ReactNode;
// type Registry = Record<string, RendererFn>;


export type BlockConfig = {
  component: BlockRendererFn;
  isHidden: boolean | null;
  isWrapper: boolean;
}


export type SpanConfig = {
  component: SpanRendererFn;
  isHidden: boolean | null;
  isWrapper: boolean;
}




export type RegistryProps = {
  span: Record<string, Partial<SpanConfig> | SpanRendererFn | null>;
  block: Record<string, Partial<BlockConfig> | BlockRendererFn | null>;
};


export type Registry = {
  span: Record<string, SpanConfig >;
  block: Record<string, BlockConfig >;
};


const parseRegistry = (props: RegistryProps): Registry => {
  // Helper to merge partial config with defaults
  const mergeBlockConfig = (config: Partial<BlockConfig> | BlockRendererFn | null): BlockConfig => {
    if (!config) {
      return {
        component: () => null,
        isHidden: true,
        isWrapper: false
      };
    }


    if (typeof config === 'function') {
      return {
        component: config,
        isHidden: false,
        isWrapper: false
      };
    }

    return {
      component: config.component || (() => null),
      isHidden: config.isHidden ?? false,
      isWrapper: config.isWrapper ?? false
    };
  };

  const mergeSpanConfig = (config: Partial<SpanConfig> | SpanRendererFn | null): SpanConfig => {
    if (!config) {
      return {
        component: () => null,
        isHidden: true,
        isWrapper: false
      };
    }

    if (config === undefined) {
      return {
        component: () => null,
        isHidden: null,
        isWrapper: false
      };
    }

    if (typeof config === 'function') {
      return {
        component: config,
        isHidden: false,
        isWrapper: false
      };
    }

    return {
      component: config.component || (() => null),
      isHidden: config.isHidden ?? false,
      isWrapper: config.isWrapper ?? false
    };
  };

  // Parse block registry
  const blockRegistry: Record<string, BlockConfig> = {};
  for (const [key, value] of Object.entries(props.block)) {
    blockRegistry[key] = mergeBlockConfig(value);
  }

  // Parse span registry
  const spanRegistry: Record<string, SpanConfig> = {};
  for (const [key, value] of Object.entries(props.span)) {
    spanRegistry[key] = mergeSpanConfig(value);
  }

  return {
    block: blockRegistry,
    span: spanRegistry
  };
};



export interface ComponentProviderProps {
  plainMode: boolean;
  setPlainMode: (plainMode: boolean) => void;
  
  registry: Registry;
  debugOutlines?: boolean;
  setDebugOutlines: (debugOutlines: boolean) => void;
  getComponent: (tags: string[], type: "block" | "span") => BlockConfig | SpanConfig;
}


const RegistryContext = createContext<ComponentProviderProps>({
  plainMode: false,
  setPlainMode: () => {},
  registry: {
    span: {},
    block: {},
    },
  debugOutlines: false,
  setDebugOutlines: () => {},
  getComponent: () => ({
    component: () => null,
    isHidden: true,
    isWrapper: false
  }),
});

export function UserComponentProvider({
  registry: registryProps,
  children,
  debugOutlines: debugOutlinesProps = false,
}: {
  registry: RegistryProps;
  children: React.ReactNode;
  debugOutlines?: boolean;
}) {

  // const registry = parseRegistry(registryProps);
  const [registry, setRegistry] = useState<Registry>(parseRegistry(registryProps));
  const [plainMode, setPlainMode] = useState(false);
  const [debugOutlines, setDebugOutlines] = useState(debugOutlinesProps);

  const _getFirstTag = (tags: string[], type: "block" | "span") => {
    for (const tag of tags) {
      let conf = registry[type][tag];
      if (conf) {
        return conf;
      }
    }
    return registry[type]["default"];
  }

  
  const getComponent = (tags: string[], type: "block" | "span") => {
    
    // let conf = registry[type][tags.at(-1)];    
    // if (!conf) {
    //   conf = registry[type]["default"];
    // }
    let conf = _getFirstTag(tags, type);
    if (plainMode) {
      return {
        ...conf,
        component: type === "block" ? BasicBlock : BasicSpan,
      };
    }
    return conf;
  }

  return (
    <RegistryContext.Provider value={{
      plainMode,
      setPlainMode,
      registry, 
      debugOutlines,
      setDebugOutlines,
      getComponent,
      
    }}>
      {children}
    </RegistryContext.Provider>
  );
}

export function useComponentRegistry() {
  return useContext(RegistryContext);
}






export function useComponentConfig(tags: string[], type: "block" | "span") {
  const { registry, plainMode, getComponent, debugOutlines, setDebugOutlines } = useComponentRegistry();

  useEffect(() => {
    
  }, [plainMode, debugOutlines]);

 
  return getComponent(tags, type)
}