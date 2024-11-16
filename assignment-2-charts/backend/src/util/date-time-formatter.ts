
/**
 * 
 * @param dateString Date string in DD/MM/YYYY Format
 * @returns timestamp or Nan if the date is invalid. 
 */
export function convertDayToTimestamp(dateString: string): number {

    const [day, month, year] = dateString.split('/');
    const formatedDate = `${year}/${month}/${day}`;

    return new Date(formatedDate).getTime();
}

/**
 * 
 * @param timestamp Timestamp
 * @returns Date in format (16 Nov 24)
 */
export function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp);

    // Extract components using Intl.DateTimeFormat for locale sensitivity
    const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
    const year = new Intl.DateTimeFormat("en-US", { year: "2-digit" }).format(date);

    return `${day} ${month} ${year}`;
}
