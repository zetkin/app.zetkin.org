import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { orgId, campId, taskId } = ctx.query;

  return {
    redirect: {
      destination: `/organize/${orgId}/projects/${campId}/tasks/${taskId}`,
      permanent: false,
    },
  };
};

export default function NotUsed(): null {
  return null;
}
