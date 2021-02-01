import Head from 'next/head';
import { Content, Heading } from '@adobe/react-spectrum';

export default function Home() : JSX.Element {
    return (
        <>
            <Head>
                <title>Zetkin</title>
            </Head>
            <Content>
                <Heading level={ 1 }>This will become Zetkin</Heading>
            </Content>
        </>
    );
}