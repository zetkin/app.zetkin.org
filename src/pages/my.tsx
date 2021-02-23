import { GetServerSideProps } from 'next';
import { scaffold } from '../utils/next';
import { ZetkinUser } from '../interfaces/ZetkinUser';

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const user = await context.z.resource('users', 'me').get();

    return {
        props: {
            user: user.data.data,
        },
    };
});

interface MyPageProps {
    user: ZetkinUser;
}

export default function MyPage({ user } : MyPageProps) : JSX.Element {
    return (
        <h1>Hello, { user.first_name }</h1>
    );
}