import { useChatboard } from '../../state/chatboard-state'
import React from 'react'
import Link from 'next/link'




export const AssetNavBar = () => {


    const {
        metadata,
    } = useChatboard()

    return (
        <div className='w-full p-5 flex'>
            {
                metadata.assets.map((asset, i)=>{
                    return (
                        <Link key={i} href={`/assets/${asset.name}`} className='px-4'>
                            <div className='text-purple-500'>
                            {asset.name}
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}