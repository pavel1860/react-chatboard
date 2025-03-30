import { Button, Chip, Link, Navbar, NavbarContent, NavbarItem, Tab, Tabs } from '@nextui-org/react';
import { BrainCog, GitGraph, Boxes } from 'lucide-react';
import { useSideView } from '../../stores/layout-store';
// import { useSideView } from '../../stores/chat-store';






export const TopAdminBar = () => {

    const { sideView, setSideView } = useSideView()

    return (
        <Navbar height = '30px' isBordered >
            <NavbarContent>
                <NavbarItem isActive={sideView === "artifact-view"} >
                    <Button isIconOnly variant='light' color={sideView === "artifact-view" ? 'primary' : 'default'} radius='sm' size='sm' onClick={() => setSideView("artifact-view")}>
                        <Boxes />
                    </Button>
                    
                </NavbarItem>
                <NavbarItem isActive={sideView === "tracer-view"} >
                    {/* <Link href="/ziggi/tracer">Tracer</Link> */}
                    <Button isIconOnly variant='light' color={sideView === "tracer-view" ? 'primary' : 'default'} radius='sm' size='sm' onClick={() => setSideView("tracer-view")}>
                        <BrainCog />
                    </Button>                    
                </NavbarItem>
                <NavbarItem isActive={sideView === "version-tree"} >
                    <Button isIconOnly variant='light' color={sideView === "version-tree" ? 'primary' : 'default'} radius='sm' size='sm' onClick={() => setSideView("version-tree")}>
                        <GitGraph />
                    </Button>
                </NavbarItem>
                
            </NavbarContent>
        </Navbar>
    )
}

