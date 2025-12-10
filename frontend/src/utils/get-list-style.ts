export default function getListStyle(level: number) {
    switch (level % 3) {
        case 0:
            return "list-disc";
        case 1:
            return "list-[circle]";
        case 2:
            return "list-[square]";
        default:
            return "list-disc";
    }
}
