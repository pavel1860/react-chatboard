export interface EditorValue {
    text: string;
}
export declare const LowPriority = 1;
export declare const supportedBlockTypes: Set<string>;
export declare const blockTypeToBlockName: {
    code: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    ol: string;
    paragraph: string;
    quote: string;
    ul: string;
};
export declare function Divider(): import("react/jsx-runtime").JSX.Element;
export declare function Placeholder({ text, offset }: {
    text?: string;
    offset?: number;
}): import("react/jsx-runtime").JSX.Element;
export declare function Select({ onChange, className, options, value }: any): import("react/jsx-runtime").JSX.Element;
export declare function getSelectedNode(selection: any): any;
export declare function positionEditorElement(editor: any, rect: any): void;
//# sourceMappingURL=util.d.ts.map