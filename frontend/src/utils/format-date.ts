import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDatetime(dateString: string): string {
    return dayjs.utc(dateString).format("HH:mm:ss DD/MM/YYYY");
}

export function formatDate(dateString: string, format: string = "DD/MM/YYYY"): string {
    return dayjs.utc(dateString).format(format);
}
