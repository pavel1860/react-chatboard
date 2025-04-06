
interface HeaderParam {
    [key:string]: number | string | null | undefined
}

interface HeaderType {
    [key:string]: string
}

type ContentType = 'json' | 'form'

export const buildHeaders = (headers: HeaderParam, contentType?: ContentType): HeaderType =>{
    const parsedHeaders: HeaderType = {
        ...(headers && Object.entries(headers)
            .filter(([_, value]) => (value != null) && (value != undefined))
            .reduce((acc, [key, value]) => ({
                ...acc,
                [key.toLowerCase()]: String(value)
            }), {}))
    };
    if (contentType === 'json'){
        parsedHeaders['Content-Type'] = 'application/json'
    } else if (contentType === 'form'){
        parsedHeaders['Content-Type'] = 'application/x-www-form-urlencoded'
    } 

    return parsedHeaders
}

