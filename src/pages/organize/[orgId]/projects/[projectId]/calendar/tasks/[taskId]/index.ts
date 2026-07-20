import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { orgId, projectId, taskId } = ctx.query;

  return {
    redirect: {
      destination: `/organize/${orgId}/projects/${projectId}/tasks/${taskId}`,
      permanent: false,
    },
  };
};

export default function NotUsed(): null {
  return null;
}
