export default function stringToBool(str : string) : boolean {
    const n = parseInt(str);

    if (!isNaN(n)) {
        return Boolean(n);
    }
    else {
        return str.toLowerCase() === 'true';
    }
}