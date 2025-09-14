import { Button } from "@heroui/react";
import { LayoutHeader } from "./conversationLayout";
import { useLayout } from "react-chatboard/src/hooks/layout-hook";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useStore } from "react-chatboard/src/store/useStore";


export const MarketPlaceHeader = () => {
  const { setIsSidebarOpen } = useLayout();
  const { data: session, status } = useSession();
  const { onAuthOpenChange } = useStore();

  const handleSignUp = () => {
    onAuthOpenChange(true);
  };
  const isAuthenticated = status === "authenticated";
  return (
    <LayoutHeader
      startContent={
        <>
          {isAuthenticated ? (
            <Button
              onPress={() => setIsSidebarOpen(true)}
              className="px-2 lg:hidden"
              variant="light"
              isIconOnly
            >
              <Icon icon="solar:siderbar-linear" width={24} height={24} />
            </Button>
          ) : (
            <>
              <Image
                src="/Logo.svg"
                alt="Logo"
                width={66.16}
                height={28}
                className="hidden sm:block ml-2"
              />
              <Image
                src="/Icon.svg"
                alt="Logo"
                width={40}
                height={40}
                className=" sm:hidden ml-2"
              />
            </>
          )}
        </>
      }
      endContent={
        isAuthenticated ? (
          <></>
        ) : (
          <Button
            variant="solid"
            color="primary"
            size="md"
            radius="md"
            className="h-[36px]"
            onPress={handleSignUp}
          >
            Sign Up
          </Button>
        )
      }
    >
      <div className="flex flex-row items-center justify-center gap-2 w-fit px-3">
        <span className="flex flex-row items-center justify-left gap-2 font-medium">
          <Icon
            icon="mdi:home-search-outline"
            width={24}
            height={24}
            color="blue"
            className="bg-primary-50 rounded-full w-[40px] h-[40px] p-1"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-default-500 text-md">
              Marketplace
            </span>
            <span className="text-default-500 text-[10px] md:text-xs">
              Search Properties
            </span>
          </div>
        </span>
      </div>
    </LayoutHeader>
  );
};
