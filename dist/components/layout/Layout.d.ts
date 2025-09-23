import { ReactNode } from "react";
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
declare const Layout: ({ children, className, header, layoutProps, extra, }: LayoutProps) => import("react/jsx-runtime").JSX.Element;
export default Layout;
//# sourceMappingURL=Layout.d.ts.map