import { useArtifact } from '../../stores/chat-store';
import { Button, Navbar, NavbarBrand, Tab, Tabs } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import VersionTree from '../tree/version-tree';

import React, { useState } from 'react';
import { TopAdminBar } from './admin-bar';
import { useSideView } from '../../stores/layout-store';
import { TestCaseNewForm } from '../testing/test-case/test-case-new-form';
import { TracerView } from '../traces/tracer-view';

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



interface MainViewLayoutProps extends LayoutProps {
    closable?: boolean
    onClose?: () => void
}

export const MainViewLayout = ({ children, color, closable = false, onClose }: MainViewLayoutProps) => {

    return (
        <div
            className="flex-grow w-6/12 h-full overflow-auto p-4 "
            style={{ backgroundColor: color }}
        >
            <div className="relative">
            {closable && (
                <div className="absolute top-10 right-2 z-60">
                    <Button isIconOnly variant='light' color='default' radius='sm' size='sm' onClick={onClose}>
                        <X />
                    </Button>
                </div>
            )}
            </div>
            {children}
            
        </div>
    );
};


interface ArtifactViewLayoutProps {
    children: (artifactView: string | null | undefined, setArtifactView: (artifactView: string) => void, artifactId: number | null | undefined, artifactType: string | null | undefined) => React.ReactNode
    showAdminBar?: boolean
    color?: string
}

export const ArtifactViewLayout = ({ children, showAdminBar = false, color = "#EFF1F3"   }: ArtifactViewLayoutProps) => {

    const { artifactView, setArtifactView, artifactId, setArtifactId, artifactType, setArtifactType } = useArtifact()
    const { sideView, setSideView, traceId, setTraceId } = useSideView()

    return (
        <MainViewLayout color={color} closable={artifactView !== null} onClose={() => {
            setArtifactView(null)
            setArtifactId(null)
            setArtifactType(null)
        }}>
            {showAdminBar && <TopAdminBar />}
            {sideView === "test-case" && <TestCaseNewForm />}
            {sideView === "version-tree" && <Wrapper><VersionTree /></Wrapper>}
            {sideView === "tracer-view" && traceId && <Wrapper><TracerView traceId={traceId} /></Wrapper>}
            {sideView === "artifact-view" && artifactView && children(artifactView, setArtifactView, artifactId, artifactType)}
        </MainViewLayout>
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