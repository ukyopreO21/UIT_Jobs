import dayjs from "dayjs";

export function formatDatetime(dateString: string): string {
    return dayjs(dateString).format("HH:mm:ss DD/MM/YYYY");
}

export function formatDate(dateString: string, format: string = "DD/MM/YYYY"): string {
    return dayjs(dateString).format(format);
}
