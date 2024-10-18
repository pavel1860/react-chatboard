import { RunType } from "../components/promptEditor/types"



export type ModelType = "anthropic" | "openai"



export class RunTreeContext {

    _runTree: RunType
    _child_runs: RunTreeContext[]
    
    constructor(runTree: any, chiled_runs: RunTreeContext[] = []) {
        this._runTree = runTree
        this._child_runs = chiled_runs
    }

    get id() {
        return this._runTree.id
    }

    get name() {
        return this._runTree.name
    }

    get run_type() {
        return this._runTree.run_type
    }

    get messages() {
        return this._runTree.outputs?.messages
    }

    get inputMessages(){
        return this._runTree.inputs?.messages || []
    }

    get outputMessages(){
        const outMessages = this.outputs?.generations?.map((g: any, idx: number) => ({
            id: `${this.id}_gen_${idx}`,
            role: g.message.data.role,
            content: g.message.data.content,
            toolCalls: g.message.data.additional_kwargs?.tool_calls
        })) || this.outputs?.messages?.map((m: any, idx: number) => ({
            id: `${this.id}_input_${idx}`,
            ...m
        })) || this.outputs?.content && [{
            id: `${this.id}_output`,
            role: 'output',
            content: this.outputs.content    
        }] || []
        return outMessages
    }

    get child_runs() {
        return this._child_runs
    }

    get inputs(){
        return this._runTree.inputs
    }

    get outputs(){
        return this._runTree.outputs
    }

    get error(){
        return this._runTree.error
    }

    get extra(){
        return this._runTree.extra || {}
    }

    get metadata(){
        return this._runTree.extra?.metadata || {}
    }

    get model(){
        return this.metadata.model
    }

    get modelType(): ModelType{
        const model = this.model
        if (model.search('claude') > -1){
            return "anthropic"
        }
        return "openai"
    }
        
}



export const build_run_tree = (run: any) => {
    const child_runs = run.child_runs?.map((child: any) => build_run_tree(child)) || []
    return new RunTreeContext(run, child_runs)
}