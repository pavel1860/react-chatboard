import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from "../../store/useStore";
import { Tab, Tabs } from "@heroui/react";
import { useCtx } from "../../providers/ctx-provider";
import { useRouter } from "next/router";
import { Icon } from "@iconify-icon/react";
import { useSession } from "next-auth/react";
function getTabKeyFromPath(path) {
    if (path.includes('/tests'))
        return '/tests';
    if (path.includes('/info'))
        return '/info';
    if (path.includes('/thread'))
        return '/thread';
    if (path.includes('/versioning'))
        return '/versioning';
    if (path.includes('/tracer'))
        return '/traces';
    // Default (the base conversation page)
    return '/artifact';
}
export const AdminNavigationBar = ({ hideLabels = false, isVertical = false }) => {
    const router = useRouter();
    const { refUserId, partitionId } = useCtx();
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useStore();
    const { data: session, status } = useSession();
    // @ts-ignore
    const userId = refUserId || session?.user?.id;
    return (_jsxs(Tabs, { isVertical: isVertical, "aria-label": "Tabs", selectedKey: getTabKeyFromPath(router.pathname), color: "primary", variant: "light", isDisabled: status !== "authenticated" || !userId, onSelectionChange: () => {
            if (!isArtifactViewOpen) {
                setIsArtifactViewOpen(true);
            }
        }, children: [_jsx(Tab, { href: `/admin/user/${userId}/conversation/${partitionId}`, title: _jsxs("span", { className: "text-sm flex flex-row items-center gap-2", children: [_jsx(Icon, { icon: "mdi:home-search-outline", width: 20, height: 20 }), " ", hideLabels ? "" : "Artifact"] }) }, "/artifact"), _jsx(Tab, { href: `/admin/user/${userId}/conversation/${partitionId}/tests`, title: _jsxs("span", { className: "text-sm flex flex-row items-center gap-2", children: [_jsx(Icon, { icon: "solar:test-tube-line-duotone", width: 20, height: 20 }), " ", hideLabels ? "" : "Test"] }) }, "/tests"), _jsx(Tab, { href: `/admin/user/${userId}/conversation/${partitionId}/info`, title: _jsxs("span", { className: "text-sm flex flex-row items-center gap-2", children: [_jsx(Icon, { icon: "solar:user-rounded-linear", width: 20, height: 20 }), " ", hideLabels ? "" : "Info"] }) }, "/info"), _jsx(Tab, { href: `/admin/user/${userId}/conversation/${partitionId}/versioning`, title: _jsxs("span", { className: "text-sm flex flex-row items-center gap-2", children: [_jsx(Icon, { icon: "pajamas:branch", width: 20, height: 20 }), " ", hideLabels ? "" : "Versioning"] }) }, "/versioning"), _jsx(Tab, { href: `/admin/user/${userId}/conversation/${partitionId}/tracer`, title: _jsxs("span", { className: "text-sm flex flex-row items-center gap-2", children: [_jsx(Icon, { icon: "solar:plaaylist-minimalistic-linear", width: 20, height: 20 }), " ", hideLabels ? "" : "Traces"] }) }, "/traces")] }));
};
//# sourceMappingURL=adminNavBar.js.map