import { BrainCircuit, FileText, LibraryBig } from "lucide-react"
import { useState } from "react"
import { LsRun, RetrieverRun, RunContainer } from "./types"
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { JsonState } from "../promptEditor/stateJsonView"




export function RetrieverForm({ run }: { run: RetrieverRun }) {


    return (
        <div>
            <JsonState data={run.inputs} />
            {run.documents?.map((doc) =>
                <div className="p-2">
                    <div>
                    <span className="text-[10px]">{doc.id} </span>
                    <span className="text-xs rounded-sm bg-green-300 px-1">{doc.score} </span>
                    </div>
                    <p>
                        {doc.content}
                    </p>
                </div>
            )}
        </div>
    )
}







export function RetrieverCard({ run }: { run: RetrieverRun }) {

    const [isExpanded, setIsExpanded] = useState(false)
    console.log("asfdsafs")
    return (
        <RunContainer onClick={() => setIsExpanded(!isExpanded)}>
            {/* <LibraryBig /> */}
            <div className="flex">
                <FileText />
                {run.name} <span className="text-xs rounded-sm bg-pink-300 px-1">{run.run_type}</span>
            </div>

            {/* {isExpanded && run.documents?.map((doc) =>
                <div>
                    <span className="text-[10px]">{doc.id} </span>
                    <span className="text-xs rounded-sm bg-green-300 px-1">{doc.score} </span>
                </div>
            )} */}
            <Drawer
                open={isExpanded}
                // open={true}
                onClose={() => {
                    setIsExpanded(false)
                    // setRunId(null)
                }}
                direction='right'
                className='bg-red-300'
                // size={1200}
                size={"70%"}

            >
                <RetrieverForm run={run}/>

            </Drawer>


        </RunContainer>
    )
}

