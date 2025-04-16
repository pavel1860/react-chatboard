import React from 'react'
import { useRunList, RUN_NAMES } from './state/runsContext'
import Link from 'next/link'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { useLayout } from './state/promptLayoutContext'




interface RunsListProps {
    selectedRun?: string,
}

const sanitizeFilename = (filename: string) => {
    return filename.replace('.jinja2', '').replace('.jinja', '')
}


export const RunList = ({selectedRun}: RunsListProps) => {

    const {runList, error, runNamesFilter, setRunNamesFilter} = useRunList()

    const {openRunId} = useLayout()

    const selectedValue = React.useMemo(
        () => runNamesFilter.size ? Array.from(runNamesFilter).join(", ").replaceAll("_", " ") : 'All Runs',
        [runNamesFilter]
    );

    const runListComps = []
    if (runList){
        let prevDate = undefined
        for (let run of runList){
            const dateObject = new Date(run.start_time);
            const timeStr = dateObject.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, second: 'numeric' })
            let topBorder = ""
            if (prevDate === undefined){
                prevDate = dateObject
            } else {
                //@ts-ignore
                let difference = Math.abs(dateObject - prevDate);
                let minutesDifference = difference / (1000 * 60);
                // console.log('minutesDifference: ', minutesDifference, 'diff:', difference, timeStr)
                if (minutesDifference > 5){
                    topBorder = "border-t-3"
                }
                // console.log('borderSize: ', borderSize)
                prevDate = dateObject
            }

            const backgroundColor = selectedRun == run.id ? 'bg-slate-100 rounded-lg border-r-5 border-r-blue-400' : ''
            
            runListComps.push(
                <li key={run.id} className={`border-b-1 ${topBorder} hover:rounded-lg ${backgroundColor} hover:bg-slate-200 ${selectedRun == run.id ? 'list-disk' : ''}`}>
                    <Link 
                        className={`flex-2 ${selectedRun == run.id ? 'text-rose-400' : ''}`} 
                        href={`/traces/${run.id}`}>
                        {run.name.slice(0,14)}
                    </Link>
                    <span className='flex-1 text-xs px-2 text-gray-500'>{timeStr}</span>
                    {/* {openRunId == run.id && <span className='flex-1 text-xs px-2 text-white bg-blue-500 rounded-md'>open</span>} */}
                    {(run.error !== null) && <span className='flex-1 text-xs px-2 text-white bg-red-500 rounded-md'>error</span>}
                    {run.extra?.rag_index && <span className='flex-1 text-xs px-2 text-white bg-purple-500 rounded-md'>{run.extra?.rag_index}</span>}
                    <div>
                    {run.extra?.system_filename && <span className='flex-1 text-xs px-2 text-black bg-orange-300 rounded-md'>{sanitizeFilename(run.extra?.system_filename)}</span>}
                    {run.extra?.user_filename && <span className='flex-1 text-xs px-2 text-black bg-orange-200 rounded-md'>{sanitizeFilename(run.extra?.user_filename)}</span>}
                    <div>
                        <span className='text-[9px] text-slate-500'>{run.id}</span>
                    </div>
                    </div>
                </li>
            )
        }
    }

    return (
        <>
        <div className=''>
            <Dropdown  >
                <DropdownTrigger>
                    <Button 
                        // variant="ghost" 
                        className="bg-custom-gradient text-white"
                        // className="capitalize"
                        // color=''
                    >
                    {selectedValue}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Multiple selection example"
                    variant="flat"
                    closeOnSelect={false}
                    selectionMode="multiple"
                    selectedKeys={runNamesFilter}
                    onSelectionChange={setRunNamesFilter as any}
                >
                    {RUN_NAMES.map((name: string) => (<DropdownItem key={name}>{name}</DropdownItem>))}                                        
                </DropdownMenu>
            </Dropdown>


        </div>
        <ul className='list-none h-full'>
            {runListComps}
            {/* {runList && runList.map((run: any) => {

            const dateObject = new Date(run..start_time);

            const timeStr = dateObject.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, second: 'numeric' })
            return (
            <li key={run.id} className={`border-b-1 hover:rounded-lg hover:bg-slate-200 ${selectedRun == run.id ? 'list-disk' : ''}`}>
                <Link 
                    className={`flex-2 ${selectedRun == run.id ? 'text-rose-400' : ''}`} 
                    href={`/prompt_editor/${run.id}`}>
                    {run.name.slice(0,14)}
                </Link>
                <span className='flex-1 text-xs px-2 text-gray-500'>{timeStr}</span>
                {openRunId == run.id && <span className='flex-1 text-xs px-2 text-white bg-blue-500 rounded-md'>open</span>}
                {(run..error !== null) && <span className='flex-1 text-xs px-2 text-white bg-red-500 rounded-md'>error</span>}
                {run.extra?.rag_index && <span className='flex-1 text-xs px-2 text-white bg-purple-500 rounded-md'>{run.extra?.rag_index}</span>}                
            </li>)})} */}
        </ul>
        </>
    )
}


