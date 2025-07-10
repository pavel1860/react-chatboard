import {
    EditorConfig, 
    ElementNode, 
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    SerializedTextNode,
    Spread,
    TextNode,    
} from 'lexical';
import {DecoratorNode, RangeSelection, SerializedElementNode} from 'lexical';



// const TAG_STYLES: any = {
//     'Thought:': 'inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
//     'Observation:': 'inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
//     'Action:': 'inline-flex items-center rounded-md bg-indigo-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
//     'Action Input:': 'inline-flex items-center rounded-md bg-indigo-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
//     'Scene Type:': 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
//     'Idea:': 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
//     'Script:': 'inline-flex items-center rounded-md bg-red-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
    
// } 
const TAG_STYLES: any = {
  'Thought:': 'inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'StateObservation:': 'inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'Action:': 'inline-flex items-center rounded-md bg-indigo-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'Action_Input:': 'inline-flex items-center rounded-md bg-indigo-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'Action_Output:': 'inline-flex items-center rounded-md bg-indigo-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'FinishAction:': 'inline-flex items-center rounded-md bg-black px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'Scene Type:': 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'Idea:': 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'Script:': 'inline-flex items-center rounded-md bg-red-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  'UserInput:': 'inline-flex items-center rounded-md bg-red-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
  
} 


export class AgentActionNode extends TextNode {

    __action: string;
  
    constructor(text: string, key?: NodeKey) {
      super(text, key);
      this.__action = "Default";
      for (let action of Object.keys(TAG_STYLES)){
        if (text.search(action) !== -1){
          this.__action = action
          break
        }
      }

      
      
      
      
      // if (text.search('Thought:') !== -1){
      //   this.__action = "Thought";
      // } else if (text.search('StateObservation:') !== -1 ){
      //   this.__action = "StateObservation";
      // } else if (text.search('Action:') !== -1){
      //   this.__action = "Action";
      // } else if (text.search('Action_Input:') !== -1){
      //   this.__action = "Action_Input";      
      // } else {
      //   this.__action = "Default";
      // }
    }
  
    static getType(): string {
      return 'agent_action';
    }
  
    static clone(node: AgentActionNode): AgentActionNode {
      return new AgentActionNode(node.__text, node.__key);
    }

    getAction(): string {
        const self = this.getLatest()
        return self.__action
    }
  
    createDOM(config: EditorConfig): HTMLElement {
        const element = super.createDOM(config);
        // if (this.getAction() !== 'Default'){
            // const contentText = this.__text.replace(`${this.__action}:`, '')
            let text = this.__text
            // for (let action of ['Thought:', 'Observation:', 'Action:', 'Action Input:']){
                // const pos = text.search(action)
                // if (pos !== -1){
            for (let action of Object.keys(TAG_STYLES)){
                text = text.replace(action, `<span class="${TAG_STYLES[action]}">${action}</span>`)
                // }

            }
            
            element.innerHTML = text
        // }
        
    //   element.style.color = this.__color;
      return element;
    }
  
    updateDOM(
      prevNode: AgentActionNode,
      dom: HTMLElement,
      config: EditorConfig,
    ): boolean {
      // @ts-ignore
      const isUpdated = super.updateDOM(prevNode, dom, config);
    //   if (prevNode.__color !== this.__color) {
    //     dom.style.color = this.__color;
    //   }
        // dom.style.color = 'red'
        // const contentText = this.__text.replace(`${this.__action}:`, '')        
        // dom.innerHTML = `<span class="text-gray-400">${this.__action}:</span> ${contentText}`
      return isUpdated;
    }

    exportJSON(){
        return {
            ...super.exportJSON(),
            __action: this.__action,
            type: this.getType(),
        }
    }

    // static importJSON(json: any): AgentActionNode {
    //     const node = $createAgentActionNode(
    //       json.__text,          
    //     )
    //     return node;
    // }
  }
  
  export function $createAgentActionNode(text: string): AgentActionNode {
    return new AgentActionNode(text);
  }
  
  export function $isAgentActionNode(node: LexicalNode | null | undefined): node is AgentActionNode {
    return node instanceof AgentActionNode;
  }