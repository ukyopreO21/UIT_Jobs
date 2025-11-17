import dayjs from "dayjs";

export function formatDatetime(dateString: string): string {
    return dayjs(dateString).format("HH:mm:ss DD/MM/YYYY");
}

export function formatDate(dateString: string): string {
    return dayjs(dateString).format("DD/MM/YYYY");
}
