import dayjs from "dayjs";

function formatDate(dateString: string): string {
    return dayjs(dateString).format("HH:mm:ss DD/MM/YYYY");
}

export default formatDate;
