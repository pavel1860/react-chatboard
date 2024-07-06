import { useEffect, useRef, useState } from 'react'

function useDebounce<T>(value: T, delay?: number){
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    const [immediateValue, setImmediateValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(immediateValue), delay || 500)

        return () => {
        clearTimeout(timer)
        }
    }, [immediateValue, delay])

    useEffect(() => {
        if (value !== immediateValue){
            const vCopy = JSON.parse(JSON.stringify(value))
            setImmediateValue(value)
        }
            
    }, [value])

    return [
        debouncedValue, 
        (v:T, immidiate?: boolean) => {
            const vCopy = JSON.parse(JSON.stringify(v))
            if (immidiate){
                setDebouncedValue(vCopy)
            } 
            setImmediateValue(vCopy)
        },
        immediateValue
    ] as const
}

export default useDebounce




export const useRefState = <T,>(initialValue: T | (() => T)) => {
    const [value, setValueAux] = useState(initialValue);
    const ref = useRef(value);
    // useEffect(() => {
    //     ref.current = value;
    // }, [value]);
    const setValue = (newValue: T) => {
        setValueAux(newValue);
        ref.current = newValue;
    }
    // useEffect(() => {
    //     if (ref.current !== value) {
    //         setValue(ref.current)
    //     }
    // }, [ref])
    return [value, setValue, ref] as const;
}




export const useMousePosition = (target?: any) => {
    const [
        mousePosition,
        setMousePosition
        ] = useState({ x: null, y: null, clientX: null, clientY: null, pageX: null, pageY: null, offsetX: null, offsetY: null, layerX: null, layerY: null });
    
        useEffect(() => {
            const updateMousePosition = (ev:any) => {
                // console.log(ev)
                if (ev.clientX !== null && ev.clientY !== null){
                    setMousePosition({ x: ev.clientX, y: ev.clientY, clientX: ev.clientX, clientY: ev.clientY, pageX: ev.pageX, pageY: ev.pageY, offsetX: ev.offsetX, offsetY: ev.offsetY, layerX: ev.layerX, layerY: ev.layerY });
                }
            };
            
            if (target) {
                target.addEventListener('mousemove', updateMousePosition);
            } else {
                window.addEventListener('mousemove', updateMousePosition);
            }
        
            return () => {
                if (target){
                    target.removeEventListener('mousemove', updateMousePosition);
                } else {
                    window.removeEventListener('mousemove', updateMousePosition);
                }
                
            };
        }, []);
    
        return mousePosition;
};
