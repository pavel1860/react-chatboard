import { BlockType, BlockSentType, BlockChunkType } from "./schema";
import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { JSONTree } from "react-json-tree";

type Props = {
  blocks?: (BlockType | BlockSentType)[] | null;
  depth?: number;
  onFocus?: (block: BlockType | BlockSentType) => void;
  globalExpanded?: boolean;
};

// Helper function to get confidence color based on logprob
const getConfidenceColor = (logprob?: number | null): string => {
  if (logprob === undefined || logprob === null) return "";
  
  // Convert logprob to confidence (higher logprob = higher confidence)
  // Typical logprob range is -10 to 0, with 0 being highest confidence
  const confidence = Math.max(0, Math.min(1, (logprob + 10) / 10));
  
  if (confidence > 0.8) return "decoration-green-500";
  if (confidence > 0.6) return "decoration-yellow-500";
  if (confidence > 0.4) return "decoration-orange-500";
  return "decoration-red-500";
};

// Component for rendering individual text chunks with confidence indicators
const ChunkText: React.FC<{ chunk: BlockChunkType }> = ({ chunk }) => {
  const confidenceClass = getConfidenceColor(chunk.logprob);
  const hasLogprob = chunk.logprob !== undefined && chunk.logprob !== null;
  
  return (
    <span 
      className={`${hasLogprob ? `underline ${confidenceClass} decoration-2` : ""}`}
      title={hasLogprob ? `confidence: ${chunk.logprob?.toFixed(3)}` : undefined}
    >
      {chunk.content}
    </span>
  );
};

// Component for rendering a sentence (BlockSent) with its chunks
const SentenceView: React.FC<{ 
  sent: BlockSentType; 
  depth: number;
  showMetadata?: boolean;
}> = ({ sent, depth, showMetadata = false }) => {
  const chunks = sent.blocks || [];
  
  // Generate nesting indicators - reduced spacing
  const nestingIndicators = [];
  for (let i = 0; i < depth; i++) {
    nestingIndicators.push(
      <span key={i} className="text-gray-400 mr-0.5">
        {i === depth - 1 ? "├─" : "│ "}
      </span>
    );
  }
  
  return (
    <div className="font-mono text-sm">
      {showMetadata && (
        <div className="flex items-center text-xs text-gray-500 mb-1">
          {/* {nestingIndicators} */}
          <span className="text-gray-400">sent[{sent.index}]</span>
          {sent.hasEol && <span className="ml-2 text-blue-400">eol</span>}
        </div>
      )}
      
      <div className="flex items-start">
        {/* {!showMetadata && nestingIndicators} */}
        <div className="flex-1 leading-relaxed text-gray-800">
          {chunks.map((chunk, i) => (
            <ChunkText key={i} chunk={chunk} />
          ))}
          {sent.hasEol && "\n"}
        </div>
      </div>
    </div>
  );
};

// Component for rendering tags as colored badges
const TagBadges: React.FC<{ tags: string[] }> = ({ tags }) => {
  const getTagColor = (tag: string) => {
    const hash = tag.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700", 
      "bg-purple-100 text-purple-700",
      "bg-yellow-100 text-yellow-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700"
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, i) => (
        <span 
          key={i}
          className={`px-1.5 py-0.5 rounded text-xs font-mono ${getTagColor(tag)}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

// Main component for rendering a block (container with title and children)
const BlockNodeView: React.FC<{ 
  block: BlockType | BlockSentType; 
  depth?: number;
  onFocus?: (block: BlockType | BlockSentType) => void;
  globalExpanded?: boolean;
}> = ({ block, depth = 0, onFocus, globalExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  
  // Sync local expanded state with global control
  React.useEffect(() => {
    setIsExpanded(globalExpanded);
  }, [globalExpanded]);
  
  // Check if this is a Block or BlockSent
  const isBlock = 'root' in block && 'children' in block;
  const blockData = block as BlockType;
  const sentData = block as BlockSentType;
  
  const hasChildren = isBlock && blockData.children && blockData.children.length > 0;
  
  // Generate nesting indicators - reduced spacing
  const nestingIndicators = [];
  for (let i = 0; i < depth; i++) {
    nestingIndicators.push(
      <span key={i} className="text-gray-400 mr-0.5">
        {i === depth - 1 ? "├─" : "│ "}
      </span>
    );
  }
  
  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    onFocus?.(block);
    setIsFocused(true);
    setTimeout(() => setIsFocused(false), 200);
  };
  
  if (!isBlock) {
    // Render as sentence
    return <SentenceView sent={sentData} depth={depth} />;
  }
  
  return (
    <div className="font-mono text-sm">
      {/* Block header with metadata */}
      <div 
        className={`flex items-center py-0.5 hover:bg-gray-50 cursor-pointer transition-colors rounded ${
          isFocused ? 'bg-blue-50 ring-1 ring-blue-200' : ''
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center flex-1">
          {/* {nestingIndicators} */}
          
          {hasChildren && (
            isExpanded ? 
              <ChevronDown className="w-3 h-3 mr-1 text-gray-400" /> :
              <ChevronRight className="w-3 h-3 mr-1 text-gray-400" />
          )}
          {!hasChildren && <span className="w-4 mr-1"></span>}
          
          {/* Role indicator */}
          {blockData.role && (
            <span className="mr-2">
              {blockData.role === "system" && <span className="text-green-600">system&gt;</span>}
              {blockData.role === "user" && <span className="text-blue-600">user&gt;</span>}
              {blockData.role === "assistant" && <span className="text-purple-600">assistant&gt;</span>}
              {!["system", "user", "assistant"].includes(blockData.role) && (
                <span className="text-gray-600">{blockData.role}&gt;</span>
              )}
            </span>
          )}
          
          {/* Block title (root sentence) */}
          <div className="flex-1">
            <SentenceView sent={blockData.root} depth={0} />
          </div>
          
          {/* Block metadata */}
          <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
            <span>blk[{blockData.index || 0}]</span>
            {blockData.id && <span className="text-gray-400">#{blockData.id}</span>}
          </div>
        </div>
      </div>
      
      {/* Tags */}
      {blockData.tags && blockData.tags.length > 0 && (
        <div className="ml-4 mb-1">
          <TagBadges tags={blockData.tags} />
        </div>
      )}
      
      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="ml-2 border-l border-gray-200 pl-1">
          {blockData.children.map((child: BlockType | BlockSentType, i: number) => (
            <BlockNodeView 
              key={i} 
              block={child} 
              depth={depth + 1} 
              onFocus={onFocus}
              globalExpanded={globalExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main viewer component
const BlockViewer: React.FC<Props> = ({ blocks, depth = 0, onFocus, globalExpanded = true }) => {
  const [focusedBlock, setFocusedBlock] = useState<BlockType | BlockSentType | null>(null);
  const [localGlobalExpanded, setLocalGlobalExpanded] = useState(true);
  
  // Use passed globalExpanded if provided, otherwise use local state
  const effectiveGlobalExpanded = globalExpanded !== undefined ? globalExpanded : localGlobalExpanded;
  
  // Handle undefined or null blocks
  const safeBlocks = blocks || [];
  
  // If this is being used as a nested component (depth > 0), render without container
  if (depth > 0) {
    if (safeBlocks.length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-0">
        {safeBlocks.map((block, i) => (
          <BlockNodeView 
            key={i} 
            block={block} 
            depth={depth}
            onFocus={onFocus || setFocusedBlock}
            globalExpanded={effectiveGlobalExpanded}
          />
        ))}
      </div>
    );
  }
  
  // Root level component with full UI
  if (safeBlocks.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-2">
        <div className="text-xs text-gray-500 font-mono text-center py-4">
          no blocks available
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-2">
      {/* Header with controls */}
      <div className="text-xs text-gray-500 font-mono border-b border-gray-200 pb-1 mb-2">
        <div className="flex items-center justify-between">
          <span>blocks</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocalGlobalExpanded(false)}
              className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-mono transition-colors"
              title="Collapse all blocks"
            >
              collapse
            </button>
            <button
              onClick={() => setLocalGlobalExpanded(true)}
              className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-mono transition-colors"
              title="Expand all blocks"
            >
              expand
            </button>
            <span className="text-gray-400">|</span>
            <span>{safeBlocks.length} items</span>
          </div>
        </div>
      </div>
      
      {/* Block tree */}
      <div className="space-y-0">
        {safeBlocks.map((block, i) => (
          <BlockNodeView 
            key={i} 
            block={block} 
            onFocus={onFocus || setFocusedBlock}
            globalExpanded={effectiveGlobalExpanded}
          />
        ))}
      </div>
      
      {/* Debug info */}
      {focusedBlock && !onFocus && (
        <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500 font-mono">
          <JSONTree data={focusedBlock} />
        </div>
      )}
    </div>
  );
};

export default BlockViewer;
export { BlockNodeView };