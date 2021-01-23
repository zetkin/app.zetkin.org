interface OrgHeaderProps {
    org: {
        id: number,
        title: string,
    }
}

export default function OrgHeader({ org } : OrgHeaderProps) : JSX.Element {
    return (
        <header>
            <img
                alt={ org.title }
                style={{
                    height: 'auto',
                    width: '100px',
                }}
                src={ `/api/orgs/${org.id}/avatar` }
            />
            <h1>{ org.title }</h1>
        </header>
    );
}
