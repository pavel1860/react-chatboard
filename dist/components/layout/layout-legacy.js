import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import React from 'react';
import { cn } from '@heroui/react';
export const SplitLayout = ({ children, leftRatio = 0.5 }) => {
    const panes = React.Children.toArray(children);
    const visiblePanes = panes.filter(pane => {
        if (!pane)
            return false;
        if (React.isValidElement(pane) && pane.props.isVisible === false)
            return false;
        return true;
    });
    console.log("#####@###", visiblePanes.length);
    if (visiblePanes.length === 1) {
        return (_jsx("div", { className: "h-screen flex bg-gray-50", children: _jsx("div", { className: "flex-shrink-0 flex-grow overflow-hidden", style: { flexBasis: '100%' }, children: visiblePanes[0] }) }));
    }
    const [leftPane, rightPane] = visiblePanes;
    const rightRatio = 1 - leftRatio;
    return (_jsxs("div", { className: "h-screen flex bg-gray-50", children: [_jsx("div", { className: cn("flex-shrink-0 flex-grow overflow-hidden", `w-[${leftRatio * 100}%] max-w-[${leftRatio * 100}%]`), style: { width: `${leftRatio * 100}%` }, children: leftPane }), _jsx("div", { className: "flex-shrink-0 flex-grow overflow-hidden border-l border-gray-200", style: { width: `${rightRatio * 100}%` }, children: rightPane })] }));
};
export const MultiSplitLayout = ({ children, leftRatio = 0.5 }) => {
    const panes = React.Children.toArray(children);
    const visiblePanes = panes.filter(pane => {
        if (!pane)
            return false;
        if (React.isValidElement(pane) && pane.props.isVisible === false)
            return false;
        return true;
    });
    const rightRatio = 1 - leftRatio;
    return (_jsx("div", { className: "h-screen flex bg-gray-50", children: visiblePanes.map(pane => {
            console.log(">>>>>>>>>", `flexBasis:${leftRatio * 100}%`);
            return (_jsx("div", { className: "flex-shrink-0 flex-grow overflow-hidden", style: { flexBasis: `${leftRatio * 100}%` }, children: pane }));
        }) }));
};
export const LayoutPane = ({ children, selectedKey, isVisible = true, className, name }) => {
    if (!isVisible)
        return null;
    const elems = React.Children.toArray(children);
    const header = elems.find(el => el.type === LayoutHeader);
    let contentToShow = null;
    if (selectedKey) {
        contentToShow = elems.filter(el => {
            const isLayoutContent = el.type.displayName === 'LayoutContent';
            return !isLayoutContent || (el.key === `.\$${selectedKey}`);
        });
    }
    else {
        contentToShow = elems.filter(el => el.type != LayoutContent);
    }
    return (_jsxs("div", { className: cn("flex flex-col h-full items-center", className), children: [header, contentToShow] }));
};
export const LayoutHeader = ({ children }) => (_jsx("header", { className: "flex-shrink-0 p-4 border-b border-gray-200 bg-white flex flex-row gap-2 items-center", children: children }));
export const LayoutContent = ({ children, loading, loadingComponent, className }) => (
// <main className={cn("items-center flex-grow overflow-auto p-4 bg-white layout-content", className)}>
_jsx("section", { className: "overflow-auto p-4 bg-white", children: children }));
// Ensure LayoutContent has a displayName
LayoutContent.displayName = 'LayoutContent';
//# sourceMappingURL=layout-legacy.js.map