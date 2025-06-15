import { useCookies } from "react-cookie";
import { useEffect } from "react";

export function useEnsureGuestToken() {
    const [cookies, setCookie] = useCookies(["temp_user_token"]);

    useEffect(() => {
        // Only run in browser
        if (typeof window === "undefined") return;

        const guestToken = cookies.temp_user_token;
        if (!guestToken) {
            // Prevent double-request on fast re-renders
            if ((window as any).__guest_token_requested) return;
            (window as any).__guest_token_requested = true;

            fetch("/api/ai/auth/guest", {
                method: "POST",
                credentials: "include", // To allow server to set cookie if desired
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.guest_token) {
                        // Set cookie for 30 days, on all paths, client-side
                        setCookie("temp_user_token", data.guest_token, {
                            path: "/",
                            maxAge: 30 * 24 * 60 * 60, // 30 days
                            sameSite: "lax",
                            secure: process.env.NODE_ENV === "production",
                        });
                    }
                })
                .finally(() => {
                    (window as any).__guest_token_requested = false;
                });
        }
    }, [cookies, setCookie]);
}
