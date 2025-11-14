import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { orgId, campId } = ctx.query;

  return {
    redirect: {
      destination: `/organize/${orgId}/projects/${campId}`,
      permanent: false,
    },
  };
};

export default function NotUsed(): null {
  return null;
}
