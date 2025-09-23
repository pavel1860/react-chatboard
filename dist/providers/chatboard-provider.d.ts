import { ReactNode } from "react";
import { RegistryProps } from "../components/blocks/UserComponentRegistry";
interface ChatboardProviderProps {
    Component: React.ComponentType<any> & {
        header?: ReactNode;
        layoutProps?: {
            hideFooter?: boolean;
            noneArtifact?: boolean;
        };
    };
    registry: RegistryProps;
    children: React.ReactNode;
    extra?: ReactNode;
    session: any;
}
export declare const ChatboardProvider: ({ Component, children, registry, extra, session }: ChatboardProviderProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=chatboard-provider.d.ts.map