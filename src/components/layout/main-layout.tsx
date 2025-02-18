import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            {children}
        </div>
    );
};

export const MainViewLayout = ({ children }: LayoutProps) => {
    return (
        <div className="flex-grow w-[60%] h-full overflow-auto">
            {children}
        </div>
    );
};

export const SideViewLayout = ({ children }: LayoutProps) => {
    return (
        <div className="w-[30%] h-full overflow-auto">
            {children}
        </div>
    );
};

export const SideBarLayout = ({ children }: LayoutProps) => {
    return (
        <div className="w-[10%] h-full overflow-auto">
            {children}
        </div>
    );
};



