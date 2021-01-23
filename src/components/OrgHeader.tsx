interface OrgHeaderProps {
    org: {
        id: number,
        title: string,
    }
}

export default function OrgHeader({ org } : OrgHeaderProps) : JSX.Element {
    return (
        <header>
            <h1>{ org.title }</h1>
        </header>
    );
}
