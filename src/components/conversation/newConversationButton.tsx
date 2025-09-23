import { Button } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";


interface NewConversationButtonProps {
    isMutating: boolean;
    isDisabled?: boolean;
    onPress: () => void;
}



export default function NewConversationButton({ onPress, isMutating, isDisabled = false }: NewConversationButtonProps) {

    const [isHovered, setIsHovered] = useState(false);

    

    return (
        <>
            <Button
                isDisabled={isDisabled}
                onPress={onPress}
                onMouseEnter={() => {
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                }}
                isLoading={isMutating}
                variant="light"
                size="md"
                radius="lg"
                className="pl-0"
                startContent={
                    <div
                        className={`w-[40px] h-[40px] rounded-xl flex items-center justify-center ${isHovered ? "bg-transparent" : "bg-[#D4D4D8]"} transition-all duration-300`}
                        >
                        <Icon
                            icon="solar:pen-new-square-linear"
                            width={24}
                            height={24}
                            className="text-white"
                        />
                    </div>
                }
            >
            <span className="font-typography-base-primary font-semibold text-base leading-6 text-[#18181B] pl-2">
                New chat
            </span>
            </Button>

        </>
    )
}