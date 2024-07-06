
import { useGetRuns } from '@/services/chatboard-service';
import { useEffect, useState } from 'react';




const getRuns = async () => {
    const res = await axios.post(
        "/ai/get_runs",
        {
            name:"test"
        }
    )
    return res.data
}



export const useRuns = () => {

    const [runs, setRuns] = useState<any[]>([])

    // const [getRuns, RunsStatus] = useLazyQuery(GET_RUNS, {
    //    variables: {
    //           limit: 10,
    //           offset: 0
    //      }
    // })
    

    // const { data, error } = useSWR(`/api/data?${queryString}`, fetcher);
    const {data, error, isLoading} = useGetRuns(10,0, ["test"])


    // useEffect(() => {
    //     // getRuns().then((runs) => {
    //     //     setRuns(runs)
    //     // })
    //     getRuns({
    //         variables: {
    //             limit: 10,
    //             offset: 0
    //         }
    //     })
    // }, [])
    
    return {
        // runs: RunsStatus.data?.runs
        runs: data?.runs
    }
}