import { ReactNode } from "react";
type VisibilityCtx = {
    visible: Set<string>;
    show: (tag: string) => void;
    hide: (tag: string) => void;
    isVisible: (tags?: string[]) => boolean;
    setVisibleTags: (tags: string[]) => void;
};
export declare function UserVisibilityProvider({ children, defaultVisibleTags, showAll, }: {
    children: ReactNode;
    defaultVisibleTags?: string[];
    showAll?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function useVisibility(): VisibilityCtx;
export {};
//# sourceMappingURL=UserVisibilityContext.d.ts.map