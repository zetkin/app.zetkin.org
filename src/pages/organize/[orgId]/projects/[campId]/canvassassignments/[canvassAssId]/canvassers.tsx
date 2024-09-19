import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';

import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useCanvassSessions from 'features/areas/hooks/useCanvassSessions';
import ZUIPerson from 'zui/ZUIPerson';
import { ZetkinCanvassSession } from 'features/areas/types';
import { ZetkinPerson } from 'utils/types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

type Props = {
  canvassAssId: string;
  orgId: string;
};

const CanvassAssignmentPage: PageWithLayout<Props> = ({
  orgId,
  canvassAssId,
}) => {
  const allSessions =
    useCanvassSessions(parseInt(orgId), canvassAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === canvassAssId
  );
  const sessionByPersonId: Record<
    number,
    {
      person: ZetkinPerson;
      sessions: ZetkinCanvassSession[];
    }
  > = {};

  sessions.forEach((session) => {
    if (!sessionByPersonId[session.assignee.id]) {
      sessionByPersonId[session.assignee.id] = {
        person: session.assignee,
        sessions: [session],
      };
    } else {
      sessionByPersonId[session.assignee.id].sessions.push(session);
    }
  });

  return (
    <Box>
      {Object.values(sessionByPersonId).map(({ sessions, person }, index) => {
        return (
          <Box key={index} alignItems="center" display="flex" gap={1}>
            <ZUIPerson
              id={person.id}
              name={`${person.first_name} ${person.last_name}`}
            />
            <Box>{sessions.length}</Box>
          </Box>
        );
      })}
    </Box>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
