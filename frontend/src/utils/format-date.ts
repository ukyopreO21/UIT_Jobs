import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDatetime(dateString: string): string {
    return dayjs.utc(dateString).local().format("HH:mm:ss DD/MM/YYYY");
}

export function formatDate(dateString: string, format: string = "DD/MM/YYYY"): string {
    return dayjs.utc(dateString).local().format(format);
}

export function formatDateToISOWithOffset(dateStr: string, timeStr: string = "00:00:00"): string {
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
        timeStr = `${timeStr}:00`;
    }

    if (!/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
        throw new Error("Invalid time format. Expected HH:mm or HH:mm:ss");
    }

    const d = new Date(`${dateStr}T${timeStr}`);

    const offsetMinutes = -d.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const hh = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0");
    const mm = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");

    return `${dateStr}T${timeStr}${sign}${hh}:${mm}`;
}
