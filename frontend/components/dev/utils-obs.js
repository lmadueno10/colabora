const capStr = (string = "") => {
    let str = string && string.length > 0 ? string.toLowerCase() : "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const Utils = {
    capStr
};

export default Utils;