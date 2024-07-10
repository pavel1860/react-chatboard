
import { useGetRuns } from '../../../services/chatboard-service';




export const useRuns = () => {

    const { data, error, isLoading} = useGetRuns(10,0, ["test"])
    
    return {
        // runs: RunsStatus.data?.runs
        runs: data?.runs
    }
}