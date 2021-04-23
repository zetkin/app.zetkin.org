import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';

import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';

const scaffoldOptions = {
    localeScope: [
        'layout.my',
        'misc.publicHeader',
        'pages.myTodo',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async () => {
    return {
        props: {},
    };
}, scaffoldOptions);

const MyTodoPage : PageWithLayout = () => {
    return (
        <Heading level={ 1 }>
            <Msg id="pages.myTodo.heading"/>
        </Heading>
    );
};

MyTodoPage.getLayout = function getLayout(page) {
    return (
        <MyHomeLayout>
            { page }
        </MyHomeLayout>
    );
};

export default MyTodoPage;