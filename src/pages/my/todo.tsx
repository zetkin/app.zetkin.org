import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';

import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';
import UserHomeLayout from '../../components/layout/UserHomeLayout';

const scaffoldOptions = {
    localeScope: [
        'layout.userHome',
        'misc.publicHeader',
        'pages.my.toDo',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async () => {
    return {
        props: {},
    };
}, scaffoldOptions);

const Todo : PageWithLayout = () => {
    return (
        <Heading level={ 1 }>
            <Msg id="pages.my.toDo.heading"/>
        </Heading>
    );
};

Todo.getLayout = function getLayout(page) {
    return (
        <UserHomeLayout>
            { page }
        </UserHomeLayout>
    );
};

export default Todo;