import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { Listbox, ListboxItem } from "@heroui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCreateUser, useUserList } from "../../services/userService";
import { useAdminCtx } from "../../providers/ctx-provider";
export default function UserSection() {
    // const { conversationId, setConversationId } = useStore()
    const { data: session, status } = useSession({
        required: false,
    });
    const { refUserId, setRefUserId, isUserListOpen, setIsUserListOpen, setBranchId, } = useAdminCtx();
    // const { data: users, isLoading, mutate } = useUserList(10, 0)
    const { data: users, isLoading, mutate } = useUserList({
        limit: 10,
        offset: 0,
        // filters: session?.user?.id && [["authUserId", "!=", session?.user?.id]]
    });
    const { trigger: createUser, isMutating } = useCreateUser();
    const router = useRouter();
    if (isLoading) {
        return _jsx(Spinner, {});
    }
    return (_jsxs("div", { className: "w-full flex flex-col items-start justify-start gap-4", children: [_jsx("div", { className: "w-full flex items-center justify-start" }), _jsxs("div", { className: "flex flex-row items-center justify-start px-2 pt-2 gap-6 w-full", children: [_jsx(Icon, { icon: "solar:users-group-rounded-broken", width: 24, height: 24, className: "text-[#18181B]" }), _jsx("span", { className: "font-typography-base-primary font-semibold text-base leading-6 text-[#18181B]", children: "System Users" })] }), users && status === "authenticated" && (_jsx(Listbox, { selectionMode: "single", selectedKeys: refUserId ? [refUserId] : [], children: users?.flat().map((user) => (_jsx(ListboxItem, { 
                    // href={`/admin/user/${user.id}`} 
                    // startContent={user.email === session?.user?.email && <Chip className="text-xs text-default-500">You</Chip>}                        
                    // startContent={<div>
                    //     <Switch
                    //         defaultSelected
                    //         color="success"
                    //         endContent={<Bot />}
                    //         size="lg"
                    //         startContent={<User />}
                    //         >
                    //         Auto Respond
                    //         </Switch>
                    // </div>}
                    onPress: () => {
                        if (refUserId !== user.id) {
                            setBranchId(1);
                            setRefUserId(user.id);
                            router.push(`/admin/user/${user.id}`);
                        }
                        setIsUserListOpen(false);
                    }, children: _jsx("h2", { className: `text-lg ${refUserId === user.id ? "font-medium" : "font-light text-default-500"}`, children: user.name || `Anonymous ${user.id}` }) }, user.id))) }))] }));
}
//# sourceMappingURL=userSection.js.map