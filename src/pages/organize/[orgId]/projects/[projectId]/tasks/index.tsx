import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { orgId, projectId } = ctx.query;

  return {
    redirect: {
      destination: `/organize/${orgId}/projects/${projectId}`,
      permanent: false,
    },
  };
};

export default function NotUsed(): null {
  return null;
}
