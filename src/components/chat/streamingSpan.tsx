import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStream } from '../../services/streamStore';
import { SpanType, BlockType, BlockSentType, BlockChunkType, TurnType } from "./schema";;
import { Button, Spinner } from '@heroui/react';
import { useExecutionBuilder } from './processEvents';
import { SpanContainer } from '../blocks/UserSpan';


import {
  UserComponentProvider,
} from "../blocks/UserComponentRegistry";





type Props = {
  requestId?: string | null;
  onSpanUpdate?: (span: SpanType | null) => void;
};


interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details (to console, or send to a logging service)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI or default fallback
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

function randomId() {
  return Math.random().toString(36).substring(2, 10);
}


const StreamingSpanViewer: React.FC<Props> = ({ requestId: requestIdProp, onSpanUpdate }) => {
  const [fakeTurn, setFakeTurn] = useState<TurnType | null>(null);
  // const [streamId, setStreamId] = useState(randomId());

  const { events, pullEvents, consumed, isStreaming, requestId, streamHookId } = useStream();

  const [count, setCount] = useState(0);  

  const { processEvent, executionTree:currSpan } = useExecutionBuilder();
  

  useEffect(() => {
    if (!requestId) return;
    const effectId = randomId();
    const newEvents = pullEvents();
    for (const event of newEvents) {
      processEvent(event, streamHookId);
      setCount(count + 1);
    }
    consumed(newEvents, effectId);
  }, [events]);

  useEffect(() => {
    if (isStreaming && events.length === 0) {
      setFakeTurn(null);
      onSpanUpdate?.(null);
    }
  }, [isStreaming, events.length]);

  
  
  if (!currSpan && !isStreaming) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-2">
        <div className="text-xs text-gray-500 font-mono text-center py-4">
          no streaming data
        </div>
      </div>
    );
  }
  
  if (!currSpan && isStreaming) {
    return (
      <Spinner classNames={{label: "text-foreground mt-4"}} variant="wave" />
    );
  }
  
  
  return (
    <div>

    {/* <div className="overflow-y-scroll h-[556px]">
      <JSONTree data={currSpan} key={count} />
    </div> */}
    
      {currSpan && <SpanContainer span={currSpan} />}
    {/* <CollapsibleProvider>      
        {currSpan?.[0] && <DebugSpanTree key={currSpan?.[0]?.id} span={currSpan?.[0]} />}      
    </CollapsibleProvider> */}
    
    </div>
  );
};



const FallbackUI = () => {
  // const { events, isStreaming, consumed } = useStream();
  return (
    <div>
      <h2>Something went wrong.</h2>
      {/* <JSONTree data={events} /> */}
    </div>
  )
}


const StreamingSpanWrapper = () => {
  
  return (
    <ErrorBoundary fallback={<FallbackUI />}>
      <StreamingSpanViewer />
    </ErrorBoundary>
  )
}

export default StreamingSpanWrapper;
// export default StreamingSpanViewer;