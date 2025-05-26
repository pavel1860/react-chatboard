import React, { ReactNode } from 'react';
import clsx from 'clsx';

// SplitLayout: wraps two panes side by side and handles hidden panes
export interface SplitLayoutProps {
    children: [ReactNode, ReactNode];
    // ratio for left pane (0..1)
    leftRatio?: number;
}
export const SplitLayout: React.FC<SplitLayoutProps> = ({ children, leftRatio = 0.5 }) => {
    const panes = React.Children.toArray(children) as React.ReactElement[];
    const visiblePanes = panes.filter(pane => {
        if (!pane) return false;
        if (React.isValidElement(pane) && pane.props.isVisible === false) return false;
        return true;
    });

    if (visiblePanes.length === 1) {
        return (
            <div className="h-screen flex bg-gray-50">
                <div className="flex-shrink-0 flex-grow overflow-hidden" style={{ flexBasis: '100%' }}>
                    {visiblePanes[0]}
                </div>
            </div>
        );
    }

    const [leftPane, rightPane] = visiblePanes;
    const rightRatio = 1 - leftRatio;
    return (
        <div className="h-screen flex bg-gray-50">
            <div className="flex-shrink-0 flex-grow overflow-hidden" style={{ flexBasis: `${leftRatio * 100}%` }}>
                {leftPane}
            </div>
            <div className="flex-shrink-0 flex-grow overflow-hidden border-l border-gray-200" style={{ flexBasis: `${rightRatio * 100}%` }}>
                {rightPane}
            </div>
        </div>
    );
};

// Layout: vertical layout with selection and visibility
export interface LayoutProps {
    children: ReactNode;
    // which pane to show
    selectedKey?: string;
    // hide entire layout
    isVisible?: boolean;
}
export const Layout: React.FC<LayoutProps> = ({ children, selectedKey, isVisible = true }) => {
    if (!isVisible) return null;

    const elems = React.Children.toArray(children) as React.ReactElement[];
    const header = elems.find(el => el.type === LayoutHeader);
    const contents = elems.filter(el => el.type === LayoutContent) as React.ReactElement<LayoutContentProps>[];

    // match by paneKey prop, fallback to element.key
    let contentToShow = contents[0];
    if (selectedKey) {
        const matched = contents.find(el => el.key === `.\$${selectedKey}`);
        if (matched) contentToShow = matched;
    }

    return (
        <div className="flex flex-col h-full">
            {header}
            {contentToShow}
        </div>
    );
};

// LayoutHeader: top bar
export interface LayoutHeaderProps { children?: ReactNode; }
export const LayoutHeader: React.FC<LayoutHeaderProps> = ({ children }) => (
    <header className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">{children}</header>
);

// LayoutContent: growable scrollable area, with paneKey to identify
export interface LayoutContentProps { children?: ReactNode; paneKey?: string; }
export const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => (
    <main className="flex-grow overflow-auto p-4 bg-white">{children}</main>
);

// Usage now requires paneKey on LayoutContent, e.g.: //
// <Layout selectedKey={view}> //
//   <LayoutHeader>…</LayoutHeader> //
//   <LayoutContent paneKey="versioning">…</LayoutContent> //
//   <LayoutContent paneKey="tracer">…</LayoutContent> //
//   <LayoutContent paneKey="artifact">…</LayoutContent> //
// </Layout>
