import { RunView } from '../promptEditor/runView';
import { RunsContextProvider } from '../promptEditor/state/runsContext';
import { DagRouterProvider } from '../promptEditor/state/dagRouterContext';


interface TracerViewProps {
    traceId: string
}


export const TracerView = ({ traceId }: TracerViewProps) => {
    return (
        <DagRouterProvider>
            <RunsContextProvider id={traceId}>
                <RunView runId={traceId} />
            </RunsContextProvider>
        </DagRouterProvider>
    )
}