export type MixedJsonArray = (string | MixedJsonArray)[];

// JSON Array -> String (để hiển thị lên Textarea)
export const formatMixedJsonToText = (data: MixedJsonArray | undefined): string => {
    if (!data || !Array.isArray(data)) return "";
    const lines: string[] = [];
    data.forEach((item) => {
        if (typeof item === "string") lines.push(item);
        else if (Array.isArray(item)) {
            item.forEach((subItem) => {
                if (typeof subItem === "string") lines.push(`- ${subItem}`);
                else if (Array.isArray(subItem)) {
                    subItem.forEach((subSubItem) => {
                        if (typeof subSubItem === "string") lines.push(`+ ${subSubItem}`);
                    });
                }
            });
        }
    });
    return lines.join("\n");
};

// String -> JSON Array (để lưu vào State/DB)
export const parseTextToMixedJson = (text: string): MixedJsonArray => {
    if (!text) return [];
    const lines = text.split("\n");
    const root: MixedJsonArray = [];
    let currentL1: MixedJsonArray | null = null;
    let currentL2: MixedJsonArray | null = null;

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (line.startsWith("+ ")) {
            if (!currentL1) {
                currentL1 = [];
                root.push(currentL1);
            }
            if (!currentL2) {
                currentL2 = [];
                currentL1.push(currentL2);
            }
            currentL2.push(line.substring(2));
        } else if (line.startsWith("- ")) {
            currentL2 = null;
            if (!currentL1) {
                currentL1 = [];
                root.push(currentL1);
            }
            currentL1.push(line.substring(2));
        } else {
            currentL1 = null;
            currentL2 = null;
            root.push(trimmed);
        }
    });
    return root;
};
