import { Navbar, NavbarBrand } from '@nextui-org/react';
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



export const NavBarLayout = ({ children }: LayoutProps) => {
    return (
        <Navbar>
            {children}
            {/* <NavbarBrand>
                
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href="#">
                        Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent> */}
        </Navbar>
    );
};



export const MainViewLayout = ({ children }: LayoutProps) => {
    return (
        <div className="flex-grow w-6/12 h-full overflow-auto">
            {children}
        </div>
    );
};

export const SideViewLayout = ({ children }: LayoutProps) => {
    return (
        <div className="w-4/12 h-full overflow-auto">
            {children}
        </div>
    );
};

export const SideBarLayout = ({ children }: LayoutProps) => {
    return (
        <div className="w-3/12 h-full overflow-auto">
            {children}
        </div>
    );
};



