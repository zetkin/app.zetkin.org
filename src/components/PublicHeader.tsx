interface PublicHeaderProps {
    userData: {
        avatar: string;
        first_name: string;
        id: number;
        last_name: string;
    }
}

const PublicHeader = ({ userData } : PublicHeaderProps) : JSX.Element => {
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
                { !userData ? <button data-test='login-button'>Login</button> : null }
                { userData ? 
                    <div style={{ alignItems: 'center', display: 'flex' }}>
                        <p>{ userData.first_name } { userData.last_name }</p>
                        <img 
                            data-test='user-avatar'
                            alt='User avatar' 
                            src={ userData.avatar }
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