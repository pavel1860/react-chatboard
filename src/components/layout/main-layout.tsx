import { Button, Navbar, NavbarBrand, Tab, Tabs } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface LayoutProps {
    color?: string
    children: React.ReactNode;
}

export const Layout = ({ children, color }: LayoutProps) => {
    return (
        <div 
            // className={`flex h-screen w-full overflow-hidden ${color ? `bg-[${color}]` : ''}`}
            className={`bg-background flex h-screen w-full overflow-hidden`}
        >
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



export const MainViewLayout = ({ children, color }: LayoutProps) => {
    return (
        <div
            className="flex-grow w-6/12 h-full overflow-auto p-4"
            style={{ backgroundColor: color }}
        >
            {children}
        </div>
    );
};

export const SideViewLayout = ({ children, color }: LayoutProps) => {
    return (
        <div
            className="w-4/12 h-full overflow-auto p-4"
            style={{ backgroundColor: color }}
        >
            {children}
        </div>
    );
};

export const SideBarLayout = ({ children, color }: LayoutProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <motion.div
            animate={{
                width: isOpen ? "16.666667%" : "40px",
                transition: { duration: 0.3 }
            }}
            className="h-full overflow-hidden border-r-1.5 border-gray-300 relative pt-5"
            style={{ backgroundColor: color }}
        >
            <motion.div
                animate={{
                    opacity: isOpen ? 1 : 0,
                    transition: { duration: 0.2 }
                }}
                className="p-4 overflow-auto"
            >
                {children}
            </motion.div>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? (
                    <ChevronLeft size={20} />
                ) : (
                    <ChevronRight size={20} />
                )}
            </motion.button>
        </motion.div>
    );
};


interface SideNavBarProps {
    color?: string
    items: {
        label: string
        icon: React.ReactNode
        component: React.ReactNode
    }[]
}


export const SideNavBar = ({ color, items }: SideNavBarProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
            <motion.div
                animate={{
                    width: isOpen ? "16.666667%" : "60px",
                    transition: { duration: 0.3 }
                }}
                className="h-full overflow-hidden border-r-1.5 border-gray-300 relative pt-5 flex"
                style={{ backgroundColor: color }}
            >
                <div className="flex flex-col gap-2 pt-10">  
                    <Tabs size="sm"aria-label="Options" isVertical onSelectionChange={(key) => setSelectedIndex(key)} defaultSelectedKey={0}>
                        {items.map((item, index) => (
                            <Tab key={index} title={item.icon}/>                                
                        ))}
                    </Tabs>
                </div>

                <motion.div
                    animate={{
                        opacity: isOpen ? 1 : 0,
                        transition: { duration: 0.2 }
                    }}
                    className="p-4 overflow-auto"
                >
                    {items[selectedIndex].component}
                </motion.div>

                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isOpen ? (
                        <ChevronLeft size={20} />
                    ) : (
                        <ChevronRight size={20} />
                    )}
                </motion.button>
            </motion.div>
        
    );
};






export const Wrapper = ({ children, color = "#FFFFFF" }: LayoutProps) => {
    return (
        <div
            className="rounded-lg border-1 border-gray-200 shadow-sm p-3"
            style={{ backgroundColor: color }}
        >
            {children}
        </div>
    );
};