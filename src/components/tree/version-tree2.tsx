import { useState } from 'react';
import { useAllTurns, useBranchTurns } from '../../services/artifact-log-service';
import { useAdminStore } from '../../stores/admin-store';
import useArtifactLog from '../../hooks/artifact-log-hook';
// Assuming TurnType and BranchType types from the Zod schemas are already defined in the service

// Component to render a single turn node
// and, if available, its forked branches.
function TurnNode({ turn, indent = 0 }: { turn: any; indent?: number }) {
    const [expandedBranches, setExpandedBranches] = useState<{ [branchId: number]: boolean }>({});

    const toggleBranch = (branchId: number) => {
        setExpandedBranches(prev => ({ ...prev, [branchId]: !prev[branchId] }));
    };

    return (
        <div
            style={{
                marginLeft: indent * 20,
                borderLeft: '1px dashed #ccc',
                paddingLeft: 8,
                marginTop: 4,
            }}
        >
            {/* Display turn information */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>Turn {turn.index}</span>
                <span
                    style={{
                        marginLeft: 8,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background:
                            turn.status === 'staged'
                                ? '#f7b500'
                                : turn.status === 'committed'
                                    ? '#28a745'
                                    : '#dc3545',
                        color: '#fff',
                        fontSize: '12px',
                    }}
                >
                    {turn.status.toUpperCase()}
                </span>
                <span style={{ marginLeft: 8, color: '#666', fontSize: '12px' }}>
                    {new Date(turn.created_at).toLocaleTimeString()}
                </span>
                {turn.message && (
                    <span style={{ marginLeft: 8, fontStyle: 'italic', fontSize: '12px' }}>
                        - {turn.message}
                    </span>
                )}
            </div>

            {/* Render forked branches if any exist */}
            {turn.forked_branches && turn.forked_branches.length > 0 && (
                <div style={{ marginLeft: 20, marginTop: 4 }}>
                    {turn.forked_branches.map((branch: any) => (
                        <div key={branch.id} style={{ marginTop: 4 }}>
                            <button
                                onClick={() => toggleBranch(branch.id)}
                                style={{ fontSize: '12px' }}
                            >
                                {expandedBranches[branch.id] ? 'Collapse' : 'Expand'} branch{' '}
                                {branch.name}
                            </button>
                            {expandedBranches[branch.id] && (
                                <ForkBranchTree branch={branch} indent={indent + 2} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Component to fetch and render turns for a given forked branch.
function ForkBranchTree({ branch, indent = 1 }: { branch: any; indent?: number }) {
    const { selectedHeadId } = useAdminStore();
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
        <div style={{ marginLeft: indent * 20, marginTop: 4 }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                Branch: {branch.name}
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
    const { head } = useArtifactLog()
    const headers = { head_id: String(head?.id) };
    
    const { data: turns, isLoading, error } = useBranchTurns(head?.main_branch_id ?? null, headers);
    
    if (!head) return <div>No head selected</div>;

    

    if (isLoading) return <div>Loading master branch turns...</div>;
    if (error)
        return <div>Error loading master branch turns: {error.message}</div>;

    return (
        <div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: 8 }}>
                Master Branch
            </div>
            {turns &&
                turns.map((turn) => (
                    <TurnNode key={turn.id} turn={turn} indent={0} />
                ))}
        </div>
    );
}

// Main component renders the master branch tree.
function VersionTree() {
    return (
        <div>
            <MasterBranchTree />
        </div>
    );
}

export default VersionTree;

