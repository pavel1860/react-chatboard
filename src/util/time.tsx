
interface FormatDateTimeOptions {
    weekday?: "narrow" | "short" | "long" | null;
    year?: "numeric" | "2-digit" | null;
    month?: "numeric" | "2-digit" | "narrow" | "short" | "long" | null;
    day?: "numeric" | "2-digit" | null;
    hour?: "numeric" | "2-digit" | null;
    minute?: "numeric" | "2-digit" | null;
    hour12?: boolean;
}
// type TimeZoneName = "short" | "long";

const DEFAULT_DATE_OPTIONS = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
}

export function formatDateTime(date: Date, options: FormatDateTimeOptions | undefined = undefined) {
    const options_ = { ...DEFAULT_DATE_OPTIONS };

    if (options) {
        Object.entries(options).forEach(([key, value]) => {
            if (value === null) {
                delete options_[key as keyof FormatDateTimeOptions];
            } else {
                // @ts-ignore
                options_[key as keyof FormatDateTimeOptions] = value;
            }
        });
    }
    return date.toLocaleDateString('en-US', options_ as any);
}
