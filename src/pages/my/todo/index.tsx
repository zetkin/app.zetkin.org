import { FC } from 'react';
import { scaffold } from 'utils/next';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type PageProps = void;

const Page: FC<PageProps> = () => {
  return <h1>Todo page for currently signed in user</h1>;
};

export default Page;
