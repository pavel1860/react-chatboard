import { TestRunBaseSchema, TestRunSchema, useTestRunList } from "@/react-chatboard/src/services/testing-service"
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Selection } from "@nextui-org/react"



const StatusChip = ({ status }: { status: string }) => {
    if (status === "success") {
        return (
            <Chip color="success" variant="flat">
                {status}
            </Chip>
        )
    } else if (status === "failure") {
        return (
            <Chip color="danger" variant="flat">
                {status}
            </Chip>
        )
    } else {
        return (
            <Chip color="warning" variant="flat">
                {status}
            </Chip>
        )
    }
}


interface TestRunTableProps {
    testCaseId: number
    onSelectionChange?: (keys: number) => void
    onRowAction?: (key: number) => void
}



export function TestRunTable({ testCaseId, onSelectionChange, onRowAction }: TestRunTableProps) {

    const { 
        data: testRunList, 
        isLoading: testRunLoading, 
        error: testRunError,
        where,
    } = useTestRunList(10, 0, testCaseId ? [["test_case_id", "==", testCaseId]] : [])
    
    return (
        <div>
            <h1>Test Run Table</h1>
            <Table
                selectionMode="single"
                selectionBehavior="replace"
                aria-label="Test Run Table"
                onRowAction={(key) => {
                    if (onRowAction) {
                        onRowAction(key as number)
                    }
                }}
                // onSelectionChange={(keys) => {
                //     if (keys === "all") {
                //         // onSelectionChange?.(keys)
                //         throw new Error("Not implemented")
                //     } else {
                //         const key = keys.values().next().value
                //         if (key && onSelectionChange) {
                //             onSelectionChange(key as number)
                //         }
                //     }
                    
                // }}
            >
                <TableHeader>
                    {/* <TableColumn>Test Run ID</TableColumn> */}
                    {/* <TableColumn>Test Case ID</TableColumn> */}
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Final Score</TableColumn>
                    <TableColumn>Created At</TableColumn>
                </TableHeader>
                <TableBody isLoading={testRunLoading} items={testRunList || []}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {/* <TableCell>{item.id}</TableCell> */}
                            {/* <TableCell>{item.test_case_id}</TableCell> */}
                            <TableCell><StatusChip status={item.status} /></TableCell>
                            <TableCell>{item.final_score}</TableCell>
                            <TableCell>{item.created_at}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}