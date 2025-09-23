import { Avatar, Button, Card, CardBody, Divider } from "@heroui/react"

import MarkdownEditor from "../../components/promptEditor/editors/markdownEditor"
import { MessageType, ChoiceType } from "../../services/turnService"
import { ToolCall } from "../../components/chat/schema"
import { StreamingContent } from "./streamingContent"


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
      {/* {showChoices &&
        onChoice &&
        message.choices?.choices.length &&
        message.choices?.choices.length > 0 && (
          <Choices message={message} onChoice={onChoice} />
        )} */}
    </div>
  );
};
