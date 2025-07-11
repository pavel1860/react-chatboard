import { useRef, useState } from "react";
import classNames from "classnames";

import { Button, ButtonGroup, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Textarea } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { Bot, ChevronDown, User } from "lucide-react";
import { updateVh, useIsLargeScreen, useWindowSize } from "../layout/screenUtils";
import { useChatInputHistory } from "../../hooks/useChatInputHistory";

type Width = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | "10xl" | "full" | "auto" | "fit";

export interface ChatInputProps {
  placeholder: string | undefined;
  width?: Width;
  maxWidth?: Width;
  rows?: number;
  showRole?: boolean;
  isUserDanger?: boolean;
  defaultRole?: string;
  removeFile?: () => void;
  onSubmit: (text: string, role: string) => void;
  dontClear?: boolean;
  bgColor?: string;
  borderColor?: string;
  loading?: boolean;
  textSize?: "sm" | "md" | "lg";
  minRows?: number;
  maxRows?: number;  
  saveHistory?: boolean;
  historyLength?: number; // optional override for max history length
}

export function ChatInput({
  placeholder,
  onSubmit,
  dontClear,
  bgColor,
  borderColor = "#E0E0E0",
  rows = 3,
  minRows = 1,
  maxRows = 10,
  width = "full",
  maxWidth = "4xl",
  showRole = false,
  defaultRole = "user",
  isUserDanger = false,
  loading = false,
  textSize = "md",
  historyLength = 10,
  saveHistory = true,
}: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState(defaultRole);
  const color = role === "user" && isUserDanger ? "danger" : "primary"
  const ref = useRef<HTMLTextAreaElement>(null);

  const {
    value,
    setValue,
    handleKeyDown,
    addToHistory,
    clearHistory,
  } = useChatInputHistory({ maxLength: historyLength });

  const handleEnter = () => {
    if (!value.trim()) return;
    setIsSubmitting(true);
    onSubmit(value, role);
    if (saveHistory) {
      addToHistory(value);
    }
    if (!dontClear) {
      setValue("");
    }
    setTimeout(() => {
      setIsSubmitting(false);
    }, 600);
  };

  const isLargeScreen = useIsLargeScreen();
  const {updateSize} = useWindowSize()

  return (
    <Textarea
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={() => {
        updateSize()
      }}
      onBlur={() => {
        updateSize()
      }}
      classNames={{
        "base": cn(`w-${width}`, maxWidth && `max-w-${maxWidth}`),
        "inputWrapper": 
          cn(
            "border-1 border-gray-200 bg-[#F4F4F5] px-4 py-2 focus-within:border-gray-300 pr-0",              
        ),
        "input": cn("text-gray-900", `text-${textSize}`)          
      }}
      placeholder={placeholder}
      rows={rows}
      minRows={minRows}
      maxRows={maxRows}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleEnter();
        } else {
          if (saveHistory) {
            handleKeyDown(e);
          }
        }
      }}
      endContent={
        <div className="h-full flex flex-col justify-end px-2">
        <ButtonGroup className="">
          <Button
            color={color}
            isDisabled={isSubmitting || loading}
            isIconOnly={!showRole}
            onPress={handleEnter}
            isLoading={isSubmitting || loading}
          >
            <Icon
              icon="solar:plain-linear"
              width={20}
              height={20}
              className="text-white"
            />
            {showRole && role} 
          </Button>

          {showRole && <Dropdown>
            <DropdownTrigger>
              <Button
                className="p-0"
                color={color}
                isDisabled={isSubmitting}
                isIconOnly
                onPress={handleEnter}
                isLoading={isSubmitting}
                endContent={<ChevronDown/>}
              >
                
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
              <DropdownItem
                key="user"              
                onPress={() => setRole("user")}
                startContent={<User />}
              >
                User
              </DropdownItem>
              <DropdownItem
                key="assistant"
                onPress={() => setRole("assistant")}
              startContent={<Bot />}
              >
                Agent
              </DropdownItem>            
            </DropdownMenu>
          </Dropdown>}
        </ButtonGroup>
        </div>
      }
    />
  );
}
