"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                {session?.user?.name} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        );
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );
}






// //auth/signin/page.tsx
// 'use client';
// import { getProviders, signIn } from 'next-auth/react';

// export default async function SignIn() {
//     const providers = await getProviders();

//     return (
//         <div>
//             <h1>Sign In</h1>
//             {providers &&
//                 Object.values(providers).map((provider) => (
//                     <div key={provider.name}>
//                         <button
//                             // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                             style={{
//                                 backgroundColor: 'blue',
//                                 color: 'white',
//                                 fontWeight: 'bold',
//                                 padding: '0.5rem 1rem',
//                                 borderRadius: '0.5rem',
//                                 cursor: 'pointer',
                        
//                             }}
//                             onClick={() => signIn(provider.id)}
//                         >
//                             Sign in with {provider.name}
//                         </button>
//                     </div>
//                 ))}
//         </div>
//     );
// }