import { EditorConfig, LexicalNode, NodeKey, TextNode } from 'lexical';
export declare class AgentActionNode extends TextNode {
    __action: string;
    constructor(text: string, key?: NodeKey);
    static getType(): string;
    static clone(node: AgentActionNode): AgentActionNode;
    getAction(): string;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: AgentActionNode, dom: HTMLElement, config: EditorConfig): boolean;
    exportJSON(): {
        __action: string;
        type: string;
        version: number;
        $?: Record<string, unknown> | undefined;
        detail: number;
        format: number;
        mode: import("lexical").TextModeType;
        style: string;
        text: string;
    };
}
export declare function $createAgentActionNode(text: string): AgentActionNode;
export declare function $isAgentActionNode(node: LexicalNode | null | undefined): node is AgentActionNode;
//# sourceMappingURL=AgentActionNode.d.ts.map