import {$getRoot, $getSelection, $createParagraphNode, $createTextNode, TextNode} from 'lexical';
import {useEffect, useState} from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

// import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';



// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  console.log('AutoFocus!')

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}


function OnChangePlugin({ onChange } : any) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      onChange(editorState);
    });
  }, [editor, onChange]);

  return null;
}


function OnChangeInitialTextPlugin ({initialText, isCompact} : {initialText: string, isCompact: boolean}) {
  const [editor] = useLexicalComposerContext();    
  const [expandText, setExpandText] = useState(false);

  useEffect(() => {
      // const isHeading = screen.title ? true : false;
      editor.update(() => {
          const root = $getRoot();
          root.clear();          
              root.append(
                  $createParagraphNode().append(
                      $createTextNode(expandText || !isCompact  ? initialText : initialText.slice(0,200)+'...'),
                  )
              )          
          // $wrapLeafNodesInElements(root, () => $createHeadingNode("h1"));
      })
  },[initialText, expandText, isCompact])

  return initialText?.length > 200 && isCompact ? <button 
    // className="bg-blue-500 hover:bg-blue-700 text-white py-0 px-2 rounded-full"
    className=" text-blue-600 hover:text-blue-500 py-0 px-2 rounded-full"
    onClick={()=>{setExpandText(!expandText)}}>{expandText ? 'hide':'expand'}
    </button> : null
}


function OnChangeEditablePlugin ({notEditable} : {notEditable : boolean}) {
  const [editor] = useLexicalComposerContext();    
  useEffect(() => {
      editor.update(() => {
          editor.setEditable(!notEditable)
      })
  },[notEditable])

  return null

  
}


// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

export default function PromptTextEditor({text, paragraphLabel, notEditable, isCompact, onChangeText}: {text: string, onChangeText?: (text:string)=>void, paragraphLabel?: string | undefined, notEditable?: boolean | undefined, isCompact?: boolean | undefined}) {

  const theme = {
    // Theme styling goes here
    ltr: 'ltr',
    rtl: 'rtl',
    paragraph: 'editor-paragraph',
  }
  

  if (paragraphLabel){
    theme.paragraph = paragraphLabel
  }

  const initialConfig = {
    namespace: 'MyEditor',
    editable: notEditable ? false : true,
    editorState: () => $convertFromMarkdownString(text, TRANSFORMERS),
    // theme: {...theme},
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      LinkNode,
      HorizontalRuleNode,
    //   AgentActionNode,
    //   {
    //     replace: TextNode,
    //     with: (node: TextNode) => {
    //       return $createAgentActionNode(node.__text) 
    //     }
    //   }
    ]
  };

  

  const [editorState, setEditorState] = useState();


  return (
    <div className='relative'>
    <LexicalComposer initialConfig={initialConfig}>
      <OnChangeInitialTextPlugin initialText={text} isCompact={isCompact || false}/>
      <OnChangeEditablePlugin notEditable={notEditable === undefined ? false : notEditable }/>
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <PlainTextPlugin
        contentEditable={<ContentEditable className="resize-none text-[15px] caret-[#444] relative tab-[1] outline-none" />}
        // @ts-ignore
        placeholder={<div className='text-[#999] overflow-hidden absolute truncate top-0 left-[10px] text-[15px] select-none inline-block pointer-events-none'>Enter some text...</div>}
        // @ts-ignore
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      {/* <MyCustomAutoFocusPlugin /> */}
      <OnChangePlugin onChange={(editorState: any) => {
      // Call toJSON on the EditorState object, which produces a serialization safe string
        editorState.read(()=>{
            const root = $getRoot();
            // const currenText = root.getAllTextNodes().map(textNode => textNode.getTextContent()).join('\n')
            const currenText = root.getAllTextNodes().map(textNode => textNode.getTextContent()).join('')
            const editorStateJSON = editorState.toJSON();
            // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
            setEditorState(JSON.stringify(editorStateJSON) as any);
            onChangeText && onChangeText(currenText)
        })
    }}/>
      
    </LexicalComposer>
    </div>
  );
}