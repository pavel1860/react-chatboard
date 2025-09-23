// type TimeZoneName = "short" | "long";
const DEFAULT_DATE_OPTIONS = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
};
export function formatDateTime(date, options = undefined) {
    const options_ = { ...DEFAULT_DATE_OPTIONS };
    if (options) {
        Object.entries(options).forEach(([key, value]) => {
            if (value === null) {
                delete options_[key];
            }
            else {
                // @ts-ignore
                options_[key] = value;
            }
        });
    }
    return date.toLocaleDateString('en-US', options_);
}
//# sourceMappingURL=time.js.map