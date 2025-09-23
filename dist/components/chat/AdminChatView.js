import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useChat } from "../../providers/chat-provider";
import { Message } from "./message";
import InfiniteChat from "./infinite-chat";
// import { useBotState } from "../../hooks/use-bot-state";
import EmptyChatView from "./emptyChatView";
import { useCtx } from "../../providers/ctx-provider";
import { Turn } from "./turn";
import { useConversation } from "../../services/conversationService";
import { Button, Chip, cn, tv, VisuallyHidden, useCheckbox, Textarea, Slider } from "@heroui/react";
import { TextSearch } from "lucide-react";
import { Icon } from "@iconify-icon/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { useStore } from "../../store/useStore";
import { TurnEvaluatorSchema } from "../../services/testService";
import { ArrayField, Form, FormWatcher, InputField, TextField } from "../form";
import { StreamingContent } from "./streamingContent";
import { useStore } from "../../store/useStore";
function DistanceEvaluator({ name, metadata, onChange }) {
    const [distance, setDistance] = useState(metadata.distance);
    return _jsx("div", { className: "rounded-lg px-4 py-3 w-60 flex items-start gap-2", children: _jsx(Slider, { "aria-label": "Temperature", className: "max-w-sm", color: "success", defaultValue: 0.7, label: "Select semantic similarity", value: distance, disableThumbScale: true, 
            // formatOptions={{style: "percent"}}
            maxValue: 1, minValue: 0, size: "md", step: 0.05, showTooltip: true, showSteps: true, marks: [
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
            ], onChange: (value) => {
                setDistance(value);
            }, onChangeEnd: (value) => {
                onChange({ distance: value });
            } }) });
}
function PromptEvaluator({ name, metadata, onChange }) {
    const [debouncedValue, setDebouncedValue] = useState(metadata.prompt);
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange({ prompt: debouncedValue });
        }, 500);
        return () => clearTimeout(timer);
    }, [debouncedValue, onChange]);
    return _jsx("div", { className: "w-full", children: _jsx(Textarea, { placeholder: "Test description", className: "w-full", value: debouncedValue, onChange: (e) => {
                setDebouncedValue(e.target.value);
            } }) });
}
function Evaluator({ name, metadata, onChange, turnId }) {
    const { removeEvaluator } = useTurnEvaluators(turnId);
    let comp;
    let label;
    if (name == "prompt") {
        comp = _jsx(PromptEvaluator, { name: name, metadata: metadata, onChange: onChange });
        label = "Prompt";
    }
    else {
        comp = _jsx(DistanceEvaluator, { name: name, metadata: metadata, onChange: onChange });
        label = "Distance";
    }
    return (_jsxs("div", { className: "flex flex-row items-start justify-start w-full", children: [_jsx("div", { className: "text-sm text-gray-400 w-2/12", children: label }), _jsx("div", { className: "w-9/12", children: comp }), _jsx("div", { className: "w-1/12", children: _jsx(Button, { isIconOnly: true, variant: "light", color: "primary", size: "sm", onPress: () => {
                        removeEvaluator(name);
                    }, children: _jsx(Icon, { icon: "mdi:trash-can" }) }) })] }));
}
const useEvaluators = (turnId) => {
    const { testTurns, addEvaluator, removeEvaluator } = useStore();
    let evaluator = testTurns.find((turn) => turn.turn.id == turnId);
    if (!evaluator) {
        addEvaluator(turnId, { name: "distance", metadata: { distance: 0.5 } });
        evaluator = testTurns.find((turn) => turn.turn.id == turnId) || { turn: {}, evaluators: [] };
    }
    return {
        evaluator,
        addEvaluator: (name, metadata) => {
            addEvaluator(turnId, { name, metadata });
        },
        removeEvaluator: (name) => {
            removeEvaluator(turnId, name);
        }
    };
};
const useTurnEvaluators = (turnId) => {
    const { testTurns, addEvaluator, removeEvaluator, setEvaluatorMetadata } = useStore();
    const evaluator = testTurns.find((turn) => turn.turn.id == turnId);
    return {
        evaluator,
        evaluators: evaluator?.evaluators,
        evalLookup: evaluator?.evaluators.reduce((acc, evaluator) => {
            acc[evaluator.name] = evaluator;
            return acc;
        }, {}),
        addEvaluator: (name, metadata) => {
            addEvaluator(turnId, { name, metadata });
        },
        removeEvaluator: (name) => {
            removeEvaluator(turnId, name);
        },
        setEvaluatorMetadata: (name, metadata) => {
            setEvaluatorMetadata(turnId, name, metadata);
        },
        setEvaluator: (evaluatorData) => {
            // This would need to be implemented in the store if needed
            console.warn("setEvaluator not implemented");
        }
    };
};
function EvaluatorsWrapper({ turnId }) {
    const { evaluators, addEvaluator, evalLookup, setEvaluatorMetadata } = useTurnEvaluators(turnId);
    return (_jsxs("div", { className: "flex flex-col items-start justify-start w-full bg-white p-2 border-1 border-gray-200 rounded-md", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["Evaluators (", evaluators?.length, ")"] }), evalLookup && !evalLookup["prompt"] && _jsx(Button, { variant: "light", color: "primary", size: "sm", onPress: () => {
                    addEvaluator("prompt", { prompt: "" });
                }, children: "Add LLM as a judge prompt" }), evalLookup && !evalLookup["distance"] && _jsx(Button, { variant: "light", color: "primary", size: "sm", onPress: () => {
                    addEvaluator("distance", { distance: 0.7 });
                }, children: "Add distance" }), _jsx("div", { className: "flex flex-col items-center gap-2 w-full", children: evaluators?.map((turnEvaluator) => _jsx("div", { className: "w-full px-4", children: _jsx(Evaluator, { name: turnEvaluator.name, metadata: turnEvaluator.metadata, onChange: (metadata) => {
                            setEvaluatorMetadata(turnEvaluator.name, metadata);
                        }, turnId: turnId }) }, turnEvaluator.name)) })] }));
}
function Evaluators2({ turnId }) {
    const { evaluator, setEvaluator } = useTurnEvaluators(turnId);
    return _jsx("div", { children: evaluator &&
            _jsx(Form, { schema: TurnEvaluatorSchema, defaultValues: evaluator, onSubmit: (data) => {
                    setEvaluator(data);
                }, children: _jsx(ArrayField, { field: "evaluators", addComponent: (addItem) => {
                        return _jsxs("div", { className: "flex flex-row items-center gap-2", children: [_jsx(Button, { variant: "light", color: "primary", size: "sm", onPress: () => {
                                        addItem();
                                    }, startContent: _jsx(Icon, { icon: "mdi:plus" }), children: "distance" }), _jsx(Button, { variant: "light", color: "primary", size: "sm", onPress: () => {
                                        addItem();
                                    }, startContent: _jsx(Icon, { icon: "mdi:plus" }), children: "prompt" })] });
                    }, children: (item, index, prefix, remove) => {
                        return _jsxs("div", { children: [item.name === "distance" ?
                                    _jsxs(_Fragment, { children: [_jsx("div", { className: "text-sm text-gray-400", children: "Distance" }), _jsx(FormWatcher, { field: "name", value: item.name, label: "Name", labelWidth: "100px", hideValue: true }), _jsx(InputField, { type: "number", label: "Metadata", field: `${prefix}.metadata` })] })
                                    :
                                        _jsxs(_Fragment, { children: [_jsx("div", { className: "text-sm text-gray-400", children: "Prompt" }), _jsx(FormWatcher, { field: "name", value: item.name, label: "Name", labelWidth: "100px", hideValue: true }), _jsx(TextField, { type: "text", label: "Metadata", field: `${prefix}.metadata` })] }), _jsx(Button, { isIconOnly: true, variant: "light", color: "primary", size: "sm", onPress: () => {
                                        remove(index);
                                    }, children: _jsx(Icon, { icon: "mdi:trash-can" }) })] }, index);
                    } }) }) });
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
function TestCheckbox({ isSelected: isSelectedProp, onSelectChange }) {
    const { children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getInputProps } = useCheckbox({
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
        onSelectChange && onSelectChange(isSelected);
    }, [isSelected]);
    const styles = checkbox({ isSelected, isFocusVisible });
    return (_jsxs("label", { ...getBaseProps(), children: [_jsx(VisuallyHidden, { children: _jsx("input", { ...getInputProps() }) }), _jsx(Chip, { classNames: {
                    base: cn(styles.base(), "w-8 h-8"),
                    // base: styles.base(),
                    content: styles.content(),
                }, color: "primary", radius: "md", size: "sm", 
                // startContent={isSelected ? <Icon icon="solar:test-tube-bold" color="white"/> : <Icon icon="solar:test-tube-broken" color="white"/>}
                variant: "faded", ...getLabelProps(), children: _jsx("div", { className: "flex items-center justify-center", children: isSelected ? _jsx(Icon, { icon: "solar:test-tube-bold", color: "white" }) : _jsx(Icon, { icon: "solar:test-tube-broken", color: "white" }) }) })] }));
}
const useTestSelection = (turns) => {
    const { testTurns, addTestTurn, removeTestTurn } = useStore();
    const [selectedTurns, setSelectedTurns] = useState(() => {
        const newSelectedTurns = {};
        for (const turn of turns) {
            newSelectedTurns[turn.id] = false;
        }
        return newSelectedTurns;
    });
    useEffect(() => {
        const newSelectedTurns = {};
        for (const turn of turns) {
            newSelectedTurns[turn.id] = testTurns.some((t) => t.turn.id == turn.id);
        }
        setSelectedTurns(newSelectedTurns);
    }, [turns]);
    return {
        selectedTurns,
        selectForTest: (turn) => {
            setSelectedTurns((prev) => ({ ...prev, [turn.id]: true }));
            addTestTurn(turn, [{ name: "distance", metadata: { distance: 0.7 } }]);
        },
        deselectForTest: (turn) => {
            setSelectedTurns((prev) => ({ ...prev, [turn.id]: false }));
            removeTestTurn(turn.id);
        },
    };
};
export default function AdminChatView() {
    // const state = useBotState()
    const router = useRouter();
    const [showSelection, setShowSelection] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        if (pathname?.includes("tests")) {
            setShowSelection(true);
        }
        else {
            setShowSelection(false);
        }
    }, [pathname]);
    const { turnId, setTurnId, setStateUpdateMessageId } = useStore();
    const { sendMessage, loading, sending, mutate: refetch, turns, fetchMore, } = useChat();
    const { selectedTurns, selectForTest, deselectForTest } = useTestSelection(turns);
    const ctx = useCtx();
    const { data: conversation } = useConversation({ id: ctx?.partitionId });
    if (turns.length == 0 && !loading) {
        return _jsx(EmptyChatView, {});
    }
    return (_jsx(InfiniteChat, { items: turns || [], 
        // height="750px"
        gap: "none", loading: sending || loading, fetchMore: fetchMore, emptyMessage: _jsx(EmptyChatView, {}), endMessage: _jsx("div", { className: "text-center text-sm" }), children: (turn, index, turns, nextTurn, prevTurn, isLast) => (_jsx(Turn, { turn: turn, items: turn.messages, index: index, nextTurn: nextTurn, prevTurn: prevTurn, branchId: turn.branchId, setBranchId: ctx.setBranchId, sendMessage: sendMessage, refetchChat: refetch, onBranchChange: (newBranchId) => {
                setTurnId(null);
                setStateUpdateMessageId(null);
            }, showSideControls: true, showFooterControls: true, isSelected: selectedTurns[turn.id], className: cn(selectedTurns[turn.id] && "bg-blue-50 p-2 border-1 border-blue-200 rounded-md"), 
            // topContent={startTurn && startTurn.id == turn.id && <div>Test start</div>}
            // topContent={
            //     startTurn && startTurn.id == turn.id && <div className="flex flex-row items-center gap-2 justify-center border-b-2 border-gray-200 w-full ">
            //         <div className="text-sm text-gray-400 bg-slate-200 px-2 rounded-t-md">Test start</div>                            
            //     </div>
            // }
            bottomContent: _jsx("div", { className: cn("w-full flex flex-col"), children: _jsxs("div", { className: "flex flex-row items-center gap-2 w-full", children: [_jsxs("div", { className: "text-sm text-gray-400", children: ["Turn ", turn.id] }), _jsxs("div", { className: "text-sm text-gray-400", children: ["Branch: ", turn.branchId] }), _jsx(Button, { className: "text-sm text-gray-400", variant: "light", size: "sm", isDisabled: !turn.traceId, onPress: () => {
                                if (turn.traceId) {
                                    router.push(`/admin/user/${ctx.refUserId}/conversation/${ctx.partitionId}/tracer/${turn.traceId}`);
                                }
                            }, startContent: _jsx(TextSearch, { size: 15, color: "gray" }), children: "Trace" })] }) }), rightContent: _jsxs(_Fragment, { children: [!showSelection && _jsx(Button, { isIconOnly: true, variant: "light", onPress: () => {
                            if (prevTurn) {
                                sendMessage(turn.messages[0].content, turn.messages[0].toolCalls, turn.messages[0].state, prevTurn.id, true);
                            }
                        }, children: _jsx(Icon, { icon: "mdi:refresh" }) }), showSelection && _jsx(TestCheckbox, { isSelected: selectedTurns[turn.id], onSelectChange: (isSelected) => {
                            if (isSelected) {
                                selectForTest(turn);
                            }
                            else {
                                deselectForTest(turn);
                            }
                        } })] }), evaluators: _jsx(EvaluatorsWrapper, { turnId: turn.id }), children: (message, index, messages) => (message.meta?.isStreaming ? _jsx(StreamingContent, {}) :
                _jsx(Message, { message: message, index: index, showChoices: index == 0, avatar: conversation?.avatar, isStreaming: message.meta?.isStreaming, 
                    // isStreaming={message.role == "assistant" && index == 0}
                    onChoice: (choice) => {
                        // sendMessage(choice.content, undefined, state)
                    } })) })) }));
}
//# sourceMappingURL=AdminChatView.js.map