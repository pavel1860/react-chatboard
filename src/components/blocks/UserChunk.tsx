// UserChunk.tsx
import React, { useEffect, useState } from "react";
import { BlockChunkType } from "../chat/schema";

export const UserChunk: React.FC<{ chunk: BlockChunkType; animate?: boolean }> = ({ chunk, animate = true }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!animate) {
      setDisplayed(chunk.content);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(chunk.content.slice(0, i + 1));
      i++;
      if (i >= chunk.content.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [chunk.content, animate]);

  return <span>{displayed}</span>;
};
