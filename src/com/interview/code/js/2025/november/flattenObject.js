function flattenObject(obj) {
    let result = [];

    for (let key in obj) {
        result.push(key); // add key

        if (typeof obj[key] === "object") {
            // if value is object → flatten recursively
            result = result.concat(flattenObject(obj[key]));
        } else {
            result.push(obj[key]); // add value if primitive
        }
    }

    return result;
}

const a = { b: "tested", c: { d: "1", e: "2", f: "3" } };

console.log(flattenObject(a));
