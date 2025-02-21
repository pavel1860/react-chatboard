import { Button } from "@nextui-org/react"
import { useSession, signIn, signOut } from "next-auth/react"


interface LoginBtnProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "solid" | "light" | "flat" | "faded" | "bordered" | "shadow" | "ghost";
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}


export default function LoginBtn({ className, size = "md", variant = "solid", color = "default" }: LoginBtnProps) {
    const { data: session } = useSession()
    if (session) {
        return (
            <div className={`flex flex-row gap-2 items-center ${className}`}>
                Signed in as {session.user?.email} <br />
                <Button onPress={() => signOut()} size={size} variant={variant} color={color}>Sign out</Button>
            </div>
        )
    }
    return (
        <div className={`flex flex-row gap-2 items-center ${className}`}>
            Not signed in <br />
            <Button onPress={() => signIn()} size={size} variant={variant} color={color}>Sign in</Button>
        </div>
    )
}