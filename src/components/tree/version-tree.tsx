import { useState } from 'react';
import { useAllTurns, useBranchTurns } from '../../services/artifact-log-service';
import { useAdminStore } from '../../stores/admin-store';
import  { useHeadEnv } from '../../hooks/artifact-log-hook';
import { Button, Chip } from '@nextui-org/react';
import { useVersionTree, VersionTreeProvider } from './version-tree-context';
// Assuming TurnType and BranchType types from the Zod schemas are already defined in the service

// Helper: Get commit dot color based on status.
function getStatusColor(status: string): string {
    if (status === 'staged') return '#f7b500';
    if (status === 'committed') return '#28a745';
    return '#dc3545';
}

// Component to render a single turn node
function TurnNode({ turn, indent = 0 }: { turn: any; indent?: number }) {
    const { isExpanded, toggleTurn } = useVersionTree();
    const hasBranches = turn.forked_branches && turn.forked_branches.length > 0;

    return (
        <div style={{ marginLeft: indent * 20 + 40, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* Left column: Git graph visuals */}
                <div style={{ position: 'relative', marginRight: 8, width: 20 }}>
                    {/* Vertical line behind the commit dot */}
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
                    {/* Commit dot */}
                    <div
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
                    />
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
                    </div>
                </div>
            </div>

            {/* Render forked branches when turn is expanded */}
            {hasBranches && isExpanded(turn.id) && (
                <div style={{ 
                    marginTop: 4,
                    display: 'flex',
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
    const { selectedHeadId, selectedBranchId, setSelectedBranchId } = useAdminStore();
    const headers = { head_id: String(selectedHeadId) };
    const { data: turns, isLoading, error } = useBranchTurns(branch.id, headers);

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

    return (
        <div style={{ 
            // marginLeft: indent * 20, 
            marginTop: 4
            }}>
            {/* Branch header styled similar to a commit header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
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
                            width: 25,
                            height: 7,
                            // borderRadius: '50%',
                            backgroundColor: '#666',
                            // border: '2px solid white',
                            marginLeft: 5,
                            zIndex: 1,
                        }}
                    />
                </div>
                {/* <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Branch: {branch.name}</div> */}
                <Button
                    radius="full"
                    size="sm"
                    color={selectedBranchId === branch.id ? "primary" : "secondary"} 
                    onClick={() => setSelectedBranchId(branch.id)}
                >{branch.name}</Button>
            </div>
            {turns &&
                turns.map((turn) => (
                    <TurnNode key={turn.id} turn={turn} indent={indent + 1} />
                ))}
        </div>
    );
}

// Component for the Master Branch—that is, the top-level tree
// which uses the `/all_turns` endpoint.
function MasterBranchTree() {
    // const { head, setSelectedBranchId, selectedBranchId } = useArtifactLog()
    const { mainBranchId, branchId, setBranchId } = useHeadEnv()
    const headers = { head_id: String(mainBranchId) };
    console.log("MasterBranchTree", mainBranchId, headers)
    const { data: turns, isLoading, error } = useBranchTurns(mainBranchId ?? null);
    
    if (!mainBranchId) return <div>No head selected</div>;

    

    if (isLoading) return <div>Loading master branch turns...</div>;
    if (error)
        return <div>Error loading master branch turns: {error.message}</div>;

    return (
        <div>
            {/* <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: 8 }}>
                Main Branch
            </div> */}            
            <Button
                radius="full"
                size="sm"
                color={branchId === mainBranchId ? "primary" : "secondary"} 
                onClick={() => setBranchId(mainBranchId ?? null)}
            >Main Branch</Button>
            {turns &&
                turns.map((turn) => (
                    <TurnNode key={turn.id} turn={turn} indent={0} />
                ))}
        </div>
    );
}

// Main component wraps the tree with the context provider
function VersionTree() {
    return (
        <VersionTreeProvider>
            <div className="p-10">
                <MasterBranchTree />
            </div>
        </VersionTreeProvider>
    );
}

export default VersionTree;

