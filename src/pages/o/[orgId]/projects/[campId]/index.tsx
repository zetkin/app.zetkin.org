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

// event-listing-a 

const Page: FC<PageProps> = ({ orgId, campId }) => {
  return (
    <h1>
      Page for org {orgId}, project {campId} ☭
    </h1>
  );
};

export default Page;
