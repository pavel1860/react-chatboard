export const buildHeaders = (headers, contentType) => {
    const parsedHeaders = {
        ...(headers && Object.entries(headers)
            .filter(([_, value]) => (value != null) && (value != undefined))
            .reduce((acc, [key, value]) => ({
            ...acc,
            [key.toLowerCase()]: String(value)
        }), {}))
    };
    if (contentType === 'json') {
        parsedHeaders['Content-Type'] = 'application/json';
    }
    else if (contentType === 'form') {
        parsedHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return parsedHeaders;
};
//# sourceMappingURL=utils.js.map