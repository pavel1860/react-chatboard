import React, { ReactNode } from 'react';
import clsx from 'clsx';

// SplitLayout: wraps two panes side by side
export interface SplitLayoutProps {
    children: [ReactNode, ReactNode];
    // ratio for left pane: 0..1
    leftRatio?: number;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({ children, leftRatio = 0.5 }) => {
    const [left, right] = children;
    const rightRatio = 1 - leftRatio;

    return (
        <div className="h-screen flex bg-gray-50">
            <div
                className="flex-shrink-0 flex-grow overflow-hidden"
                style={{ flexBasis: `${leftRatio * 100}%` }}
            >
                {left}
            </div>
            <div
                className="flex-shrink-0 flex-grow overflow-hidden border-l border-gray-200"
                style={{ flexBasis: `${rightRatio * 100}%` }}
            >
                {right}
            </div>
        </div>
    );
};

// Layout: vertical layout with header and content
export interface LayoutProps {
    children: ReactNode;
}
export const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div className="flex flex-col h-full">
        {children}
    </div>
);

// LayoutHeader: top bar
export interface LayoutHeaderProps {
    children?: ReactNode;
}
export const LayoutHeader: React.FC<LayoutHeaderProps> = ({ children }) => (
    <header className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        {children}
    </header>
);

// LayoutContent: growable scrollable area
export interface LayoutContentProps {
    children?: ReactNode;
}
export const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => (
    <main className="flex-grow overflow-auto p-4 bg-white">
        {children}
    </main>
);

// Example usage in ConversationPage.jsx:
// export default function ConversationPage() {
//   const { artifactView, setArtifactView } = useStore();
//
//   return (
//     <SplitLayout leftRatio={artifactView ? 0.5 : 1}>
//       <Layout>
//         <LayoutHeader>
//           {/* Chat header controls, toggles... */}
//         </LayoutHeader>
//         <LayoutContent>
//           <ChatView />
//         </LayoutContent>
//       </Layout>
//
//       <Layout>
//         <LayoutHeader>
//           {/* Artifact header */}
//         </LayoutHeader>
//         <LayoutContent>
//           {artifactView === 'buy-marketplace' && <BuyPropertiesView />}
//           {artifactView === 'buy-property' && <Property />}
//         </LayoutContent>
//       </Layout>
//     </SplitLayout>
//   );
// }
