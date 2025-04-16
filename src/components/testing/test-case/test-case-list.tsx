import { FC, useMemo } from 'react';
import { useUsers } from '@/src/hooks/useUsers';
import List, { ListItemProps } from '@/react-chatboard/src/components/list/list2';
import { User } from 'lucide-react';
import { useChangeManagerHead, useGetManagerList } from '@/src/services/manager-service';
import { ListboxItem } from '@heroui/react';
import { useGetTestCaseList } from '@/react-chatboard/src/services/testing-service';
import { useRouter } from 'next/navigation';





interface TestCaseListProps {
    selectedTestCaseId?: string;
    onTestCaseSelect: (testCaseId: string) => void;
}







export const TestCaseList: FC<TestCaseListProps> = ({ selectedTestCaseId: selectedTestCaseId, onTestCaseSelect }) => {

    const router = useRouter();
    const { data: testCaseList, isLoading: testCaseLoading, error: testCaseError } = useGetTestCaseList()

    console.log("testCaseList", testCaseList)

    const { changeHead } = useChangeManagerHead({
        onSuccess: (data)=>{
            console.log("onSuccess", data)
        }
    })

    if (testCaseLoading) {
        return <div className="p-4 text-red-500">Error loading test cases</div>;
    }    
    return (
        <List
            items={testCaseList}
            loading={testCaseLoading}
            error={testCaseError}
            // selected={selectedTestCaseId}
            fullHeight
            onSelectionChange={async (key) => {
                const testCaseId = Number.parseInt(key)
                const testCase = testCaseList?.find(e => e.id === testCaseId)
                if (testCase) {
                    const res = await changeHead(testCase.head.id)
                    router.push(`/admin/test-cases/${testCaseId}`, undefined, { shallow: true })
                }
            }}
        >
            {(item) => (
                <ListboxItem
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    showDivider
                >
                <span className="text-small">{item.input_turns.length} turns</span>
            </ListboxItem>
            )}
        </List>
    );
}; 








// interface Test {
//     name: string
//     title: string
// }


// interface Artifact {
//     id: number
//     score: number
//     turn_id: number
//     created_at: string
// }

// function augmentValue<T>(value: T): T & Artifact  {
//     return {
//         ...value,
//         id: 1,
//         score: 1,
//         turn_id: 1,
//         created_at: "2021-01-01"
//     }
// }


// const test: Test = {
//     name: "test",
//     title: "test"
// }

// const test2 = augmentValue(test)








