// UserBlockTree.tsx
import React from "react";
import { BlockType, BlockSentType, BlockChunkType } from "../chat/schema";
import { useComponentConfig, useComponentRegistry } from "./UserComponentRegistry";
import { cn } from "@heroui/react";
import { HiddenBlock, useBlock } from "./defaultComponents";

type Props = {
  block: BlockType | BlockSentType | BlockChunkType;
};



type BlockContainerProps = {
  block: BlockType | BlockSentType | BlockChunkType;
};


export const BlockContainer: React.FC<BlockContainerProps> = ({ block }: BlockContainerProps) => {
  
  const { debugOutlines } = useComponentRegistry();

  const {component, isHidden, isWrapper} = useComponentConfig((block as any).tags, "block");


  if (isHidden) {
    return null;
  }

  
  const BlockComponent = !isWrapper ? component : HiddenBlock;

  if (!BlockComponent) return null;


  return (
    <div className={cn({
      "outline-solid outline-blue-500 p-2 mb-2": debugOutlines
    })}>
      {debugOutlines && <div className="flex gap-2">
        <div className="flex gap-1">
          {block.tags?.map((tag: string) => (
            <div key={tag} className="text-sm text-gray-500 border border-gray-500 rounded-lg px-1">{tag}</div>
          ))}
        </div>
      </div>
      }
      {/* @ts-ignore */}
      <BlockComponent block={block}>
        {block.children?.map((child: BlockType, i: number) => (
          <BlockContainer key={i} block={child} />
        ))}
      </BlockComponent>
    </div>
  )

};
