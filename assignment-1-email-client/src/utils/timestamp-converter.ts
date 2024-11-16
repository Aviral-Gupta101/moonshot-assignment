import unixTimestamp from "unix-timestamp";

export function formatTimestamp(timestamp: number) {
    const timestampInSeconds = Math.floor(timestamp / 1000);

    const date = unixTimestamp.toDate(timestampInSeconds);

    let formattedDate = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    formattedDate = formattedDate.replace(',', '');

    const finalFormattedDate = formattedDate.replace(/(\s)(AM|PM)/i, (_, space, ampm) => {
        return ampm.toLowerCase();
    });

    return finalFormattedDate;
}