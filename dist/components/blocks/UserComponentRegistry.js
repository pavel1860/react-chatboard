import { jsx as _jsx } from "react/jsx-runtime";
// UserComponentRegistry.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { BasicBlock, BasicSpan } from "./defaultComponents";
const parseRegistry = (props) => {
    // Helper to merge partial config with defaults
    const mergeBlockConfig = (config) => {
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
    const mergeSpanConfig = (config) => {
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
    const blockRegistry = {};
    for (const [key, value] of Object.entries(props.block)) {
        blockRegistry[key] = mergeBlockConfig(value);
    }
    // Parse span registry
    const spanRegistry = {};
    for (const [key, value] of Object.entries(props.span)) {
        spanRegistry[key] = mergeSpanConfig(value);
    }
    return {
        block: blockRegistry,
        span: spanRegistry
    };
};
const RegistryContext = createContext({
    plainMode: false,
    setPlainMode: () => { },
    registry: {
        span: {},
        block: {},
    },
    debugOutlines: false,
    setDebugOutlines: () => { },
    getComponent: () => ({
        component: () => null,
        isHidden: true,
        isWrapper: false
    }),
});
export function UserComponentProvider({ registry: registryProps, children, debugOutlines: debugOutlinesProps = false, }) {
    // const registry = parseRegistry(registryProps);
    const [registry, setRegistry] = useState(parseRegistry(registryProps));
    const [plainMode, setPlainMode] = useState(false);
    const [debugOutlines, setDebugOutlines] = useState(debugOutlinesProps);
    const _getFirstTag = (tags, type) => {
        for (const tag of tags) {
            let conf = registry[type][tag];
            if (conf) {
                return conf;
            }
        }
        return registry[type]["default"];
    };
    const getComponent = (tags, type) => {
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
    };
    return (_jsx(RegistryContext.Provider, { value: {
            plainMode,
            setPlainMode,
            registry,
            debugOutlines,
            setDebugOutlines,
            getComponent,
        }, children: children }));
}
export function useComponentRegistry() {
    return useContext(RegistryContext);
}
export function useComponentConfig(tags, type) {
    const { registry, plainMode, getComponent, debugOutlines, setDebugOutlines } = useComponentRegistry();
    useEffect(() => {
    }, [plainMode, debugOutlines]);
    return getComponent(tags, type);
}
//# sourceMappingURL=UserComponentRegistry.js.map