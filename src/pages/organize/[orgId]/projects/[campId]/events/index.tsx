import { GetServerSideProps } from 'next';
import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    redirect: {
      destination: '../calendar',
      permanent: false,
    },
  };
});

export default function NotUsed(): null {
  return null;
}
