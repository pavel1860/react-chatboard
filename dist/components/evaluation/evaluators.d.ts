import { TurnType } from "../../services/turnService";
interface TestCheckboxProps {
    isSelected: boolean;
    onSelectChange?: (isSelected: boolean) => void;
}
export declare function EvaluatorsWrapper({ turnId }: {
    turnId: number;
}): import("react/jsx-runtime").JSX.Element;
export declare function TestCheckbox({ isSelected: isSelectedProp, onSelectChange }: TestCheckboxProps): import("react/jsx-runtime").JSX.Element;
export declare const useTestSelection: (turns: TurnType[]) => {
    isTestMode: boolean;
    setIsTestMode: (isTestMode: boolean) => void;
    selectedTurns: {
        [key: string]: boolean;
    };
    selectForTest: (turn: TurnType) => void;
    deselectForTest: (turn: TurnType) => void;
};
export {};
//# sourceMappingURL=evaluators.d.ts.map