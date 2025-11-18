const unflattenObject = (data) => {
    const result = {};
    for (const key in data) {
        const match = key.match(/(\w+)\[(\d+)\]\[(\w+)\](?:\[(\d+)\])?/);

        if (match) {
            const [, root, index, prop, subIndex] = match;

            if (!result[root]) result[root] = [];

            const idx = parseInt(index);
            if (!result[root][idx]) result[root][idx] = {};

            if (subIndex !== undefined) {
                if (!result[root][idx][prop]) result[root][idx][prop] = [];
                result[root][idx][prop][parseInt(subIndex)] = data[key];
            } else {
                result[root][idx][prop] = data[key];
            }
        } else {
            result[key] = data[key];
        }
    }
    return result;
};

export default unflattenObject;
