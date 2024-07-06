







export const TimelineView = ({state}: any) =>{

    
    const maxLayer = state.elements.reduce((acc: number, el: any) =>  el.layer > acc ? el.layer : acc, 0)
    const numOfFrames = state.frames.length
    const collisions: any = []
    const elementLoopkup = state.elements.reduce((acc: any, el: any) => {
        el.frames.forEach((f: any) => {
            if (acc[`${f}_${el.layer}`]){
                collisions.push({
                    element: el,
                    position: `${f}_${el.layer}`
                })
            }
            acc[`${f}_${el.layer}`] = el
        })
        return acc
        }, {})
    const frameComponents = []
    for (let f = 0; f < numOfFrames; f++){
        const layers = []
        for (let l = 0; l < maxLayer + 1 ; l++){
            const el = elementLoopkup[`${f}_${l}`]
            if (el){
                let color = 'bg-yellow-200'
                if (el.color && el.text){
                    //TextOverlay
                    color = 'bg-red-200'
                } else if (el.color){
                    //Background
                    color = 'bg-purple-200'
                } else if (el.media && el.prompt){
                    //CutOut
                    color = 'bg-green-200'
                } else if (el.media && el.search_term){
                    //StockClip
                    color = 'bg-blue-200'
                }
                layers.push(
                    <div key={l} className={`h-[20px] w-[30px] ${color} border-1 border-black`}>
                        {el && el.element_id}
                    </div>
                )    
            } else {
                layers.push(
                    <div key={l} className='h-[20px] w-[30px] bg-gray-200 border-1 border-black'>
                        {el && el.element_id}
                    </div>
                )    
            }            
        }
        frameComponents.push(
            // <div key={f} className='flex flex-col space-x-2'>
            <div key={f} className='flex flex-col'>
                {layers}
            </div>
        )
    }

    return (
        <div>
            collisions: {collisions.length} elements: {state.elements.length} 
            <div className='flex space-x-1'>
            {collisions.map((c: any, i: number) => <div key={i}>{c.position}</div>)}
            </div>
        <div className='flex'>
            {frameComponents}
        </div>
        </div>
    )
}
