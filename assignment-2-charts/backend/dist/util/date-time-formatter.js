"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimestamp = exports.convertDayToTimestamp = void 0;
/**
 *
 * @param dateString Date string in DD/MM/YYYY Format
 * @returns timestamp or Nan if the date is invalid.
 */
function convertDayToTimestamp(dateString) {
    const [day, month, year] = dateString.split('/');
    const formatedDate = `${year}/${month}/${day}`;
    return new Date(formatedDate).getTime();
}
exports.convertDayToTimestamp = convertDayToTimestamp;
/**
 *
 * @param timestamp Timestamp
 * @returns Date in format (16 Nov 24)
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    // Extract components using Intl.DateTimeFormat for locale sensitivity
    const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
    const year = new Intl.DateTimeFormat("en-US", { year: "2-digit" }).format(date);
    return `${day} ${month} ${year}`;
}
exports.formatTimestamp = formatTimestamp;
