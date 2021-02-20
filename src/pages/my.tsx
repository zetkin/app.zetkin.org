import { GetServerSideProps } from "next";
import { ZetkinUser } from '../interfaces/ZetkinUser';
import { scaffold } from "../utils/next";

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const user = await context.z.resource('users', 'me').get();

    return {
        props: {
            user: user.data.data,
        }
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