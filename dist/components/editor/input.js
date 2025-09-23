import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Button, ButtonGroup, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Textarea } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { Bot, ChevronDown, User } from "lucide-react";
import { useIsLargeScreen, useWindowSize } from "../layout/screenUtils";
import { useChatInputHistory } from "../../hooks/useChatInputHistory";
export function ChatInput({ placeholder, onSubmit, dontClear, bgColor, borderColor = "#E0E0E0", rows = 3, minRows = 1, maxRows = 10, width = "full", maxWidth = "4xl", showRole = false, defaultRole = "user", isUserDanger = false, loading = false, textSize = "md", historyLength = 10, saveHistory = true, }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [role, setRole] = useState(defaultRole);
    const color = role === "user" && isUserDanger ? "danger" : "primary";
    const ref = useRef(null);
    const { value, setValue, handleKeyDown, addToHistory, clearHistory, } = useChatInputHistory({ maxLength: historyLength });
    const handleEnter = () => {
        if (!value.trim())
            return;
        setIsSubmitting(true);
        onSubmit(value, role);
        if (saveHistory) {
            addToHistory(value);
        }
        if (!dontClear) {
            setValue("");
        }
        setTimeout(() => {
            setIsSubmitting(false);
        }, 600);
    };
    const isLargeScreen = useIsLargeScreen();
    const { updateSize } = useWindowSize();
    return (_jsx(Textarea, { ref: ref, value: value, onChange: (e) => setValue(e.target.value), onFocus: () => {
            updateSize();
        }, onBlur: () => {
            updateSize();
        }, classNames: {
            "base": cn(`w-${width}`, maxWidth && `max-w-${maxWidth}`),
            "inputWrapper": cn("border-1 border-gray-200 bg-[#F4F4F5] px-4 py-2 focus-within:border-gray-300 pr-0"),
            "input": cn("text-gray-900", `text-${textSize}`)
        }, placeholder: placeholder, rows: rows, minRows: minRows, maxRows: maxRows, onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleEnter();
            }
            else {
                if (saveHistory) {
                    handleKeyDown(e);
                }
            }
        }, endContent: _jsx("div", { className: "h-full flex flex-col justify-end px-2", children: _jsxs(ButtonGroup, { className: "", children: [_jsxs(Button, { color: color, isDisabled: isSubmitting || loading, isIconOnly: !showRole, onPress: handleEnter, isLoading: isSubmitting || loading, children: [_jsx(Icon, { icon: "solar:plain-linear", width: 20, height: 20, className: "text-white" }), showRole && role] }), showRole && _jsxs(Dropdown, { children: [_jsx(DropdownTrigger, { children: _jsx(Button, { className: "p-0", color: color, isDisabled: isSubmitting, isIconOnly: true, onPress: handleEnter, isLoading: isSubmitting, endContent: _jsx(ChevronDown, {}) }) }), _jsxs(DropdownMenu, { "aria-label": "Dropdown menu with icons", variant: "faded", children: [_jsx(DropdownItem, { onPress: () => setRole("user"), startContent: _jsx(User, {}), children: "User" }, "user"), _jsx(DropdownItem, { onPress: () => setRole("assistant"), startContent: _jsx(Bot, {}), children: "Agent" }, "assistant")] })] })] }) }) }));
}
//# sourceMappingURL=input.js.map