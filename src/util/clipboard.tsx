import { useState } from "react";





export const useCopyToClipboard = (text: string) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }).catch((error) => {
            console.error('Failed to copy text:', error);
        });
    };

    return {
        copied,
        handleCopy,
    }
}
