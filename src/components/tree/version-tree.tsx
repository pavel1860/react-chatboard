import { useBranchTurns, useUpdateTurn } from '../../model/services/artifact-log-service';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react';
import { useVersionTree, VersionTreeProvider } from './version-tree-context';
import { Ellipsis, Eye, EyeOff, GitMerge, TextSearch } from 'lucide-react';
// Assuming TurnType and BranchType types from the Zod schemas are already defined in the service

// Helper: Get commit dot color based on status.
function getStatusColor(status: string): string {
    if (status === 'staged') return '#f7b500';
    if (status === 'committed') return '#28a745';
    return '#dc3545';
}


const TurnDropdown = ({turn, refetch}: {turn: any, refetch: () => void}) => {


    const { trigger: updateTurn } = useUpdateTurn(turn.id)

    const { refetchChat } = useVersionTree()
    
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button size="sm" isIconOnly variant="light" color="default" startContent={<Ellipsis size={15} color="gray" />}/>                
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Dropdown menu with description" 
                variant="faded" 
                selectedKeys={[turn.status]}
                selectionMode="single"
                onSelectionChange={async (keys)=>{
                    console.log("keys", keys)
                    // @ts-ignore
                    const newStatus = [...keys]
                    if (newStatus.length > 0) {
                        // @ts-ignore
                        await updateTurn({ status: newStatus[0] })
                        refetch()
                        refetchChat && refetchChat()
                    }
                }}
            >
                <DropdownSection showDivider title="Change Status">                    
                    <DropdownItem
                        key="committed"
                        color="success"
                        // description="Committed"
                        // shortcut="⌘C"
                        // startContent={<CopyDocumentIcon className={iconClasses} />}
                    >
                        Committed
                    </DropdownItem>
                    <DropdownItem
                        key="staged"
                        color="warning"
                        // description="Staged"
                        // shortcut="⌘N"
                        // startContent={<AddNoteIcon className={iconClasses} />}
                    >
                        Staged
                    </DropdownItem>
                    <DropdownItem
                        key="reverted"
                        color="danger"
                        // description="Reverted"
                        // shortcut="⌘⇧E"
                        // startContent={<EditDocumentIcon className={iconClasses} />}
                    >
                        Reverted
                    </DropdownItem>
                </DropdownSection>
                {/* <DropdownSection title="Danger zone">
                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        description="Permanently delete the file"
                        shortcut="⌘⇧D"
                        // startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                    >
                        Delete file
                    </DropdownItem>
                </DropdownSection> */}
            </DropdownMenu>
        </Dropdown>
    );
}




// Component to render a single turn node
function TurnNode({ turn, indent = 0, refetch }: { turn: any; indent?: number, refetch: () => void }) {
    const { isExpanded, toggleTurn, branchId, setBranchId, refetchChat, setTraceId } = useVersionTree();
    const hasBranches = turn.forked_branches && turn.forked_branches.length > 0;
    // @ts-ignore
    const { trigger: updateTurn } = useUpdateTurn(turn.id, { branchId: branchId })
    
    return (
        <div
            style={{
                marginLeft: indent * 20 + 40,
                position: 'relative',
                borderLeft: `4px solid ${getStatusColor(turn.status)}`,
                marginTop: 4,
                cursor: 'pointer'
            }}

        >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* Left column: Git graph visuals */}

                <div style={{ position: 'relative', marginRight: 8, width: 20 }}>
                    {/* Vertical line behind the commit dot */}
                    {/* <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 9,
                            width: 2,
                            backgroundColor: '#ccc',
                        }}
                    /> */}
                    {/* Commit dot */}
                    {/* <div
                        style={{
                            position: 'relative',
                            width: 10,
                            // height: 12,
                            height: 30,
                            // height: "100%",
                            // borderRadius: '50%',
                            backgroundColor: getStatusColor(turn.status),
                            border: '2px solid white',
                            marginLeft: 3,
                            zIndex: 1,
                        }}
                    /> */}
                </div>
                {/* Right column: Turn content */}
                <div
                    style={{
                        // backgroundColor: '#f9f9f9',
                        // borderRadius: 4,
                        // padding: 6,
                        minWidth: 200,
                        // boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        cursor: hasBranches ? 'pointer' : 'default',
                    }}
                    onClick={() => hasBranches && toggleTurn(turn.id)}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <span style={{ fontWeight: 'bold', color: '#666' }}>Turn {turn.index}</span> */}
                        {/* <span
                            style={{
                                marginLeft: 8,
                                padding: '2px 6px',
                                borderRadius: 4,
                                background: getStatusColor(turn.status),
                                color: '#fff',
                                fontSize: '12px',
                            }}
                        >
                            {turn.status.toUpperCase()}
                        </span> */}
                        <span style={{ color: '#666', fontSize: '12px' }}>#{turn.id}</span>
                        <span style={{ marginLeft: 8, color: '#666', fontSize: '12px' }}>
                            {new Date(turn.created_at).toLocaleTimeString()}
                        </span>
                        {turn.message && (
                            <span style={{ marginLeft: 8, fontStyle: 'italic', fontSize: '12px' }}>
                                - {turn.message}
                            </span>
                        )}
                        {hasBranches && (
                            <span style={{ marginLeft: 8, fontSize: '12px' }}>
                                [{turn.forked_branches.length} branches]
                            </span>
                        )}
                        {turn.trace_id && <Button size="sm" isIconOnly variant="light" color="default" onClick={() => {
                            // setSideView("tracer-view")
                            setTraceId(turn.trace_id as string)
                        }}>
                            <TextSearch size={15} color="gray" />
                        </Button>}
                        {turn.status !== 'staged' && <Button size="sm" isIconOnly variant="light" color="default" onClick={async () => {
                            if (turn.status === 'staged') {
                                return
                            }
                            const newStatus = turn.status === 'committed' ? 'reverted' : 'committed'
                            // @ts-ignore
                            await updateTurn({ status: newStatus })
                            refetch()
                            refetchChat && refetchChat()
                            setBranchId(branchId)
                        }}>
                            {turn.status === 'committed' ? <Eye size={15} color="gray" /> : <EyeOff size={15} color="gray" />}
                        </Button>}
                        {turn && <TurnDropdown turn={turn} refetch={refetch} />}
                    </div>
                </div>
            </div>

            {/* Render forked branches when turn is expanded */}
            {hasBranches && isExpanded(turn.id) && (
                <div style={{
                    marginTop: 4,
                    // display: 'flex',
                }}>
                    {turn.forked_branches.map((branch: any) => (
                        <ForkBranchTree
                            key={branch.id}
                            branch={branch}
                            indent={indent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Component to fetch and render turns for a given forked branch.
function ForkBranchTree({ branch, indent = 1 }: { branch: any; indent?: number }) {
    const { branchId, setBranchId, partitionId } = useVersionTree()
    // const headers = { head_id: String(selectedHeadId) };
    const { data: turns, isLoading, error, mutate } = useBranchTurns(branch.id, partitionId);

    if (isLoading)
        return (
            <div style={{ marginLeft: indent * 20, fontSize: '12px' }}>
                Loading branch {branch.name}...
            </div>
        );
    if (error)
        return (
            <div
                style={{
                    marginLeft: indent * 20,
                    fontSize: '12px',
                    color: 'red',
                }}
            >
                Error loading branch {branch.name}: {error.message}
            </div>
        );

    const isSelected = branchId === branch.id

    return (
        <div style={{
            // marginLeft: indent * 20, 
            marginTop: 4,
        }}>
            {/* Branch header styled similar to a commit header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 4
            }}>
                <div style={{ position: 'relative', marginRight: 8, width: 20 }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 9,
                            width: 2,
                            backgroundColor: '#ccc',
                        }}
                    />
                    <div
                        style={{
                            position: 'relative',
                            width: 20,
                            height: 4,
                            // borderRadius: '50%',
                            backgroundColor: '#666',
                            // border: '2px solid white',
                            marginLeft: 5,
                            zIndex: 1,
                        }}
                    />
                </div>
                <div style={{ zIndex: 5 }}>
                    <Button
                        radius="full"
                        size="sm"
                        color={isSelected ? "primary" : "secondary"}
                        variant={isSelected ? 'solid' : 'bordered'}
                        onClick={() => setBranchId(branch.id)}
                        startContent={<GitMerge size={16} color={isSelected ? 'white' : 'purple'} className='mx-2' />}
                    ><span className='text-sm '>#{branch.id}</span></Button>
                    <span className='text-sm mx-3 text-gray-500'>{branch.name}</span>
                </div>
            </div>
            {isSelected && turns &&
                turns.map((turn) => (
                    <TurnNode key={turn.id} turn={turn} indent={indent + 1} refetch={() => mutate()} />
                ))}
        </div>
    );
}

// Component for the Master Branch—that is, the top-level tree
// which uses the `/all_turns` endpoint.
function MasterBranchTree({ partitionId }: { partitionId: number }) {
    // const { head, setSelectedBranchId, selectedBranchId } = useArtifactLog()
    const { branchId, setBranchId } = useVersionTree()
    const mainBranchId = 1
    // const headers = { head_id: String(mainBranchId) };
    console.log("MasterBranchTree", mainBranchId)
    const { data: turns, isLoading, error, mutate } = useBranchTurns(mainBranchId ?? null, partitionId);

    if (!mainBranchId) return <div>No head selected</div>;



    if (isLoading) return <div>Loading master branch turns...</div>;
    if (error)
        return <div>Error loading master branch turns: {error.message}</div>;

    const isSelected = branchId === mainBranchId

    return (
        <div>
            {/* <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: 8 }}>
                Main Branch
            </div> */}
            <Button
                radius="full"
                size="sm"
                startContent={<GitMerge size={16} color={isSelected ? 'white' : 'gray'} className='mx-2' />}
                color={isSelected ? "primary" : "secondary"}
                onClick={() => setBranchId(mainBranchId ?? null)}
                variant={isSelected ? 'solid' : 'bordered'}
            ><span>#{mainBranchId}</span></Button>
            <span className='text-sm mx-3 text-gray-500'>main branch</span>
            {turns &&
                turns.map((turn) => (
                    <TurnNode key={turn.id} turn={turn} indent={0} refetch={() => mutate()} />
                ))}

        </div>
    );
}



interface VersionTreeProps {
    partitionId: number
    branchId: number
    setBranchId: (branchId: number) => void
    setTraceId: (traceId: string) => void
    refetchChat?: () => void
}

// Main component wraps the tree with the context provider
function VersionTree({ partitionId, branchId, setBranchId, setTraceId, refetchChat }: VersionTreeProps) {
    return (
        <VersionTreeProvider branchId={branchId} setBranchId={setBranchId} setTraceId={setTraceId} refetchChat={refetchChat} partitionId={partitionId}>
            <div className="p-10">
                <MasterBranchTree partitionId={partitionId} />
            </div>
        </VersionTreeProvider>
    );
}

export default VersionTree;

