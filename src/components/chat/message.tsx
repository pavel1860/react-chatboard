import { Avatar, Button, Card, CardBody, Divider } from "@heroui/react"
import Choices from "../../../../src/components/chat/choices/choices"
import MarkdownEditor from "react-chatboard/src/components/promptEditor/editors/markdownEditor"
import { PropertySearchToolCall } from "../../../../src/components/chat/tool-calls/PropertySearchToolCall"
import { MessageType, ChoiceType } from "@/services/turnService"
import { ToolCall } from "react-chatboard/src/components/chat/schema"
import { StreamingContent } from "./streamingContent"


const FRONT_TOOL_CALLS = new Set([
  "ChangeUserView",
  "PresentAvatarTool",
  "PropertySearchTool",
]);

function renderToolCalls(toolCalls: ToolCall[]) {
  console.log(toolCalls);
  return toolCalls
    .filter((tc) => FRONT_TOOL_CALLS.has(tc.name))
    .map((tc) => {
      if (tc.name === "PropertySearchTool") {
        return <PropertySearchToolCall toolCall={tc} />;
      }
    });
}

interface MessageProps {
  message: MessageType;
  avatar?: string | null;
  index: number;
  showChoices?: boolean;
  isStreaming?: boolean;
  onChoice?: (choice: ChoiceType) => void;
}

export const Message = ({
  message,
  index,
  showChoices = false,
  onChoice,
  avatar,
  isStreaming,
}: MessageProps) => {
  return (
    <div className="ml-4">
      {avatar && message.role === "assistant" && (
        <div className="relative top-9 -left-6">
          <Avatar size="sm" src={`/images/avatars/${avatar}.png`} />
        </div>
      )}
      <Card
        shadow="none"
        className={`py-0 ${
          message.role === "assistant"
            ? "bg-transparent"
            : "bg-default-200 mr-3 w-max min-w-20 ml-auto"
        }`}
      >
        <CardBody className="py-0">
          {/* {message.content} */}
          <div className="whitespace-pre-wrap break-words">
            {isStreaming ? <StreamingContent /> : 
            <MarkdownEditor
              text={message.content}
              onChange={() => {}}
              notEditable={true}
            />
            }
            
            
          </div>
        </CardBody>
      </Card>
      {/* {renderToolCalls(message.toolCalls)} */}
      {showChoices &&
        onChoice &&
        message.choices?.choices.length &&
        message.choices?.choices.length > 0 && (
          <Choices message={message} onChoice={onChoice} />
        )}
    </div>
  );
};
