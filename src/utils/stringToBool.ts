export default function stringToBool(str : string | undefined) : boolean {
    if (!str) {
        return false;
    }

    const n = parseInt(str);

    if (!isNaN(n)) {
        return Boolean(n);
    }
    else {
        return str.toLowerCase() === 'true';
    }
}