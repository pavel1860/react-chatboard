// @ts-nocheck
import React, { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { cn, Spinner } from '@heroui/react';

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
    console.log("#####@###", visiblePanes.length)
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
            <div 
                className={cn("flex-shrink-0 flex-grow overflow-hidden", `w-[${leftRatio * 100}%] max-w-[${leftRatio * 100}%]`)} 
                style={{ width: `${leftRatio * 100}%` }}>
                {leftPane}
            </div>
            <div 
                className="flex-shrink-0 flex-grow overflow-hidden border-l border-gray-200" 
                style={{ width: `${rightRatio * 100}%` }}
                >            
                {rightPane}
            </div>
        </div>
    );
};


export const MultiSplitLayout: React.FC<SplitLayoutProps> = ({ children, leftRatio = 0.5 }) => {
    const panes = React.Children.toArray(children) as React.ReactElement[];
    const visiblePanes = panes.filter(pane => {
        if (!pane) return false;
        if (React.isValidElement(pane) && pane.props.isVisible === false) return false;
        return true;
    });

    
    const rightRatio = 1 - leftRatio;
    return (
        <div className="h-screen flex bg-gray-50">
            {visiblePanes.map(pane => {
                
                console.log(">>>>>>>>>", `flexBasis:${leftRatio * 100}%`)
                return (
                <div className="flex-shrink-0 flex-grow overflow-hidden" style={{ flexBasis: `${leftRatio * 100}%` }}>
                {/* <div className="flex-shrink-0 flex-grow overflow-hidden" > */}
                    {pane}
                </div>
            )})}
            
        </div>
    );
};



// Layout: vertical layout with selection and visibility
export interface LayoutProps {
    children: ReactNode;
    className?: string;
    // which pane to show
    selectedKey?: string;
    // hide entire layout
    isVisible?: boolean;
    name?: string;
}
export const LayoutPane: React.FC<LayoutProps> = ({ children, selectedKey, isVisible = true, className, name }) => {
    if (!isVisible) return null;

    const elems = React.Children.toArray(children) as React.ReactElement[];
    const header = elems.find(el => el.type === LayoutHeader);
    
    let contentToShow = null;
    if (selectedKey){
        contentToShow = elems.filter(el => {
            const isLayoutContent = el.type.displayName === 'LayoutContent';    
            return !isLayoutContent || (el.key === `.\$${selectedKey}`);
        });
    } else {
        contentToShow = elems.filter(el => el.type != LayoutContent)
    }
    

    return (
        <div className={cn("flex flex-col h-full items-center", className)}>
            {header}
            {contentToShow}
        </div>
    );
};

// LayoutHeader: top bar
export interface LayoutHeaderProps { children?: ReactNode; }
export const LayoutHeader: React.FC<LayoutHeaderProps> = ({ children }) => (
    <header className="flex-shrink-0 p-4 border-b border-gray-200 bg-white flex flex-row gap-2 items-center">{children}</header>
);

// LayoutContent: growable scrollable area, with paneKey to identify
export interface LayoutContentProps { 
    children?: ReactNode; 
    className?: string;
    paneKey?: string;   
    loading?: boolean;
    loadingComponent?: ReactNode;
}
export const LayoutContent: React.FC<LayoutContentProps> = ({ children, loading, loadingComponent, className }) => (
    // <main className={cn("items-center flex-grow overflow-auto p-4 bg-white layout-content", className)}>
    <section className="overflow-auto p-4 bg-white">
        {/* {loading ? loadingComponent? loadingComponent : <Spinner /> : children} */}
        {children}
    </section>
);

// Ensure LayoutContent has a displayName
LayoutContent.displayName = 'LayoutContent';

// Usage now requires paneKey on LayoutContent, e.g.: //
// <Layout selectedKey={view}> //
//   <LayoutHeader>…</LayoutHeader> //
//   <LayoutContent paneKey="versioning">…</LayoutContent> //
//   <LayoutContent paneKey="tracer">…</LayoutContent> //
//   <LayoutContent paneKey="artifact">…</LayoutContent> //
// </Layout>
