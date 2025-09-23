import { RunType } from "../components/promptEditor/types";
export type ModelType = "anthropic" | "openai";
export declare class RunTreeContext {
    _runTree: RunType;
    _child_runs: RunTreeContext[];
    constructor(runTree: any, chiled_runs?: RunTreeContext[]);
    get id(): string;
    get name(): string;
    get run_type(): string;
    get messages(): any;
    get inputMessages(): any;
    get outputMessages(): any;
    get child_runs(): RunTreeContext[];
    get inputs(): any;
    get outputs(): any;
    get error(): any;
    get extra(): {
        model: string;
        system_filename: string | undefined;
        user_filename: string | undefined;
    };
    get metadata(): any;
    get startTime(): Date;
    get endTime(): Date;
    duration(rounded?: number, format?: string): number;
    get model(): any;
    get modelType(): ModelType;
}
export declare const build_run_tree: (run: any) => RunTreeContext;
//# sourceMappingURL=run-tree.d.ts.map