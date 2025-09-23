import { Button, Chip, Avatar } from "@heroui/react"
import { LayoutHeader } from "./conversationLayout"
import { useLayout } from "../../hooks/layout-hook";
import { Icon } from "@iconify-icon/react";
import { useCtx } from "../../providers/ctx-provider";
import { useUser } from "../../services/userService";


interface MarketPlaceHeaderProps {
    children?: React.ReactNode
    refBranchId?: number
}

export const AdminMarketPlaceHeader = ({ children, refBranchId }: MarketPlaceHeaderProps) => {

    const {
        partitionId,
        setConversationId,
        branchId,
        setBranchId,
        refUserId
    } = useCtx()


    const { data: refUser } = useUser({id: refUserId})

    const currBranchId = refBranchId || branchId

    const { setIsSidebarOpen } = useLayout();
    return (
        <LayoutHeader
            startContent={
                <Button
                    onPress={() => setIsSidebarOpen(true)}
                    className="px-2 lg:hidden"
                    variant="light"
                    isIconOnly
                >
                    <Icon
                        icon="solar:siderbar-linear"
                        width={24}
                        height={24}
                    />
                </Button>
            }
        >
            <span className="flex flex-row items-center justify-between gap-2 w-full">
                <div className="flex flex-row items-center gap-2">
                    {refUser && <div className="flex flex-row items-center gap-2">
                        <Avatar
                            // @ts-ignore
                            src={refUser?.image}
                            name={refUser?.name || "Anonymous"}
                            size="sm"
                        />{refUser?.name || "Anonymous"}</div>}
                    <Chip variant="bordered" color="secondary" startContent={<Icon icon="pajamas:branch" width={16} height={16} />}>Branch {currBranchId}</Chip>
                    <Chip variant="bordered" color="secondary" startContent={<Icon icon="solar:chat-round-dots-linear" width={16} height={16} />}>Partition {partitionId}</Chip>
                </div>
                {children}
                <span className="flex flex-row items-center gap-2">
                <Icon
                    icon="solar:siderbar-line-duotone"
                    width={24}
                    height={24}
                    />Side
                </span>
            </span>
        </LayoutHeader>
    )
}