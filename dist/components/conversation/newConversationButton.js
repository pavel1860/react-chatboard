import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
export default function NewConversationButton({ onPress, isMutating, isDisabled = false }) {
    const [isHovered, setIsHovered] = useState(false);
    return (_jsx(_Fragment, { children: _jsx(Button, { isDisabled: isDisabled, onPress: onPress, onMouseEnter: () => {
                setIsHovered(true);
            }, onMouseLeave: () => {
                setIsHovered(false);
            }, isLoading: isMutating, variant: "light", size: "md", radius: "lg", className: "pl-0", startContent: _jsx("div", { className: `w-[40px] h-[40px] rounded-xl flex items-center justify-center ${isHovered ? "bg-transparent" : "bg-[#D4D4D8]"} transition-all duration-300`, children: _jsx(Icon, { icon: "solar:pen-new-square-linear", width: 24, height: 24, className: "text-white" }) }), children: _jsx("span", { className: "font-typography-base-primary font-semibold text-base leading-6 text-[#18181B] pl-2", children: "New chat" }) }) }));
}
//# sourceMappingURL=newConversationButton.js.map