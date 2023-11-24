import { FC } from 'react';
import { scaffold } from 'utils/next';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { eventId, orgId } = ctx.params!;

  return {
    props: {
      eventId,
      orgId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  eventId: string;
  orgId: string;
};

const Page: FC<PageProps> = ({ orgId, eventId }) => {
  return (
    <h1>
      Page for org {orgId}, event {eventId}
    </h1>
  );
};

export default Page;
