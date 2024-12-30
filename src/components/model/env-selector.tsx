
import { useModelEnv } from "../../state/model-env";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";












export default function ModelEnvSelector() {


    const { 
        selectedEnv, 
        setSelectedEnv, 
        envs, 
        loading
    } = useModelEnv();


    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    isLoading={loading}
                    variant="light"
                >
                    {selectedEnv}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                onAction={(key) => setSelectedEnv(key as string)}
                aria-label="Dynamic Actions"
                items={envs?.map((env: string) => ({key: env, label: env})) || []}
            >
                {(item) => (
                    <DropdownItem
                        key={item.key}
                        // color={item.key === "delete" ? "danger" : "default"}
                        // className={item.key === "delete" ? "text-danger" : ""}
                    >
                        <div className="flex justify-between">
                            {item.label}
                            {/* {item.chipLabel && <Chip size="sm" color="success" variant="bordered">{item.chipLabel}</Chip>} */}
                        </div>
                    </DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>
    )
}