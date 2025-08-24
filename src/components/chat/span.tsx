import { SpanType, BlockType } from "./schema"




interface SpanProps {
    children: (item: BlockType, index: number, items: BlockType[]) => React.ReactNode
    span: SpanType
}

export const Span = ({ children: itemRender, span }: SpanProps) => {
    console.log("span", span)
    return (
        <div className="border-l-2 border-gray-200 pl-2">
            <div>{span.name}</div>
            {span.blocks.blocks?.map((block: BlockType, index: number) => itemRender(block, index, span.blocks))}
        </div>
    )
}