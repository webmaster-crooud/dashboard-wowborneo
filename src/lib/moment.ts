export const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "";

    const dateObj = date instanceof Date ? date : new Date(date || "");

    return new Intl.DateTimeFormat("en-EN", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(dateObj);
};

export const formatDateOnly = (date: Date | string | undefined): string => {
    if (!date) return "";

    const dateObj = date instanceof Date ? date : new Date(date || "");

    return new Intl.DateTimeFormat("en-EN", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(dateObj);
};
