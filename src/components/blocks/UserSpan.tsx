// UserSpan.tsx
import React from "react";
import { SpanType } from "../chat/schema";
import { BlockContainer } from "./UserBlockTree";
import { useComponentConfig, useComponentRegistry } from "./UserComponentRegistry";
import { cn } from "@heroui/react";
import { HiddenSpan } from "./defaultComponents";

type Props = {
  span: SpanType;
};

export const SpanContainer: React.FC<Props> = ({ span }: Props) => {

  const { debugOutlines } = useComponentRegistry();

  const {component, isHidden, isWrapper} = useComponentConfig(span.tags || [], "span");

  if (isHidden) {
    return null;
  }

  const SpanComponent = !isWrapper ? component : HiddenSpan;

  if (!SpanComponent) return null;


  return (
    // <div className={cn("border border-red-500 rounded p-2 mb-2", {
    //   "outline outline-red-500": debugOutlines
    // })}>
    <div className={cn({
      "outline-dashed outline-red-500 p-2 mb-2": debugOutlines
      // "border border-red-500 rounded p-2 mb-2": debugOutlines
    })}>
      {/* Span metadata - can hide if not needed */}
      {debugOutlines && <div className="flex gap-2">
        <div className="text-md text-gray-500">{span.name}</div>
        <div className="flex gap-1">
          {span.tags?.map((tag: string) => (
            <div key={tag} className="text-sm text-gray-500 border border-gray-500 rounded-lg px-1">{tag}</div>
          ))}
        </div>
      </div>
      }

      {/* @ts-ignore */}
      <SpanComponent span={span}>
      {/* Render span events */}      
      {span.events.map((ev: any, i: number) => {
        if (ev.eventType === "block" && ev.data) {
          return <BlockContainer key={i} block={ev.data} />;
        }
        if (ev.eventType === "stream" && ev.data) {
          return <BlockContainer key={i} block={ev.data} />;
        }
        if (ev.eventType === "span" && ev.data) {
          return <SpanContainer key={i} span={ev.data} />;
        }
        // For now we skip logs/stream events in user-facing view
        return null;
      })}
      
      </SpanComponent>
    </div>
  );
};
