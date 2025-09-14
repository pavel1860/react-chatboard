import { useStore } from "../../store/useStore";
import {  Tab, Tabs } from "@heroui/react";
import { useCtx } from "../../providers/ctx-provider";
import { useRouter } from "next/router";
import { Icon } from "@iconify-icon/react";






function getTabKeyFromPath(path: string) {
    if (path.includes('/tests')) return '/tests';
    if (path.includes('/info')) return '/info';
    if (path.includes('/thread')) return '/thread';
    if (path.includes('/versioning')) return '/versioning';
    if (path.includes('/tracer')) return '/traces';
    // Default (the base conversation page)
    return '/artifact';
}






interface AdminNavigationBarProps {
    hideLabels?: boolean
    isVertical?: boolean
}



export const AdminNavigationBar = ({hideLabels=false, isVertical=false}: AdminNavigationBarProps) => {

    const router = useRouter()
    const { refUserId, partitionId } = useCtx()
    const { isArtifactViewOpen, setIsArtifactViewOpen } = useStore()

    return (
        <Tabs
            isVertical={isVertical}
            aria-label="Tabs" 
            selectedKey={getTabKeyFromPath(router.pathname)} 
            color="primary"
            variant="light"
            onSelectionChange={()=>{
                if (!isArtifactViewOpen){
                    setIsArtifactViewOpen(true)
                }
            }}>
            <Tab key="/artifact" href={`/admin/user/${refUserId}/conversation/${partitionId}`} title={<span className="text-sm flex flex-row items-center gap-2" ><Icon icon="mdi:home-search-outline" width={20} height={20} /> {hideLabels ? "" : "Artifact"}</span>} />
            <Tab key="/tests" href={`/admin/user/${refUserId}/conversation/${partitionId}/tests`} title={<span className="text-sm flex flex-row items-center gap-2"><Icon icon="solar:test-tube-line-duotone" width={20} height={20} /> {hideLabels ? "" : "Test"}</span>} />
            <Tab key="/info" href={`/admin/user/${refUserId}/conversation/${partitionId}/info`} title={<span className="text-sm flex flex-row items-center gap-2"><Icon icon="solar:user-rounded-linear" width={20} height={20} /> {hideLabels ? "" : "Info"}</span>} />
            {/* <Tab key="/thread" href={`/admin/user/${refUserId}/conversation/${partitionId}/thread`} title={<span className="text-sm flex flex-row items-center gap-2"><Icon icon="solar:card-linear" width={20} height={20} /> {hideLabels ? "" : "Raw"}</span>} /> */}
            <Tab key="/versioning" href={`/admin/user/${refUserId}/conversation/${partitionId}/versioning`} title={<span className="text-sm flex flex-row items-center gap-2"><Icon icon="pajamas:branch" width={20} height={20} /> {hideLabels ? "" : "Versioning"}</span>} />
            <Tab key="/traces" href={`/admin/user/${refUserId}/conversation/${partitionId}/tracer`} title={<span className="text-sm flex flex-row items-center gap-2"><Icon icon="solar:plaaylist-minimalistic-linear" width={20} height={20} /> {hideLabels ? "" : "Traces"}</span>} />
        </Tabs>
    )
}

