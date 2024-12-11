import cc from "classcat"


interface LayoutPromps {
    navbar?: React.ReactNode
    leftSidebar: React.ReactNode
    rightSidebar: React.ReactNode
    children: React.ReactNode
    screenStyle?: string    
    wrapperStyle?: string
    contentStyle?: string
    sidebarStyle?: string
}


export default function SideBarLayout ({children, navbar, leftSidebar, rightSidebar, screenStyle, wrapperStyle, contentStyle, sidebarStyle}: LayoutPromps) {
    
    return (
        <div className={cc([
            "w-screen h-screen fixed flex flex-col",
            screenStyle
        ])}>            
            <div className={cc([
                // `flex bottom-0 right-0 left-0 top-0 absolute`,
                `flex relative flex-1 overflow-hidden`,
                wrapperStyle
            ])}>
                <aside className={cc([
                    // `w-1/5 border-e-1 bottom-0`,
                    `w-3/12 border-e-1.5 h-full`,
                    sidebarStyle
                ])}>
                    {leftSidebar}
                </aside>
                <main className={cc([
                    // "w-6/12 h-full flex flex-col",
                    "w-6/12 h-full flex flex-col",
                    contentStyle
                ])}>
                    {navbar}
                    {children}
                </main>
                <aside className={cc([
                    "w-3/12 border-l-1.5 h-full",
                ])}>
                    {rightSidebar}
                </aside>
            </div>
        </div>
    )
    // return (
    //     <div className={`w-screen h-screen fixed`}>
    //         {navbar}
    //         <div className={`flex bottom-0 right-0 left-0 top-0 absolute`}>
    //             <div className={`w-1/5 border-e-1 bottom-0`}>
    //                 {sidebar}
    //             </div>
    //             <div className="w-4/5">
    //             {children}
    //             </div>
    //         </div>
    //     </div>
    // )
}