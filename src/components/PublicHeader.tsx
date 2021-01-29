interface PublicHeaderProps {
    user: {
        first_name: string;
        id: number;
        last_name: string;
    }
}

const PublicHeader = ({ user } : PublicHeaderProps) : JSX.Element => {
    return (
        <header>
            <div style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem'
            }}>
                <img
                    data-test='zetkin-logotype'
                    alt='Zetkin logo'
                    src='/logo-zetkin.png'
                    height={ 33 }
                    width={ 40 }
                />
                { !user ? <button data-test='login-button'>Login</button> : null }
                { user ?
                    <div style={{ alignItems: 'center', display: 'flex' }}>
                        <p>{ user.first_name } { user.last_name }</p>
                        <img 
                            data-test='user-avatar'
                            alt='User avatar' 
                            src={ `/api/users/${user.id}/avatar` }
                            style={{
                                height: '40px',
                                marginLeft: '1rem',
                                width: 'auto'
                            }}
                        />
                    </div>
                    : null }
            </div>
        </header>
    );
};

export default PublicHeader;