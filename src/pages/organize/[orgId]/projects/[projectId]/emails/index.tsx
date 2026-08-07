import { GetServerSideProps } from 'next';

import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, projectId } = ctx.params!;
  return {
    redirect: {
      destination: `/organize/${orgId}/projects/${projectId}`,
      permanent: false,
    },
  };
});

export default function NotUsed(): null {
  return null;
}
