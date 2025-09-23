import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Card, CardBody } from "@heroui/react";
import MarkdownEditor from "../../components/promptEditor/editors/markdownEditor";
import { StreamingContent } from "./streamingContent";
export const Message = ({ message, index, showChoices = false, onChoice, avatar, isStreaming, }) => {
    return (_jsxs("div", { className: "ml-4", children: [avatar && message.role === "assistant" && (_jsx("div", { className: "relative top-9 -left-6", children: _jsx(Avatar, { size: "sm", src: `/images/avatars/${avatar}.png` }) })), _jsx(Card, { shadow: "none", className: `py-0 ${message.role === "assistant"
                    ? "bg-transparent"
                    : "bg-default-200 mr-3 w-max min-w-20 ml-auto"}`, children: _jsx(CardBody, { className: "py-0", children: _jsx("div", { className: "whitespace-pre-wrap break-words", children: isStreaming ? _jsx(StreamingContent, {}) :
                            _jsx(MarkdownEditor, { text: message.content, onChange: () => { }, notEditable: true }) }) }) })] }));
};
//# sourceMappingURL=message.js.map