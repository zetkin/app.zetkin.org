import Header from 'features/campaigns/components/ProjectPage/Header';
import { FC } from 'react';
import { scaffold } from 'utils/next';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { campId, orgId } = ctx.params!;

  return {
    props: {
      campId,
      orgId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  campId: string;
  orgId: string;
};

const Page: FC<PageProps> = ({ orgId, campId }) => {
  return (
    <>
      <Header campId={campId} orgId={orgId} />
    </>
  );
};

export default Page;
