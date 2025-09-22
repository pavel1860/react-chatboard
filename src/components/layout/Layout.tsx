// components/Layout.tsx
import { ReactNode } from "react";
import SidebarDrawer from "./SidebarDrawer";
import { useSession } from "next-auth/react";
import AdminSideBarDrawer from "./AdminSideBarDrawer";
import {
  AdminConversationLayout,
  ConversationLayout,
} from "../conversation/conversationLayout";
import { usePathname } from "next/navigation";
import { cn } from "@heroui/react";
import { useCtx } from "../../providers/ctx-provider";

export interface LayoutProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  layoutProps?: {
    hideFooter?: boolean;
    noneArtifact?: boolean;
  };
  extra?: ReactNode;
}

const Layout = ({
  children,
  className = "",
  header,
  layoutProps,
  extra,
}: LayoutProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { partitionId } = useCtx();
  // @ts-ignore
  const isAdminMode = session?.user?.is_admin && pathname?.includes("/admin");
  if (layoutProps?.noneArtifact) {
    return (
      <div className={cn("lg:flex lg:min-h-screen", className)}>
        {extra}
        {/* Sidebar */}
        <div className="hidden lg:block w-14 h-full">
          {isAdminMode ? <AdminSideBarDrawer /> : <SidebarDrawer />}
        </div>
        <div className="h-full w-14 lg:hidden">
          {/* <FilterDrawer /> */}
        </div>
        {/* Main Content */}
        <main className="flex-1 h-full">{children}</main>
      </div>
    );
  }

  if (isAdminMode) {
    return (
      <AdminConversationLayout
        extra={extra}
        sidebar={<AdminSideBarDrawer />}
        // @ts-ignore
        header={header && header()}
        hideFooter={layoutProps?.hideFooter || !partitionId}
      >
        {children}
      </AdminConversationLayout>
    );
  } else {
    return (
      <ConversationLayout
        extra={
          <div>
            {extra}
          </div>
        }
        sidebar={<SidebarDrawer />}
        // header={header ? (typeof header === "function" ? header() : header) :null}
        // @ts-ignore
        header={header && header()}
        // header={header}
        hideFooter={layoutProps?.hideFooter || !partitionId}
      >
        {children}
      </ConversationLayout>
    );
  }
};

export default Layout;