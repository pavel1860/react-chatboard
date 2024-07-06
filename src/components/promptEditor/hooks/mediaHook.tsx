import React, { useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link'
import useSWRMutation from 'swr/mutation';
import useDebounce from './helperHooks';


const fetcher = (url: string) => fetch(url).then((res) => res.json())



async function deleteMediaRequest(url: string, { arg }: { arg: { media_id: string }}) {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ media_id: arg.media_id}),
      headers: {
        'Content-Type': 'application/json'
      },
    })
}

async function editMediaRequest(url: string, { arg }: { arg: { media_id: string, metadata: any }}) {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ media_id: arg.media_id, metadata: arg.metadata}),
      headers: {
        'Content-Type': 'application/json'
      },
    })
}



export const useMedia = () => {


    const [searchText, setSearchText] = React.useState('')
    const [ debaunceSearchText, setDebaunceSearchText ] = useDebounce(searchText, 1000);

    const [proConFilters, setProConFilters] = React.useState([{
        value: 'israelis',
        checked: false,
    },
    {
        value: 'palestinians',
        checked: false,
    }])

    const [typeFilters, setTypeFilters] = React.useState([{
        value: 'photo',
        checked: false,
    },
    {
        value: 'concept',
        checked: false,
    },
    {
        value: 'text',
        checked: false,
    },
    {
        value: 'map',
        checked: false,
    },
    {
        value: 'comics',
        checked: false,
    }])

    const [userEditedFilter, setUserEditedFilter] = React.useState([{
        value: 'edited',
        checked: false,
    },
    {
        value: 'not edited',
        checked: false,
    }
    ])

    const [queryParams, setQueryParams] = React.useState({})

    useEffect(() => {
        const params = new URLSearchParams();
        if (debaunceSearchText !== ''){
            // params.set('text', encodeURIComponent(debaunceSearchText))
            params.set('text', debaunceSearchText)
        }
        const activeProConFilters = proConFilters.filter((filter: any) => filter.checked).map((f: any) => f.value)
        if (activeProConFilters.length > 0){
            params.set('pro_con', activeProConFilters.join(',')) 
        }
        const activeTypeFilters = typeFilters.filter((filter: any) => filter.checked).map((f: any) => f.value)
        if (activeTypeFilters.length > 0){
            params.set('media_type', activeTypeFilters.join(',')) 
            
        }
        const activeUserEditedFilter = userEditedFilter.filter((filter: any) => filter.checked).map((f: any) => f.value)
        if (activeUserEditedFilter.length == 1){
            params.set('user_edited', activeUserEditedFilter[0] == 'edited' ? 'true' : 'false')
        }
        setQueryParams(params)
        // console.log("$$$$$$$$$$$", params)
        // console.log("$$$$$>>>>", activeProConFilters.join(','))
        // console.log("$$$$$>>>>", activeTypeFilters.join(','))
        // console.log("$$$$$$$$$$$", new URLSearchParams(params).toString())

    }, [typeFilters, proConFilters, userEditedFilter, debaunceSearchText])

    // const { data, mutate, error, isLoading } = useSWR(debaunceSearchText !== '' ? `/ai/get_media?text=${encodeURIComponent(debaunceSearchText)}`: `/ai/get_media`, fetcher)
    const { data, mutate, error, isLoading } = useSWR(`/ai/get_media?${new URLSearchParams(queryParams).toString()}`, fetcher)

    const [selectedMedia, setSelectedMedia] = React.useState(null)

    const deleteMediaStatus = useSWRMutation('/ai/delete_media', deleteMediaRequest)

    const editMediaStatus = useSWRMutation('/ai/edit_media', editMediaRequest)

    

    const onMediaSelect = (media: any) => {
        setSelectedMedia(media)
    }

    const deleteMedia = (media: any) => {
        deleteMediaStatus.trigger({ media_id: media.id })
        mutate()
    }

    const editMedia = (media: any, metadata: any) => {
        metadata['user_edited'] = true
        editMediaStatus.trigger({ media_id: media.id, metadata: metadata })
        mutate()        
    }

    useEffect(() => {
        if (selectedMedia && data){
            //@ts-ignore
            const media = data.find((m: any) => m.id == selectedMedia.id)
            if (media){
                setSelectedMedia(media)    
            } else {
                setSelectedMedia(null)            
            }
        }
    }, [data])
    
    return {
        loading: isLoading || deleteMediaStatus.isMutating || editMediaStatus.isMutating,
        proConFilters,
        setProConFilters,
        typeFilters,
        setTypeFilters,
        userEditedFilter, 
        setUserEditedFilter,
        searchText, 
        setSearchText,
        data,
        selectedMedia,
        onMediaSelect,
        deleteMedia,
        editMedia,
        error,
    }
}