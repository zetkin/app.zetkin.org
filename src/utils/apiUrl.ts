import stringToBool from "./stringToBool";

export default function apiUrl(path : string) : string {
    const protocol = stringToBool(process.env.NEXT_PUBLIC_APP_USE_TLS)? 'https' : 'http';
    return `${protocol}://${process.env.NEXT_PUBLIC_APP_HOST}/api${path}`;
}