import { useRouter } from 'next/navigation';
import * as nextNavigation from 'next/navigation';
export default function useSearchParams() {
    const pathname = nextNavigation.usePathname();
    const searchParams = nextNavigation.useSearchParams();
    const router = useRouter();
    return {
        searchParams,
        // setSearchParam: (key: string, value: string | null) => {
        //     const params = new URLSearchParams(searchParams.toString())
        //     if (value === null) {
        //         params.delete(key)
        //     } else {
        //         params.set(key, value)
        //     }
        //     router.push(pathname + '?' + params.toString())
        // },
        setSearchParams: (newParams) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(newParams).forEach(([key, value]) => {
                if (value === null) {
                    params.delete(key);
                }
                else {
                    params.set(key, value);
                }
            });
            router.push(pathname + '?' + params.toString());
        }
    };
}
//# sourceMappingURL=search-params-hook.js.map