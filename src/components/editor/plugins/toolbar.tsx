// @ts-nocheck
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {    
//     Button,
//     IconButton,    
// } from "@material-tailwind/react";

// lexical
import {
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
    $isListNode,
} from "@lexical/list";
import {
    $isHeadingNode,
} from "@lexical/rich-text";
import {
    $isCodeNode,
    getCodeLanguages,
    getDefaultCodeLanguage,
} from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import {
    AutoLinkNode,
    LinkNode,
    $isLinkNode,
    TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { blockTypeToBlockName, Divider, getSelectedNode, LowPriority, Select, supportedBlockTypes } from "../util";
import { BlockOptionsDropdownList } from "./dropdown-list";
import { FloatingLinkEditor } from "./floating-link";



export const Button = ({ children, ...props }: any) => {
    return <button {...props}>{children}</button>;
}

export const IconButton = ({ children, ...props }: any) => {
    return <button {...props}>{children}</button>;
}


export function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [blockType, setBlockType] = useState("paragraph");
    const [selectedElementKey, setSelectedElementKey] = useState(null);
    const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
        useState(false);
    const [codeLanguage, setCodeLanguage] = useState("");
    const [isLink, setIsLink] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            if (elementDOM !== null) {
                //@ts-ignore
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList ? parentList.getTag() : element.getTag();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();
                    setBlockType(type);
                    if ($isCodeNode(element)) {
                        setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
                    }
                }
            }
            // Update text format
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
            setIsCode(selection.hasFormat("code"));

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar();
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, updateToolbar]);

    const codeLanguges = useMemo(() => getCodeLanguages(), []);
    const onCodeLanguageSelect = useCallback(
        (e: any) => {
            editor.update(() => {
                if (selectedElementKey !== null) {
                    const node = $getNodeByKey(selectedElementKey);
                    if ($isCodeNode(node)) {
                        node.setLanguage(e.target.value);
                    }
                }
            });
        },
        [editor, selectedElementKey],
    );

    const insertLink = useCallback(() => {
        if (!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    return (
        <div
            className="m-1 flex items-center gap-0.5 rounded-lg bg-gray-100 p-1"
            ref={toolbarRef}
        >
            {supportedBlockTypes.has(blockType) && (
                <>
                    <Button
                        variant="text"
                        onClick={() =>
                            setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
                        }
                        className="flex items-center gap-1 font-medium capitalize"
                        aria-label="Formatting Options"
                    >
                        {/*@ts-ignore */}
                        {blockTypeToBlockName[blockType]}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button>
                    {showBlockOptionsDropDown &&
                        createPortal(
                            <BlockOptionsDropdownList
                                editor={editor}
                                blockType={blockType}
                                toolbarRef={toolbarRef}
                                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
                            />,
                            document.body,
                        )}
                    <Divider />
                </>
            )}
            {blockType === "code" ? (
                <>
                    <Select
                        className="appearance-none rounded-md bg-transparent px-2 py-1 outline-none hover:bg-gray-900/10"
                        onChange={onCodeLanguageSelect}
                        options={codeLanguges}
                        value={codeLanguage}
                    />
                </>
            ) : (
                <>
                    <IconButton
                        variant={isBold ? "filled" : "text"}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                        }}
                        aria-label="Format Bold"
                    >
                        <svg
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                d="M12 11.6667H8M12 11.6667C12 11.6667 15.3333 11.6667 15.3333 8.33333C15.3333 5.00002 12 5 12 5C12 5 12 5 12 5H8.6C8.26863 5 8 5.26863 8 5.6V11.6667M12 11.6667C12 11.6667 16 11.6667 16 15.3333C16 19 12 19 12 19C12 19 12 19 12 19H8.6C8.26863 19 8 18.7314 8 18.4V11.6667"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            ></path>
                        </svg>
                    </IconButton>
                    <IconButton
                        variant={isItalic ? "filled" : "text"}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                        }}
                        aria-label="Format Italics"
                    >
                        <svg
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                d="M11 5L14 5M17 5L14 5M14 5L10 19M10 19L7 19M10 19L13 19"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    </IconButton>
                    <IconButton
                        variant={isCode ? "filled" : "text"}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                        }}
                        aria-label="Insert Code"
                    >
                        <svg
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                d="M13.5 6L10 18.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M6.5 8.5L3 12L6.5 15.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M17.5 8.5L21 12L17.5 15.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    </IconButton>
                    <IconButton
                        onClick={insertLink}
                        variant={isLink ? "filled" : "text"}
                        aria-label="Insert Link"
                    >
                        <svg
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                d="M14 11.9976C14 9.5059 11.683 7 8.85714 7C8.52241 7 7.41904 7.00001 7.14286 7.00001C4.30254 7.00001 2 9.23752 2 11.9976C2 14.376 3.70973 16.3664 6 16.8714C6.36756 16.9525 6.75006 16.9952 7.14286 16.9952"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M10 11.9976C10 14.4893 12.317 16.9952 15.1429 16.9952C15.4776 16.9952 16.581 16.9952 16.8571 16.9952C19.6975 16.9952 22 14.7577 22 11.9976C22 9.6192 20.2903 7.62884 18 7.12383C17.6324 7.04278 17.2499 6.99999 16.8571 6.99999"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    </IconButton>
                    {isLink &&
                        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
                </>
            )}
        </div>
    );
}
