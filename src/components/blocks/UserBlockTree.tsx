// UserBlockTree.tsx
import React from "react";
import { BlockType, BlockSentType, BlockChunkType } from "./schema";
import { useBlockConfig, useComponentConfig, useComponentRegistry } from "./UserComponentRegistry";
import { useVisibility } from "./UserVisibilityContext";
import { cn } from "@heroui/react";
import { HiddenBlock, useBlock } from "./defaultComponents";

type Props = {
  block: BlockType | BlockSentType | BlockChunkType;
};

// export const BlockContainer: React.FC<Props> = ({ block }) => {
  
//   const { isVisible } = useVisibility();

//   const tag = (block as any).tags?.[0];
//   const type = block.Type;

//   const visible = isVisible((block as any).tags);

//   // If not visible → render children only
//   if (!visible) {
//     if ("children" in block && Array.isArray(block.children)) {
//       return (
//         <>
//           {block.children.map((child: any, i: number) => {
//             if (child.Type === "Block") {
//               return <BlockContainer key={i} block={child} />;
//             }
//             if (child.Type === "BlockSent") {
//               return <BlockContainer key={i} block={child} />;
//             }
//             if (child.Type === "BlockChunk") {
//               return <BlockContainer key={i} block={child} />;
//             }
//             return null;
//           })}
//         </>
//       );
//     }
//     return null;
//   }

//   // If visible → normal renderer
//   let renderer =
//     (tag && registry[tag]) ||
//     (type && registry[type]) ||
//     registry["default"];

//   if (!renderer) {
//     console.warn("No renderer found for", tag, type, block);
//     return null;
//   }

//   return <>{renderer(block)}</>;
// };


type BlockContainerProps = {
  block: BlockType | BlockSentType | BlockChunkType;
};


export const BlockContainer: React.FC<BlockContainerProps> = ({ block }) => {
  
  const { debugOutlines } = useComponentRegistry();

  const {component, isHidden, isWrapper} = useComponentConfig((block as any).tags, "block");


  if (isHidden) {
    return null;
  }

  
  const BlockComponent = !isWrapper ? component : HiddenBlock;

  return (
    // <div className={cn("border border-blue-500 rounded p-2 mb-2", {
    //   "outline outline-blue-500": debugOutlines
    // })}>
    <div className={cn({
      // "border border-blue-500 rounded p-2 mb-2": debugOutlines,
      "outline-solid outline-blue-500 p-2 mb-2": debugOutlines
    })}>
      {debugOutlines && <div className="flex gap-2">
        {/* <div className="text-sm text-gray-500">{block.name}</div> */}
        <div className="flex gap-1">
          {block.tags?.map((tag: string) => (
            <div key={tag} className="text-sm text-gray-500 border border-gray-500 rounded-lg px-1">{tag}</div>
          ))}
        </div>
      </div>
      }
      {/* {component && !isHidden && !hideRoot && component(block)} */}
      <BlockComponent block={block}>
        {block.children?.map((child: BlockType, i: number) => (
          <BlockContainer key={i} block={child} />
        ))}
      </BlockComponent>
    </div>
  )

};
