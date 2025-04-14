import { Button, ButtonGroup, Chip, Link, Navbar, NavbarContent, NavbarItem, Tab, Tabs } from '@nextui-org/react';
import { BrainCog, GitGraph, Boxes, PanelLeft, Columns2, PanelRight } from 'lucide-react';
import { useVersionHead } from "../../model/hooks/artifact-head-hooks";
import { useArtifact } from "../../stores/chat-store";
import { useSideView, useViews } from '../../stores/layout-store';
import { useState } from 'react';
// import { useSideView } from '../../stores/chat-store';






export const TopAdminBar = () => {

    const { sideView, setSideView } = useSideView()
    const { leftFlex, setLeftFlex, rightFlex, setRightFlex } = useViews()
    const { branchId, partitionId, turnId } = useVersionHead()
    const { artifactView, setArtifactView, artifactId, setArtifactId, artifactType, setArtifactType } = useArtifact()


    return (
        <Navbar height = '30px' isBordered >
            <NavbarContent>
                {branchId && <Chip className="text-sm" variant="dot" size='sm'>branch {branchId}</Chip>}
                {turnId && <Chip className="text-sm" variant="dot" size='sm'>turn {turnId}</Chip>}
                { partitionId && <Chip className="text-sm" variant="dot" size='sm'>partition {partitionId}</Chip>}
                { artifactId && <Chip className="text-sm" variant="dot" size='sm'>Artifact {artifactId}</Chip>}
                { artifactView && <Chip className="text-sm" variant="dot" size='sm'>View {artifactView}</Chip>}
            </NavbarContent>
            <NavbarContent>
                <ButtonGroup>
                    <Button 
                        isIconOnly 
                        variant='light' 
                        color='default' 
                        size='sm' 
                    startContent={<PanelLeft />}
                    onClick={() => {
                        setLeftFlex(1)
                        setRightFlex(3)
                    }}
                />
                <Button 
                    isIconOnly 
                    variant='light' 
                    color='default' 
                    size='sm' 
                    startContent={<Columns2 />}
                    onClick={() => {
                        setLeftFlex(1)
                        setRightFlex(1)
                    }}
                />
                <Button 
                    isIconOnly 
                    variant='light' 
                    color='default' 
                    size='sm' 
                    startContent={<PanelRight />}
                    onClick={() => {
                        setLeftFlex(3)
                        setRightFlex(1)
                    }}
                    />
                </ButtonGroup>
            </NavbarContent>
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

