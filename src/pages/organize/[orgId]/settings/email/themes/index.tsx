import { GetServerSideProps } from 'next';

import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;
  return {
    redirect: {
      destination: `/organize/${orgId}/settings/email`,
      permanent: false,
    },
  };
});

export default function NotUsed(): null {
  return null;
}
