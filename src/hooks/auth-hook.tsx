import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";




export const createGuestToken = async () => {
    const res = await fetch("/api/ai/auth/guest", {
        method: "POST",
        credentials: "include", // To allow server to set cookie if desired
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    })
    const data = await res.json()
    return data.guest_token
}


export const isGuestTokenIsVaild = async (token: string) => {
    const urlParams = new URLSearchParams()
    urlParams.set("token", token)
    const res = await fetch(`/api/ai/auth/verify_guest_token?${urlParams.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()
    return data.valid
}

export function useEnsureGuestToken(status: "loading" | "authenticated" | "unauthenticated") {
    const [cookies, setCookie] = useCookies(["temp_user_token"]);
    const [isGuestTokenValid, setIsGuestTokenValid] = useState(false);

    useEffect(() => {
        // Only run in browser
        const checkGuestToken = async () => {   
            if (typeof window === "undefined") return;

            let guestToken = cookies.temp_user_token;

            if (guestToken) {
                const valid = await isGuestTokenIsVaild(guestToken)
                if (valid) {
                    setIsGuestTokenValid(valid)
                } else {
                    guestToken = null;
                    setCookie("temp_user_token", null, {
                        path: "/",
                        maxAge: 0,
                    });
                }
            }


            if (!guestToken) {
                // Prevent double-request on fast re-renders
                if ((window as any).__guest_token_requested) return;
                (window as any).__guest_token_requested = true;

                const guestToken = await createGuestToken()
                if (guestToken) {
                            // Set cookie for 30 days, on all paths, client-side
                    setCookie("temp_user_token", guestToken, {
                        path: "/",
                        maxAge: 30 * 24 * 60 * 60, // 30 days
                        sameSite: "lax",
                        secure: process.env.NODE_ENV === "production",
                    });
                }
                (window as any).__guest_token_requested = false;
            }
        }
        if (status === "unauthenticated"){
            checkGuestToken()
        }
        
    }, [status, cookies, setCookie]);
}
