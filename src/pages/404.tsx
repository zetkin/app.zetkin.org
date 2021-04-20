import { getMessages } from '../utils/locale';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FormattedMessage as Msg } from 'react-intl';
import { Content, Flex, Heading, Link } from '@adobe/react-spectrum';

export const getStaticProps: GetStaticProps = async () => {
    const lang = 'en';
    const messages = await getMessages(lang, [
        'pages.404',
        'misc.publicHeader',
    ]);
    return {
        props: { lang, messages },
    };
};

export default function Custom404() : JSX.Element {
    return (
        <>
            <Head>
                <title>Zetkin</title>
            </Head>
            <Content>
                <Flex
                    alignItems="center"
                    direction="column"
                    height="size-6000"
                    justifyContent="center">
                    <Heading level={ 1 }>
                        <Msg id="pages.404.pageNotFound"/>
                    </Heading>
                    <Link>
                        <a href="/">
                            <Msg id="pages.404.backToHomePage"/>
                        </a>
                    </Link>
                </Flex>
            </Content>
        </>
    );
}