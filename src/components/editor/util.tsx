// @ts-nocheck
import { $wrapNodes, $isAtNodeEnd } from "@lexical/selection";



export interface EditorValue {
    text: string;
}


export const LowPriority = 1;

export const supportedBlockTypes = new Set([
    "paragraph",
    "quote",
    "code",
    "h1",
    "h2",
    "ul",
    "ol",
]);

export const blockTypeToBlockName = {
    code: "Code",
    h1: "Large Heading",
    h2: "Small Heading",
    h3: "Heading",
    h4: "Heading",
    h5: "Heading",
    ol: "Numbered List",
    paragraph: "Normal",
    quote: "Quote",
    ul: "Bulleted List",
};


export function Divider() {
    return <div className="mx-1 h-6 w-px bg-gray-400" />;
}

export function Placeholder({text, offset} : {text?: string, offset?: number}) {

    const top = offset ? `top-${offset}` : "top-2";

    return (
        <div 
            // className="pointer-events-none absolute left-2.5 top-2 inline-block select-none overflow-hidden text-base font-normal text-gray-400"
            className={`pointer-events-none absolute left-2.5 ${top} inline-block select-none overflow-hidden text-base font-normal text-gray-400`}
            >
            {text || "Write somthing..."}
        </div>
    );
}

export function Select({ onChange, className, options, value }: any) {
    return (
        <select className={className} onChange={onChange} value={value}>
            <option hidden={true} value="" />
            {options.map((option: any) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export function getSelectedNode(selection: any) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
        return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
        return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
}



export function positionEditorElement(editor: any, rect: any) {
    if (rect === null) {
        editor.style.opacity = "0";
        editor.style.top = "-1000px";
        editor.style.left = "-1000px";
    } else {
        editor.style.opacity = "1";
        editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
        editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
            }px`;
    }
}

