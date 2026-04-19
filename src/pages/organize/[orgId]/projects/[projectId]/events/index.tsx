import { GetServerSideProps } from 'next';

import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, projectId } = ctx.params!;

  if (projectId === 'standalone') {
    return {
      redirect: {
        destination: `/organize/${orgId}/projects/calendar`,
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: `/organize/${orgId}/projects/${projectId}/calendar`,
        permanent: false,
      },
    };
  }
});

export default function NotUsed(): null {
  return null;
}
