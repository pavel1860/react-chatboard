import cc from "classcat"


interface LayoutPromps {
    navbar?: React.ReactNode
    leftView: React.ReactNode
    rightView: React.ReactNode
    // children: React.ReactNode
    screenStyle?: string    
    wrapperStyle?: string
    leftStyle?: string
    rightStyle?: string
}


export default function SplitLayout ({navbar, leftView, rightView, screenStyle, wrapperStyle, leftStyle, rightStyle}: LayoutPromps) {
    
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
                <main className={cc([
                    // "w-6/12 h-full flex flex-col",
                    "w-7/12 h-full flex flex-col",
                    leftStyle
                ])}>
                    {navbar}
                    {leftView}
                </main>
                <aside className={cc([
                    "w-5/12 border-l-1.5 h-full",
                    rightStyle
                ])}>
                    {rightView}
                </aside>
            </div>
        </div>
    )
}