import { ReactNode } from "react";
import { RegistryProps, UserComponentProvider } from "../components/blocks/UserComponentRegistry"
import { ChatProvider } from "./chat-provider"
import { CtxProvider } from "./ctx-provider"
import Layout from "../components/layout/Layout";



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
}



export const ChatboardProvider = ({Component, children, registry, extra}: ChatboardProviderProps) => {
    return (
        <CtxProvider>
            <ChatProvider>
                <UserComponentProvider registry={registry} >
                    <Layout
                        extra={extra}
                        header={Component.header}
                        layoutProps={Component.layoutProps}
                        >
                        {children}
                    </Layout>
                </UserComponentProvider>
            </ChatProvider>
        </CtxProvider>
    )
}