import { FC } from 'react';
import { scaffold } from 'utils/next';
import EventListing from 'features/campaigns/components/ProjectPage/ProjectEventListing';


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
  campId: number;
  orgId: number;
};

// event-listing-a 

const Page: FC<PageProps> = ({ orgId, campId }) => {
  return (
    <h1>
      Page for org {orgId}, project {campId}
      <EventListing campId={campId} orgId={orgId}></EventListing>
    </h1>
  );
};

export default Page;
