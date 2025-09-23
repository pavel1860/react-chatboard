import React, { ReactNode } from 'react';
export interface SplitLayoutProps {
    children: [ReactNode, ReactNode];
    leftRatio?: number;
}
export declare const SplitLayout: React.FC<SplitLayoutProps>;
export declare const MultiSplitLayout: React.FC<SplitLayoutProps>;
export interface LayoutProps {
    children: ReactNode;
    className?: string;
    selectedKey?: string;
    isVisible?: boolean;
    name?: string;
}
export declare const LayoutPane: React.FC<LayoutProps>;
export interface LayoutHeaderProps {
    children?: ReactNode;
}
export declare const LayoutHeader: React.FC<LayoutHeaderProps>;
export interface LayoutContentProps {
    children?: ReactNode;
    className?: string;
    paneKey?: string;
    loading?: boolean;
    loadingComponent?: ReactNode;
}
export declare const LayoutContent: React.FC<LayoutContentProps>;
//# sourceMappingURL=layout-legacy.d.ts.map