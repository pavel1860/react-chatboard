
import { TurnType } from "../../services/turnService";
import { Button, Checkbox, Chip, cn, tv, VisuallyHidden, useCheckbox, Textarea, Slider } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useEffect, useState } from "react";
// import { useStore } from "../../store/useStore";
import { EvaluatorConfigType, TurnEvaluatorSchema } from "../../services/testService";
import { ArrayField, Form, FormWatcher, InputField, TextField } from "../form";
import { usePathname } from "next/navigation";
import { useStore } from "../../store/useStore";



interface TestCheckboxProps {
    isSelected: boolean;
    onSelectChange?: (isSelected: boolean) => void;
}



interface EvaluatorProps {
    name: string;
    metadata: any;
    onChange: (metadata: any) => void;
}

function DistanceEvaluator({ name, metadata, onChange }: EvaluatorProps) {
    const [distance, setDistance] = useState(metadata.distance)
    return <div className="rounded-lg px-4 py-3 w-60 flex items-start gap-2">
        <Slider
            aria-label="Temperature"
            className="max-w-sm"
            color="success"
            defaultValue={0.7}
            label="Select semantic similarity"
            value={distance}
            disableThumbScale={true}
            // formatOptions={{style: "percent"}}
            maxValue={1}
            minValue={0}
            size="md"
            step={0.05}
            showTooltip={true}
            showSteps={true}
            marks={[
                {
                    value: 0.2,
                    label: "0.2",
                },
                {
                    value: 0.5,
                    label: "0.5",
                },
                {
                    value: 0.7,
                    label: "0.7",
                },
            ]}
            onChange={(value) => {
                setDistance(value)
            }}
            onChangeEnd={(value) => {
                onChange({ distance: value })
            }}
        />
        {/* <div className="w-20 ">
            <Chip className="text-sm text-gray-400 bg-gray-200">{distance}</Chip>
        </div> */}
    </div>

}


function PromptEvaluator({ name, metadata, onChange }: EvaluatorProps) {
    const [debouncedValue, setDebouncedValue] = useState(metadata.prompt);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange({ prompt: debouncedValue });
        }, 500);

        return () => clearTimeout(timer);
    }, [debouncedValue, onChange]);

    return <div className="w-full">
        <Textarea
            placeholder="Test description"
            className="w-full"
            value={debouncedValue}
            onChange={(e) => {
                setDebouncedValue(e.target.value);
            }}
        />
    </div>
}


function Evaluator({ name, metadata, onChange, turnId }: { name: string, metadata: any, onChange: (metadata: any) => void, turnId: number }) {

    const { removeEvaluator } = useTurnEvaluators(turnId)
    let comp: React.ReactNode
    let label: string
    if (name == "prompt") {
        comp = <PromptEvaluator name={name} metadata={metadata} onChange={onChange} />
        label = "Prompt"
    } else {
        comp = <DistanceEvaluator name={name} metadata={metadata} onChange={onChange} />
        label = "Distance"
    }

    return (
        <div
            className="flex flex-row items-start justify-start w-full"
        >

            <div className="text-sm text-gray-400 w-2/12">{label}</div>
            <div className="w-9/12">
                {comp}
            </div>
            <div className="w-1/12">
                <Button isIconOnly variant="light" color="primary" size="sm" onPress={() => {
                    removeEvaluator(name)
                }}>
                    <Icon icon="mdi:trash-can" />
                </Button>
            </div>
        </div>
    )
}



const useEvaluators = (turnId: number) => {
    const { testTurns, addEvaluator, removeEvaluator } = useStore()

    let evaluator = testTurns.find((turn) => turn.turn.id == turnId)
    if (!evaluator) {
        addEvaluator(turnId, { name: "distance", metadata: { distance: 0.5 } })
        evaluator = testTurns.find((turn) => turn.turn.id == turnId) || { turn: {} as TurnType, evaluators: [] }
    }
    return {
        evaluator,
        addEvaluator: (name: string, metadata: any) => {
            addEvaluator(turnId, { name, metadata })
        },
        removeEvaluator: (name: string) => {
            removeEvaluator(turnId, name)
        }
    }
}



const useTurnEvaluators = (turnId: number) => {
    const { testTurns, addEvaluator, removeEvaluator, setEvaluatorMetadata } = useStore()

    const evaluator = testTurns.find((turn) => turn.turn.id == turnId)

    return {
        evaluator,
        evaluators: evaluator?.evaluators,
        evalLookup: evaluator?.evaluators.reduce((acc, evaluator) => {
            acc[evaluator.name] = evaluator
            return acc
        }, {} as { [key: string]: EvaluatorConfigType }),
        addEvaluator: (name: string, metadata: any) => {
            addEvaluator(turnId, { name, metadata })
        },
        removeEvaluator: (name: string) => {
            removeEvaluator(turnId, name)
        },
        setEvaluatorMetadata: (name: string, metadata: any) => {
            setEvaluatorMetadata(turnId, name, metadata)
        },
        setEvaluator: (evaluatorData: any) => {
            // This would need to be implemented in the store if needed
            console.warn("setEvaluator not implemented")
        }
    }
}


export function EvaluatorsWrapper({ turnId }: { turnId: number }) {
    const { evaluators, addEvaluator, evalLookup, setEvaluatorMetadata } = useTurnEvaluators(turnId)
    return (
        <div className="flex flex-col items-start justify-start w-full bg-white p-2 border-1 border-gray-200 rounded-md">
            <div className="text-sm text-gray-500">Evaluators ({evaluators?.length})</div>
            {evalLookup && !evalLookup["prompt"] && <Button variant="light" color="primary" size="sm" onPress={() => {
                addEvaluator("prompt", { prompt: "" })
            }}>
                Add LLM as a judge prompt
            </Button>
            }
            {evalLookup && !evalLookup["distance"] && <Button variant="light" color="primary" size="sm" onPress={() => {
                addEvaluator("distance", { distance: 0.7 })
            }}>
                Add distance
            </Button>
            }
            <div className="flex flex-col items-center gap-2 w-full">
                {evaluators?.map((turnEvaluator: EvaluatorConfigType) =>
                    <div key={turnEvaluator.name} className="w-full px-4">
                        <Evaluator
                            name={turnEvaluator.name}
                            metadata={turnEvaluator.metadata}
                            onChange={(metadata: any) => {
                                setEvaluatorMetadata(turnEvaluator.name, metadata)
                            }}
                            turnId={turnId}
                        />
                    </div>)}
            </div>
            
            
        </div>
    )
}


function Evaluators2({ turnId }: { turnId: number }) {
    const { evaluator, setEvaluator } = useTurnEvaluators(turnId)

    return <div>
        {evaluator &&
            <Form schema={TurnEvaluatorSchema} defaultValues={evaluator} onSubmit={(data) => {
                setEvaluator(data)
            }}>

                <ArrayField
                    field="evaluators"
                    addComponent={(addItem) => {
                        return <div className="flex flex-row items-center gap-2">
                            <Button
                                variant="light"
                                color="primary"
                                size="sm"
                                onPress={() => {
                                    addItem()
                                }}
                                startContent={<Icon icon="mdi:plus" />}
                            >
                                distance
                            </Button>
                            <Button
                                variant="light"
                                color="primary"
                                size="sm"
                                onPress={() => {
                                    addItem()
                                }}
                                startContent={<Icon icon="mdi:plus" />}
                            >
                                prompt
                            </Button>
                        </div>
                    }}
                >
                    {(item, index, prefix, remove) => {
                        return <div key={index}>
                            {item.name === "distance" ?
                                <>
                                    <div className="text-sm text-gray-400">Distance</div>
                                    {/* <InputField type="text" label="Name" field={`${prefix}.name`} /> */}
                                    <FormWatcher field="name" value={item.name} label="Name" labelWidth="100px" hideValue />
                                    <InputField type="number" label="Metadata" field={`${prefix}.metadata`} />
                                </>
                                :
                                <>
                                    <div className="text-sm text-gray-400">Prompt</div>
                                    <FormWatcher field="name" value={item.name} label="Name" labelWidth="100px" hideValue />
                                    <TextField type="text" label="Metadata" field={`${prefix}.metadata`} />
                                </>}
                            <Button isIconOnly variant="light" color="primary" size="sm" onPress={() => {
                                remove(index)
                            }}>
                                <Icon icon="mdi:trash-can" />
                            </Button>
                        </div>
                    }}
                </ArrayField>
            </Form>
        }
    </div>
}





// const getEvaluator = (evaluator: TurnEvaluatorType) => {
//     if (evaluator.name == "distance") {
//         return <DistanceEvaluator />
//     } else if (evaluator.name == "prompt") {
//         return <PromptEvaluator evaluator={evaluator} />
//     }
//     return <div>
//         {evaluator.name}
//     </div>
// }

export function TestCheckbox({ isSelected: isSelectedProp, onSelectChange }: TestCheckboxProps) {
    const { children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getInputProps } =
        useCheckbox({
            defaultSelected: isSelectedProp,
        });

    const checkbox = tv({
        slots: {
            base: "border-default hover:bg-default-200",
            content: "text-default-500",
        },
        variants: {
            isSelected: {
                true: {
                    base: "border-primary bg-primary hover:bg-primary-500 hover:border-primary-500",
                    content: "text-primary-foreground pl-1",
                },
            },
            isFocusVisible: {
                true: {
                    base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
                },
            },
        },
    });

    useEffect(() => {
        onSelectChange && onSelectChange(isSelected)
    }, [isSelected])


    const styles = checkbox({ isSelected, isFocusVisible });

    return (
        <label {...getBaseProps()}>
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <Chip

                classNames={{
                    base: cn(styles.base(), "w-8 h-8"),
                    // base: styles.base(),
                    content: styles.content(),
                }}
                color="primary"
                radius="md"
                size="sm"
                // startContent={isSelected ? <Icon icon="solar:test-tube-bold" color="white"/> : <Icon icon="solar:test-tube-broken" color="white"/>}
                variant="faded"
                {...getLabelProps()}
            >
                <div className="flex items-center justify-center">
                    {isSelected ? <Icon icon="solar:test-tube-bold" color="white" /> : <Icon icon="solar:test-tube-broken" color="white" />}
                </div>
            </Chip>
        </label>
    );
}







export const useTestSelection = (turns: TurnType[]) => {


    const { testTurns, addTestTurn, removeTestTurn, setIsTestMode, isTestMode } = useStore()

    const [selectedTurns, setSelectedTurns] = useState<{ [key: string]: boolean }>(() => {
        const newSelectedTurns: { [key: string]: boolean } = {}
        for (const turn of turns) {
            newSelectedTurns[turn.id] = false
        }
        return newSelectedTurns
    })


    const pathname = usePathname();

    useEffect(() => {
      if (pathname?.includes("tests")) {
        setIsTestMode(true);
      } else {
        setIsTestMode(false);
      }
    }, [pathname]);

    useEffect(() => {
        const newSelectedTurns: { [key: string]: boolean } = {}
        for (const turn of turns) {
            newSelectedTurns[turn.id] = testTurns.some((t) => t.turn.id == turn.id)
        }
        setSelectedTurns(newSelectedTurns)
    }, [turns])





    return {
        isTestMode,
        setIsTestMode,
        selectedTurns,
        selectForTest: (turn: TurnType) => {
            setSelectedTurns((prev) => ({ ...prev, [turn.id]: true }))
            addTestTurn(turn, [{ name: "distance", metadata: { distance: 0.7 } }])
        },
        deselectForTest: (turn: TurnType) => {
            setSelectedTurns((prev) => ({ ...prev, [turn.id]: false }))
            removeTestTurn(turn.id)
        },
    }
}


