import { jsx as _jsx } from "react/jsx-runtime";
import { UserChunk } from "./UserChunk";
export const UserSent = ({ sent }) => {
    return (_jsx("p", { className: "whitespace-pre-wrap", children: sent.children?.map((chunk, i) => (_jsx(UserChunk, { chunk: chunk }, i))) }));
};
//# sourceMappingURL=UserSent.js.map