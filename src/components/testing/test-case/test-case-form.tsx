// import { ArrayField } from "@/react-chatboard/src/components/form/array-field"
import { Form, InputField, ArrayField } from "../../form"
import { TestCaseSchema, useGetTestCase } from "../../../services/testing-service"
import { Button, Spinner } from "@heroui/react"



interface TestCaseFormProps {
    id: string
}


export const TestCaseForm = ({ id }: TestCaseFormProps) => {
    const { data: testCase, isLoading: testCaseLoading, error: testCaseError } = useGetTestCase(id)
    // const { data: messageList, isLoading: messageListLoading, error: messageListError } = useGetMessageList()


    if (testCaseLoading) {
        return <Spinner />;
    }

    if (testCaseError) {
        return <div className="p-4 text-red-500">Error loading test case</div>;
    }

    return (
        <Form
            schema={TestCaseSchema}
            defaultValues={testCase}  
            size="sm"          
        >
            <h1>Test Case Form</h1>
            <InputField type="text" label="Title" field="title" />
            <InputField type="text" label="Description" field="description" />
            <ArrayField field="input_turns">
                {(item, index, prefix, remove) => (
                    <div key={index}>
                        <InputField type="text" label="Input" field={`${prefix}.input`} />
                        <InputField type="text" label="Output" field={`${prefix}.output`} />
                        <Button size="sm"onPress={() => remove(index)}>Remove</Button>
                    </div>
                )}
            </ArrayField>
            
        </Form>
    )
}