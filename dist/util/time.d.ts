interface FormatDateTimeOptions {
    weekday?: "narrow" | "short" | "long" | null;
    year?: "numeric" | "2-digit" | null;
    month?: "numeric" | "2-digit" | "narrow" | "short" | "long" | null;
    day?: "numeric" | "2-digit" | null;
    hour?: "numeric" | "2-digit" | null;
    minute?: "numeric" | "2-digit" | null;
    hour12?: boolean;
}
export declare function formatDateTime(date: Date, options?: FormatDateTimeOptions | undefined): string;
export {};
//# sourceMappingURL=time.d.ts.map