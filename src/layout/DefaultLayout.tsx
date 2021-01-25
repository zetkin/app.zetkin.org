import { FunctionComponent } from 'react';
import Link from 'next/link';

const DefaultLayout : FunctionComponent = ({ children }) => (
    <>
        <header>
            <div style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem'
            }}>
                <img
                    src='/logo-zetkin.png'
                    alt='Zetkin logo'
                    width={ 40 }
                    height={ 33 }
                />
                <div style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Link href='/'>
                        <a>Organize</a>
                    </Link>
                    <div style={{ marginLeft: '20px' }}>
                        <img
                            src='/user-avatar.png'
                            alt='User avatar'
                            width={ 40 }
                            height={ 40 }
                        />
                    </div>
                </div>
            </div>
        </header>
        <div>{ children }</div>
    </>
);

export default DefaultLayout;