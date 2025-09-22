import { useRef, useState } from "react";

import { 
  $insertBlock,
  $buildBlock,
  $buildChunk,
  $buildSent,
  $isPostfix,
  $insertPostfix,
  $insertBlockChunk,
} from "./blockUtils";


export function useExecutionBuilder() {
  const stack = useRef<any[]>([]);   // span stack
  const roots = useRef<any[]>([]);   // root spans
  const [tree, setTree] = useState<any[]>([]);
  const lastPathRef = useRef<number[]>([]);

  function updateTree() {
    // force re-render with shallow copy
    setTree([...roots.current]);
  }

  /** ─── Span Handling ─────────────────────────────── */
  function startSpan(streamEvent: any) {
  
    const span = streamEvent.payload;

    if (stack.current.length === 0) {
      roots.current.push(span);
      // stack.current.push(span);
    } else {
      const parentEvent = stack.current.at(-1).events.find((e: any) => e.id == streamEvent.parentEventId)
      if (!parentEvent) {
        throw new Error(`Parent event not found for event ${streamEvent.index} ${streamEvent.parentEventId} ${streamEvent.name} ${streamEvent.type}`);
      }
      parentEvent.data = span
    }
    stack.current.push(span);
    updateTree();
  }



  function pushSpanEvent(streamEvent: any) {
    const current = stack.current.at(-1);
    if (!current) throw new Error("No current span");
    current.events.push({...streamEvent.event, data: streamEvent.payload});
    updateTree();
  }

  function popSpan(event: any) {
    const span = stack.current.pop();
    if (span) {
      span.endTime = event.createdAt ?? new Date();
      span.status = "completed";
      updateTree();
    }
  }


  function startStream(streamEvent: any) {
    const current = stack.current.at(-1);
    if (!current) return;

    // current.events.push({...event.event, data: undefined});
    const span = streamEvent.payload;
    const event = streamEvent.event;
    const parentEvent = current.events.find((e: any) => e.id == streamEvent.parentEventId)
    if (!parentEvent) {
      throw new Error(`Parent event not found for event ${event.id} ${event.name} ${event.type}`);
    }
    parentEvent.data = span;
    span.events.push(event);
    stack.current.push(span);
    updateTree();
  }
  
  function popStream(event: any) {
    const span = stack.current.pop();
    if (span) {
      span.endTime = event.createdAt ?? new Date();
      span.status = "completed";
      updateTree();
    }
  }

  /** ─── Non-stream block snapshot (span_event) ─────── */
  function appendBlockEvent(event: any) {
    const current = stack.current.at(-1);
    if (!current) throw new Error("No current span");
    current.events.push({...event.event, data: event.payload});

    updateTree();
  }

    

  /** ─── Streaming deltas ───────────────────────────── */
  function handleDelta(event: any) {
    const current = stack.current.at(-1);
    if (!current) throw new Error("No current span");
    const payload = event.payload;
    if (!payload?.Type) throw new Error("No payload type");

    // console.log("payload", payload);
    

    const rootBlockEvent = current.events.find((e: any) => e.id === event.parentEventId);
    if (!rootBlockEvent) throw new Error("No root block event");

    if (payload.Type === "Block") {
      // const path = payload.path.slice(1)
      const path = payload.path
      lastPathRef.current = path;
      // Merge into root block
      // Object.assign(rootBlockEvent.data, payload);
      if (!rootBlockEvent.data){
        rootBlockEvent.data = $buildBlock(payload);
      } else {
        const block = $buildBlock(payload);
        $insertBlock(rootBlockEvent.data, path, block);
      }

    } else if (payload.Type === "BlockSent") {
      const path = payload.path.slice(1)
      lastPathRef.current = path;
      // Append BlockSent to parent’s children      
      const blockSent = $buildSent(payload);
      if ($isPostfix(path)) {
        $insertPostfix(rootBlockEvent.data, path.slice(0, -1), blockSent);
      } else {
        $insertBlock(rootBlockEvent.data, path, blockSent);
      }

    } else if (payload.Type === "BlockChunk") {
      // Append chunk to BlockSent.blocks
      const path = [...lastPathRef.current, payload.index]
      const chunk = $buildChunk(payload);
      $insertBlockChunk(rootBlockEvent.data, lastPathRef.current, payload.index, chunk);
    }

    updateTree();
  }

  /** ─── Logs ───────────────────────────────────────── */
  function appendLog(event: any) {
    const current = stack.current.at(-1);
    if (!current) throw new Error("No current span");

    const log = {
      id: event.index,
      createdAt: new Date(event.createdAt),
      message: event.payload?.message ?? "",
      level: event.payload?.level ?? "info",
    };

    current.events.push({
      id: event.index,
      eventType: "log",
      data: log,
      index: event.index,
    });

    updateTree();
  }

  /** ─── Dispatcher ─────────────────────────────────── */
  function processEvent(stream_event: any, streamHookId: string) {
    console.log("processEvent", stream_event.index, stream_event.type, stream_event.payload )    
    try {
      switch (stream_event.type) {
        case "span_start":
          startSpan(stream_event);
          break;
        case "span_event":
          if (stream_event.event?.eventType === "span"){
            pushSpanEvent(stream_event);
          } else if (stream_event.event?.eventType === "block"){
            appendBlockEvent(stream_event);
          }
          
          break;
        case "span_end":
          popSpan(stream_event);
          break;
    
        case "stream_start":
          startStream(stream_event);
          break;
        case "stream_delta":
          handleDelta(stream_event);
          break;
        case "stream_end":
          popStream(stream_event);
          break;
    
        case "log":
          appendLog(stream_event);
          break;
        case "delta":
          handleDelta(stream_event);
          break;
    
        default:
          console.warn("Unknown event type", stream_event.type, stream_event);
      }
    } catch (e) {
      console.error("Error processing event", streamHookId, stream_event.index, stream_event.type, stream_event);
      throw e;
    }
  }
  // console.log("tree", tree.at(-1))
  return { processEvent, executionTree: tree.at(-1) };
}
