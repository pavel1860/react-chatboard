


interface LayoutPromps {
    sidebar: React.ReactNode
    children: React.ReactNode
}


export default function SideBarLayout ({children, sidebar}: LayoutPromps) {
    
    return (
        <div className="flex w-full h-full">
            <div className="w-1/5 border-e-1 h-screen">                    
                {sidebar}
            </div>
            <div className="w-4/5">
            {children}
            </div>
        </div>
    )
}