import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
// import {
//     List,    
//     ListItem,
//     ListItemPrefix,
// } from "@material-tailwind/react";
// lexical
import { $getSelection, $isRangeSelection, $createParagraphNode, } from "lexical";
import { REMOVE_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, } from "@lexical/list";
import { $createQuoteNode, $createHeadingNode, } from "@lexical/rich-text";
import { $createCodeNode, } from "@lexical/code";
import { $wrapNodes } from "@lexical/selection";
const List = ({ children, className, ref }) => {
    return createPortal(_jsx(List, { className: className, ref: ref, children: children }), document.body);
};
const ListItem = ({ children, className, onClick, selected }) => {
    return (_jsx(ListItem, { className: className, onClick: onClick, selected: selected, children: children }));
};
const ListItemPrefix = ({ children }) => {
    return (_jsx(ListItemPrefix, { children: children }));
};
export function BlockOptionsDropdownList({ editor, blockType, toolbarRef, setShowBlockOptionsDropDown, }) {
    const dropDownRef = useRef(null);
    useEffect(() => {
        const toolbar = toolbarRef.current;
        const dropDown = dropDownRef.current;
        if (toolbar !== null && dropDown !== null) {
            const { top, left } = toolbar.getBoundingClientRect();
            //@ts-ignore
            dropDown.style.top = `${top + 40}px`;
            //@ts-ignore
            dropDown.style.left = `${left}px`;
        }
    }, [dropDownRef, toolbarRef]);
    useEffect(() => {
        const dropDown = dropDownRef.current;
        const toolbar = toolbarRef.current;
        if (dropDown !== null && toolbar !== null) {
            const handle = (event) => {
                const target = event.target;
                //@ts-ignore
                if (!dropDown.contains(target) && !toolbar.contains(target)) {
                    setShowBlockOptionsDropDown(false);
                }
            };
            document.addEventListener("click", handle);
            return () => {
                document.removeEventListener("click", handle);
            };
        }
    }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);
    const formatParagraph = () => {
        if (blockType !== "paragraph") {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createParagraphNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };
    const formatLargeHeading = () => {
        if (blockType !== "h1") {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode("h1"));
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };
    const formatSmallHeading = () => {
        if (blockType !== "h2") {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode("h2"));
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };
    const formatBulletList = () => {
        if (blockType !== "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        }
        else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
        setShowBlockOptionsDropDown(false);
    };
    const formatNumberedList = () => {
        if (blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        }
        else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
        setShowBlockOptionsDropDown(false);
    };
    const formatQuote = () => {
        if (blockType !== "quote") {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createQuoteNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };
    const formatCode = () => {
        if (blockType !== "code") {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createCodeNode());
                }
            });
        }
        setShowBlockOptionsDropDown(false);
    };
    return (_jsxs(List, { className: "absolute z-[5] flex flex-col gap-0.5 rounded-lg border border-blue-gray-50 bg-white p-1", ref: dropDownRef, children: [_jsxs(ListItem, { selected: blockType === "paragraph", className: "rounded-md py-2", onClick: formatParagraph, children: [_jsx(ListItemPrefix, { children: _jsxs("svg", { strokeWidth: "1.5", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", color: "currentColor", className: "h-5 w-5", children: [_jsx("path", { d: "M19 7V5L5 5V7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M12 5L12 19M12 19H10M12 19H14", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), "Normal"] }), _jsxs(ListItem, { selected: blockType === "h1", className: "rounded-md py-2", onClick: formatLargeHeading, children: [_jsx(ListItemPrefix, { children: _jsxs("svg", { strokeWidth: "1.5", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", color: "currentColor", className: "h-5 w-5", children: [_jsx("path", { d: "M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M7 9V7L17 7V9", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M12 7V17M12 17H10M12 17H14", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), "Large Heading"] }), _jsxs(ListItem, { selected: blockType === "h2", className: "rounded-md py-2", onClick: formatSmallHeading, children: [_jsx(ListItemPrefix, { children: _jsxs("svg", { viewBox: "0 0 24 24", strokeWidth: "1.5", fill: "none", xmlns: "http://www.w3.org/2000/svg", color: "currentColor", className: "h-5 w-5", children: [_jsx("path", { d: "M3 7L3 5L17 5V7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M10 5L10 19M10 19H12M10 19H8", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M13 14L13 12H21V14", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M17 12V19M17 19H15.5M17 19H18.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), "Small Heading"] }), _jsxs(ListItem, { selected: blockType === "ul", className: "rounded-md py-2", onClick: formatBulletList, children: [_jsx(ListItemPrefix, { children: _jsxs("svg", { strokeWidth: "1.5", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", color: "currentColor", className: "h-5 w-5", children: [_jsx("path", { d: "M8 6L20 6", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M4 6.01L4.01 5.99889", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M4 12.01L4.01 11.9989", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M4 18.01L4.01 17.9989", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M8 12L20 12", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M8 18L20 18", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), "Bullet List"] }), _jsxs(ListItem, { selected: blockType === "ol", className: "rounded-md py-2", onClick: formatNumberedList, children: [_jsx(ListItemPrefix, { children: _jsxs("svg", { viewBox: "0 0 24 24", strokeWidth: "1.5", fill: "none", xmlns: "http://www.w3.org/2000/svg", color: "currentColor", className: "h-5 w-5", children: [_jsx("path", { d: "M9 5L21 5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M5 7L5 3L3.5 4.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M5.5 14L3.5 14L5.40471 11.0371C5.46692 10.9403 5.50215 10.8268 5.47709 10.7145C5.41935 10.4557 5.216 10 4.5 10C3.50001 10 3.5 10.8889 3.5 10.8889C3.5 10.8889 3.5 10.8889 3.5 10.8889L3.5 11.1111", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M4 19L4.5 19C5.05228 19 5.5 19.4477 5.5 20V20C5.5 20.5523 5.05228 21 4.5 21L3.5 21", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M3.5 17L5.5 17L4 19", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M9 12L21 12", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M9 19L21 19", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), "Numbered List"] }), _jsxs(ListItem, { selected: blockType === "quote", className: "rounded-md py-2", onClick: formatQuote, children: [_jsx(ListItemPrefix, { children: _jsxs("svg", { className: "h-5 w-5", strokeWidth: "1.5", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", color: "currentColor", children: [_jsx("path", { d: "M10 12H5C4.44772 12 4 11.5523 4 11V7.5C4 6.94772 4.44772 6.5 5 6.5H9C9.55228 6.5 10 6.94772 10 7.5V12ZM10 12C10 14.5 9 16 6 17.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }), _jsx("path", { d: "M20 12H15C14.4477 12 14 11.5523 14 11V7.5C14 6.94772 14.4477 6.5 15 6.5H19C19.5523 6.5 20 6.94772 20 7.5V12ZM20 12C20 14.5 19 16 16 17.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })] }) }), "Quote"] }), _jsxs(ListItem, { selected: blockType === "code", className: "rounded-md py-2", onClick: formatCode, children: [_jsx(ListItemPrefix, { children: _jsxs("svg", { strokeWidth: "1.5", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", color: "currentColor", className: "h-5 w-5", children: [_jsx("path", { d: "M13.5 6L10 18.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M6.5 8.5L3 12L6.5 15.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M17.5 8.5L21 12L17.5 15.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), "Code"] })] }));
}
//# sourceMappingURL=dropdown-list.js.map