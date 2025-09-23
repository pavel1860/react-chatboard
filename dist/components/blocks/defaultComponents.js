import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// defaultComponents.tsx
import { useChat } from "../../providers/chat-provider";
// Minimal components
export const DefaultText = (chunk) => (_jsx("span", { className: "animate-typing whitespace-pre-wrap", children: chunk.content }));
export const DefaultSentence = (sent) => (_jsx("p", { className: "mb-2", children: sent.children?.map((c, i) => (_jsx(DefaultText, { ...c }, i))) }));
export const DefaultBlock = (block) => (_jsxs("div", { className: "p-2 border border-gray-200 rounded  shadow-sm mb-2", children: [block.root && _jsx(DefaultSentence, { ...block.root }), block.children?.map((child, i) => child.Type === "Block" ? (_jsx(DefaultBlock, { ...child }, i)) : child.Type === "BlockSent" ? (_jsx(DefaultSentence, { ...child }, i)) : null)] }));
// Example "button" component (trigger tool call)
export const DefaultButton = (block) => (_jsx("button", { className: "px-3 py-1 bg-blue-500 text-white rounded text-sm", children: block.root?.children?.map((c) => c.content).join("") }));
export const useBlock = (block) => {
    // const content = useMemo(() => {
    //   console.log("block",block.tags, block.children.length)
    //   return block.root?.children?.map((c: any, i: number) => <DefaultText key={i} {...c} />)
    // }, [block, block?.root?.children])
    const content = block.content?.children?.map((c, i) => _jsx(DefaultText, { ...c }, i));
    return {
        content
    };
};
export const BasicSpan = ({ children, span }) => {
    return (_jsx("div", { className: "", children: children }));
};
export const HiddenSpan = ({ children, span }) => {
    return (_jsx(_Fragment, { children: children }));
};
export const HiddenBlock = ({ children, block }) => {
    return (_jsx(_Fragment, { children: children }));
};
export const BasicBlock = ({ children, block }) => {
    const { content } = useBlock(block);
    return (_jsxs("div", { className: "p-2 text-black", children: [content, children] }));
};
export const AvatarSpan = ({ children, span }) => {
    return (_jsxs("div", { className: "p-2 text-black bg-gray-100 rounded-2xl mb-2", children: [_jsx("span", { className: "text-sm text-gray-500", children: span.name }), children] }));
};
export const AnswerBlock = ({ children, block }) => {
    const { content } = useBlock(block);
    return (
    // <div className="p-2 text-black rounded-2xl rounded-tr-none shadow-md mb-2 max-w-[80%] ml-auto">
    _jsx("div", { className: "p-2 text-black", children: children }));
};
export const UserMessage = ({ children, block }) => {
    const { content } = useBlock(block);
    return (_jsxs("div", { className: "p-2 bg-blue-500 text-white rounded-2xl rounded-tr-none shadow-md mb-2 max-w-[80%] ml-auto", children: [content, children] }));
};
export const AutosuggestionsBlock = ({ children, block }) => {
    const { content } = useBlock(block);
    return (_jsx("div", { className: "p-2 text-white flex rounded-2xl mb-2 ml-auto", children: children }));
};
export const SuggestionItem = ({ children, block }) => {
    const { content } = useBlock(block);
    const { sendMessage } = useChat();
    return (
    // <button className="p-2 border-2 border-purple-300 text-black hover:bg-purple-100 hover:cursor-pointer rounded-2xl shadow-md mb-2 max-w-[80%] ml-auto">
    //   {/* {content} */}
    //   {children}
    // </button>
    _jsx("button", { className: "relative overflow-hidden border-2 border-purple-300 px-4 m-1 text-white rounded-2xl\n              hover:bg-purple-200 hover:cursor-pointer active:bg-purple-300 transition-colors duration-150", onClick: () => {
            sendMessage(block);
        }, children: children }));
};
//# sourceMappingURL=defaultComponents.js.map