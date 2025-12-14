import axios from "axios";
import { toast } from "react-hot-toast";

const defaultErrorMessage = "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";

export default function handleError(error: unknown): void {
    let errorMessage = defaultErrorMessage;
    if (axios.isAxiosError(error) && error.response) errorMessage = error.response.data?.error;
    toast.error(errorMessage);
}
