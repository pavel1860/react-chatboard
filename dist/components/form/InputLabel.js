import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const InputLabel = ({ fieldName, label, icon, labelWidth }) => {
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-5", children: icon }), label && (_jsx("label", { htmlFor: fieldName, className: "whitespace-nowrap block z-10 subpixel-antialiased text-small pointer-events-none relative text-foreground will-change-auto origin-top-left rtl:origin-top-right !duration-200 !ease-out transition-[transform,color,left,opacity] motion-reduce:transition-none ps-2 pe-2", style: { width: labelWidth || "150px" }, children: label }))] }));
};
export default InputLabel;
//# sourceMappingURL=InputLabel.js.map