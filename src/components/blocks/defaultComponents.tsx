// defaultComponents.tsx
import { useChat } from "../../providers/chat-provider";
import React, { useMemo } from "react";
import { BlockChunkType, BlockSentType, BlockType, SpanType } from "../chat/schema";

// Minimal components
export const DefaultText = (chunk: BlockChunkType) => (
  <span className="animate-typing whitespace-pre-wrap">{chunk.content}</span>
);

export const DefaultSentence = (sent: BlockSentType) => (
  <p className="mb-2">
    {sent.children?.map((c, i) => (
      <DefaultText key={i} {...c} />
    ))}
  </p>
);

export const DefaultBlock = (block: BlockType) => (
  <div className="p-2 border border-gray-200 rounded  shadow-sm mb-2">
    {/* <div className="flex">
        {block.tags?.map((t, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {t}
            </span>
        ))}
    </div> */}
    {block.root && <DefaultSentence {...block.root} />}
    {block.children?.map((child: BlockType, i: number) =>
      child.Type === "Block" ? (
        <DefaultBlock key={i} {...child} />
      ) : child.Type === "BlockSent" ? (
        <DefaultSentence key={i} {...child} />
      ) : null
    )}
  </div>
);

// Example "button" component (trigger tool call)
export const DefaultButton = (block: BlockType) => (
  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
    {block.root?.children?.map((c: any) => c.content).join("")}
  </button>
);



export const useBlock = (block: BlockType) => {


  // const content = useMemo(() => {
  //   console.log("block",block.tags, block.children.length)
  //   return block.root?.children?.map((c: any, i: number) => <DefaultText key={i} {...c} />)
  // }, [block, block?.root?.children])
  const content = block.content?.children?.map((c: any, i: number) => <DefaultText key={i} {...c} />)

  return {
    content
  }
}



export interface SpanProps {
  children: React.ReactNode
  span: SpanType
}

export const BasicSpan = ({children, span}: SpanProps) => {

  return (
    <div className="">
      {children}
    </div>
  )
}


export const HiddenSpan = ({children, span}: SpanProps) => {
  return (
    <>
      {children}
    </>
  )
}


export interface BlockProps {
  children: React.ReactNode
  block: BlockType
}


export const HiddenBlock = ({children, block}: BlockProps) => {
  return (
    <>
      {children}
    </>
  )
}

export const BasicBlock = ({children, block}: BlockProps) => {

  const {content} = useBlock(block)

  return (
    <div className="p-2 text-black">
      {/* {block.tags?.map((t, i) => (
        <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            {t}
        </span>
      ))} */}
      {content}
      {children}
    </div>
  )
}


export const AvatarSpan = ({children, span}: SpanProps) => {
  return (
    <div className="p-2 text-black bg-gray-100 rounded-2xl mb-2">
      <span className="text-sm text-gray-500">{span.name}</span>
      {children}
    </div>
  )
}


export const AnswerBlock = ({children, block}: BlockProps) => {

  const {content} = useBlock(block)
  
  return (
    // <div className="p-2 text-black rounded-2xl rounded-tr-none shadow-md mb-2 max-w-[80%] ml-auto">
    <div className="p-2 text-black">
      {children}
    </div>
  )
}


export const UserMessage = ({children, block}: BlockProps) => {
  const {content} = useBlock(block)
  return (
    <div className="p-2 bg-blue-500 text-white rounded-2xl rounded-tr-none shadow-md mb-2 max-w-[80%] ml-auto">
      {content}
      {children}
    </div>
  )
}


export const AutosuggestionsBlock = ({children, block}: BlockProps) => {
  const {content} = useBlock(block)
  return (
    <div className="p-2 text-white flex rounded-2xl mb-2 ml-auto">
      {/* {content} */}
      {children}
    </div>
  )
}


export const SuggestionItem = ({children, block}: BlockProps) => {
  const {content} = useBlock(block)
  const {sendMessage} = useChat()
  return (
    // <button className="p-2 border-2 border-purple-300 text-black hover:bg-purple-100 hover:cursor-pointer rounded-2xl shadow-md mb-2 max-w-[80%] ml-auto">
    //   {/* {content} */}
    //   {children}
    // </button>
    <button className="relative overflow-hidden border-2 border-purple-300 px-4 m-1 text-white rounded-2xl
              hover:bg-purple-200 hover:cursor-pointer active:bg-purple-300 transition-colors duration-150"
              onClick={() => {
                sendMessage(block)
              }}
      >
        {children}
      </button>
  )
}