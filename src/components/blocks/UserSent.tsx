// UserSent.tsx
import React from "react";
import { BlockChunkType, BlockSentType } from "../chat/schema";
import { UserChunk } from "./UserChunk";

export const UserSent: React.FC<{ sent: BlockSentType }> = ({ sent }) => {
  return (
    <p className="whitespace-pre-wrap">
      {sent.children?.map((chunk: BlockChunkType, i: number) => (
        <UserChunk key={i} chunk={chunk} />
      ))}
    </p>
  );
};
