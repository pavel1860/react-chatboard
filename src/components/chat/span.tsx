import { SpanType, SpanEventSchema, BlockType, BlockSentType, LogSchema } from "react-chatboard/src/components/chat/schema";
import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { JSONTree } from "react-json-tree";
import BlockViewer from "./block";

type Props = {
  span?: SpanType | null;
};

type SpanEventType = SpanEventSchema;
type LogType = LogSchema;

// Component for rendering a log event
const LogEventView: React.FC<{
  log: LogType;
  depth?: number;
  onFocus?: (log: LogType) => void;
}> = ({ log, depth = 0, onFocus }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClick = () => {
    onFocus?.(log);
    setIsFocused(true);
    setTimeout(() => setIsFocused(false), 200);
  };
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-600";
      case "warning": return "text-yellow-600";
      case "info": return "text-blue-600";
      default: return "text-gray-600";
    }
  };
  
  return (
    <div className="font-mono text-sm">
      <div 
        className={`flex items-center py-0.5 hover:bg-gray-50 cursor-pointer transition-colors rounded ${
          isFocused ? 'bg-blue-50 ring-1 ring-blue-200' : ''
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center flex-1">
          <span className="w-4 mr-1"></span>
          
          {/* Log indicator */}
          <span className={`mr-2 ${getLevelColor(log.level)}`}>log&gt;</span>
          
          {/* Log message */}
          <div className="flex-1 text-gray-800">
            {log.message}
          </div>
          
          {/* Log metadata */}
          <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
            <span className={getLevelColor(log.level)}>{log.level}</span>
            <span className="text-gray-400">#{log.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for rendering a model event
const ModelEventView: React.FC<{
  model: any;
  depth?: number;
  onFocus?: (model: any) => void;
}> = ({ model, depth = 0, onFocus }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClick = () => {
    onFocus?.(model);
    setIsFocused(true);
    setTimeout(() => setIsFocused(false), 200);
  };
  
  return (
    <div className="font-mono text-sm">
      <div 
        className={`flex items-center py-0.5 hover:bg-gray-50 cursor-pointer transition-colors rounded ${
          isFocused ? 'bg-blue-50 ring-1 ring-blue-200' : ''
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center flex-1">
          <span className="w-4 mr-1"></span>
          
          {/* Model indicator */}
          <span className="mr-2 text-cyan-600">model&gt;</span>
          
          {/* Model info */}
          <div className="flex-1 text-gray-800">
            {model.name || model.type || "model"}
          </div>
          
          {/* Model metadata */}
          <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
            <span className="text-gray-400">model</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for rendering span events (blocks, nested spans, logs, or models)
const SpanEventView: React.FC<{
  event: SpanEventType;
  depth?: number;
  onFocus?: (item: any) => void;
  globalExpanded?: boolean;
}> = ({ event, depth = 0, onFocus, globalExpanded = true }) => {
  if (event.eventType === "block") {
    return (
      <BlockViewer 
        blocks={[event.data as BlockType]}
        depth={depth}
        onFocus={onFocus}
        globalExpanded={globalExpanded}
      />
    );
  } else if (event.eventType === "span") {
    return (
      <SpanNodeView
        span={event.data as SpanType}
        depth={depth}
        onFocus={onFocus}
        globalExpanded={globalExpanded}
      />
    );
  } else if (event.eventType === "log") {
    return (
      <LogEventView
        log={event.data as LogType}
        depth={depth}
        onFocus={onFocus}
      />
    );
  } else if (event.eventType === "model") {
    return (
      <ModelEventView
        model={event.data}
        depth={depth}
        onFocus={onFocus}
      />
    );
  }
  return null;
};

// Component for rendering a span node
const SpanNodeView: React.FC<{
  span: SpanType;
  depth?: number;
  onFocus?: (span: SpanType) => void;
  globalExpanded?: boolean;
}> = ({ span, depth = 0, onFocus, globalExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  
  // Sync local expanded state with global control
  React.useEffect(() => {
    setIsExpanded(globalExpanded);
  }, [globalExpanded]);
  
  const hasChildren = span.events && span.events.length > 0;
  
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
    onFocus?.(span);
    setIsFocused(true);
    setTimeout(() => setIsFocused(false), 200);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "failed": return "text-red-600";
      case "running": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };
  
  return (
    <div className="font-mono text-sm">
      {/* Span header with metadata */}
      <div 
        className={`flex items-center py-0.5 hover:bg-gray-50 cursor-pointer transition-colors rounded ${
          isFocused ? 'bg-blue-50 ring-1 ring-blue-200' : ''
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center flex-1">
          {nestingIndicators}
          
          {hasChildren && (
            isExpanded ? 
              <ChevronDown className="w-3 h-3 mr-1 text-gray-400" /> :
              <ChevronRight className="w-3 h-3 mr-1 text-gray-400" />
          )}
          {!hasChildren && <span className="w-4 mr-1"></span>}
          
          {/* Span indicator */}
          <span className="mr-2 text-purple-600">span&gt;</span>
          
          {/* Span name */}
          <div className="flex-1 text-gray-800">
            {span.name}
          </div>
          
          {/* Span metadata */}
          <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
            <span className={getStatusColor(span.status)}>{span.status}</span>
            {span.metadata?.path && (
              <span className="text-blue-400">[{(span.metadata.path as number[]).join(',')}]</span>
            )}
            <span className="text-gray-400">#{span.id}</span>
          </div>
        </div>
      </div>
      
      {/* Events */}
      {isExpanded && hasChildren && (
        <div className="ml-2 border-l border-gray-200 pl-1">
          {span.events.map((event: SpanEventType, i: number) => (
            <SpanEventView 
              key={i} 
              event={event}
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

// Main viewer component for spans
const SpanViewer: React.FC<Props> = ({ span }) => {
  const [focusedItem, setFocusedItem] = useState<any>(null);
  const [globalExpanded, setGlobalExpanded] = useState(true);
  
  if (!span) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-2">
        <div className="text-xs text-gray-500 font-mono text-center py-4">
          no span available
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-2">
      {/* Header with controls */}
      <div className="text-xs text-gray-500 font-mono border-b border-gray-200 pb-1 mb-2">
        <div className="flex items-center justify-between">
          <span>span</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGlobalExpanded(false)}
              className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-mono transition-colors"
              title="Collapse all items"
            >
              collapse
            </button>
            <button
              onClick={() => setGlobalExpanded(true)}
              className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-mono transition-colors"
              title="Expand all items"
            >
              expand
            </button>
            <span className="text-gray-400">|</span>
            <span>{span.events?.length || 0} events</span>
          </div>
        </div>
      </div>
      
      {/* Span tree */}
      <div className="space-y-0">
        <SpanNodeView 
          span={span}
          onFocus={setFocusedItem}
          globalExpanded={globalExpanded}
        />
      </div>
      
      {/* Debug info */}
      {focusedItem && (
        <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500 font-mono">
          <JSONTree data={focusedItem} />
        </div>
      )}
    </div>
  );
};

export default SpanViewer;
export { SpanNodeView, SpanEventView, LogEventView, ModelEventView };
