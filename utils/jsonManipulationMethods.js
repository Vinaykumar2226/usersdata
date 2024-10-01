function flattenObject(obj, delimiter = "__", parent = "", res = {}) {
    for (let key in obj) {
        // Check if the property is an object and not null
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively call flattenObject for nested objects
        flattenObject(obj[key], delimiter, parent + key + delimiter, res);
        } else {
        // If it's a primitive value, add it to the result
        res[parent + key] = obj[key];
        }
    }
    return res;
}

function flattenArrayOfObjects(arr, delimiter = "__") {
    return arr.map(obj => flattenObject(obj, delimiter));
}


module.exports = {
    flattenArrayOfObjects: flattenArrayOfObjects,
    flattenObject: flattenObject
}