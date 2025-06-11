import { useState } from "react";
import classNames from "classnames";

import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Textarea } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { Bot, ChevronDown, User } from "lucide-react";

export interface ChatInputProps {
  placeholder: string | undefined;
  width?: string;
  rows?: number;
  showRole?: boolean;
  isUserDanger?: boolean;
  defaultRole?: string;
  removeFile?: () => void;
  onSubmit: (text: string, role: string) => void;
  dontClear?: boolean;
  bgColor?: string;
  borderColor?: string;
}

export function ChatInput({
  placeholder,
  onSubmit,
  dontClear,
  bgColor,
  borderColor = "#E0E0E0",
  rows = 3,
  width = "100%",
  showRole = false,
  defaultRole = "user",
  isUserDanger = false,
}: ChatInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [role, setRole] = useState(defaultRole);
  const color = role === "user" && isUserDanger ? "danger" : "primary"

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
    }, 600);
  };

  return (
    <div
      className="m-3 w-full p-10"
    >
      <Textarea
        value={text}
        // variant="bordered"
        onChange={(e) => setText(e.target.value)}
        classNames={{
          "inputWrapper": "border-1 border-gray-200 bg-[#F4F4F5] px-4 py-2 focus-within:border-gray-300",
          "input": "text-gray-900"
        }}
        
        // className={classNames(
        //   "mx-auto text-left font-normal leading-5 text-gray-900",
        //   {
        //     "mt-10": rows === 1,
        //   }
        // )}
        disabled={isSubmitting}
        placeholder={placeholder}
        // style={{
        //   backgroundColor: bgColor,
        // }}
        rows={rows}
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
              isDisabled={isSubmitting}
              isIconOnly
              onPress={handleEnter}
              isLoading={isSubmitting}
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
    </div>
  );
}
