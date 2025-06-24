import { useRef, useState } from "react";
import classNames from "classnames";

import { Button, ButtonGroup, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Textarea } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { Bot, ChevronDown, User } from "lucide-react";

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
}

export function ChatInput({
  placeholder,
  onSubmit,
  dontClear,
  bgColor,
  borderColor = "#E0E0E0",
  rows = 3,
  minRows = 3,
  maxRows = 10,
  width = "full",
  maxWidth = "3xl",
  showRole = false,
  defaultRole = "user",
  isUserDanger = false,
  loading = false,
  textSize = "md",
}: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [role, setRole] = useState(defaultRole);
  const color = role === "user" && isUserDanger ? "danger" : "primary"
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleEnter = () => {
    if (!text.trim()) return;

    setIsSubmitting(true);
    onSubmit(text, role);
    if (!dontClear) {
      setText("");
    }
    
    // Simulate async delay for UX (adjust as needed)
    setTimeout(() => {
      setIsSubmitting(false);
      // ref.current?.focus();
    }, 600);
  };

  return (
    // <div
    //   className="w-full"
    // >
      <Textarea
        ref={ref}
        value={text}
        // variant="bordered"
        onChange={(e) => setText(e.target.value)}
        classNames={{
          "base": cn(`w-${width}`, maxWidth && `max-w-${maxWidth}`),
          "inputWrapper": 
            cn(
              "border-1 border-gray-200 bg-[#F4F4F5] px-4 py-2 focus-within:border-gray-300 pr-0",              
          ),
          "input": cn("text-gray-900", `text-${textSize}`)          
        }}
        // className={classNames(          
        //   {
        //     "mt-10": rows === 1,
        //   }
        // )}
        // className={classNames(
        //   "border-1 border-gray-200 rounded-lg mx-auto text-left font-normal leading-5 text-gray-900",
        //   {
        //     "mt-10": rows === 1,
        //   }
        // )}
        // disabled={isSubmitting}
        placeholder={placeholder}
        // style={{
        //   backgroundColor: bgColor,
        // }}
        // rows={rows}
        minRows={minRows}
        maxRows={maxRows}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleEnter();
          }
        }}
        endContent={
          <ButtonGroup className="mr-2 mb-2">
            <Button
              color={color}
              isDisabled={isSubmitting || loading}
              isIconOnly
              onPress={handleEnter}
              isLoading={isSubmitting || loading}
            >

              <Icon
                icon="solar:plain-linear"
                width={20}
                height={20}
                className="text-white"
              />

            </Button>

            {showRole && <Dropdown>
              <DropdownTrigger>
                <Button
                  className="p-0"
                  color={color}
                  isDisabled={isSubmitting}
                  // isIconOnly
                  onPress={handleEnter}
                  isLoading={isSubmitting}
                  // className="w-16"
                  endContent={<ChevronDown/>}
                >
                  {role} 
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
        }
      />
    // </div>
  );
}
