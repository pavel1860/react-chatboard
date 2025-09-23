import * as nextNavigation from 'next/navigation';
export default function useSearchParams(): {
    searchParams: nextNavigation.ReadonlyURLSearchParams;
    setSearchParams: (newParams: Record<string, string | null>) => void;
};
//# sourceMappingURL=search-params-hook.d.ts.map