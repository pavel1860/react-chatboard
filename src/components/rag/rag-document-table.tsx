import { ClassParametersType } from "@/src/state/rag-state2";
import { IRagSpaces } from "../../services/chatboard-service";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import {useAsyncList} from "@react-stately/data";

import { useRag } from "../../state/rag-state";
import Link from "next/link";
import { JSONTree } from 'react-json-tree'
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import React, { useEffect } from "react";



interface RagDocumentTableProps {
    namespace: IRagSpaces
    metadata: any
    classParameters: ClassParametersType
    data: any
}



const getTableDataComponent = (value: any, type: string) => {

    if (type == 'object' || type == 'array'){
        return <JSONTree data={value} />
    }
    return value
}



export default function RagDocumentTable({ namespace, metadata, classParameters, data }: RagDocumentTableProps) {




    return (
        <div>
            
        </div>
    )
}