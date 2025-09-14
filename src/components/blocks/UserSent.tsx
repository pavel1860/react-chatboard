// UserSent.tsx
import React from "react";
import { BlockSentType } from "react-chatboard/src/components/chat/schema";
import { UserChunk } from "./UserChunk";

export const UserSent: React.FC<{ sent: BlockSentType }> = ({ sent }) => {
  return (
    <p className="whitespace-pre-wrap">
      {sent.children.map((chunk, i) => (
        <UserChunk key={i} chunk={chunk} />
      ))}
    </p>
  );
};
