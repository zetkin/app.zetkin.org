import { Box } from '@mui/material';
import { FC } from 'react';
import { GetServerSideProps } from 'next';

import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useAddAssignee from 'features/areas/hooks/useAddAssignee';
import useAssignees from 'features/areas/hooks/useAssignees';
import ZUIFutures from 'zui/ZUIFutures';
import { useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import zuiMessageIds from 'zui/l10n/messageIds';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import ZUIPerson from 'zui/ZUIPerson';
import usePerson from 'features/profile/hooks/usePerson';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

const Assignee: FC<{ id: number; orgId: number }> = ({ id, orgId }) => {
  const person = usePerson(orgId, id).data;
  if (!person) {
    return null;
  }
  return (
    <ZUIPerson id={id} name={`${person?.first_name} ${person?.last_name}`} />
  );
};

interface CanvassAssignmentPageProps {
  orgId: string;
  canvassAssId: string;
}

const CanvassAssignmentPage: PageWithLayout<CanvassAssignmentPageProps> = ({
  orgId,
  canvassAssId,
}) => {
  const zuiMessages = useMessages(zuiMessageIds);
  const messages = useMessages(messageIds);

  const addAssignee = useAddAssignee(parseInt(orgId), canvassAssId);
  const canvassAssignmentFuture = useCanvassAssignment(
    parseInt(orgId),
    canvassAssId
  );

  const assigneesFuture = useAssignees(parseInt(orgId), canvassAssId);
  return (
    <ZUIFutures
      futures={{
        assignees: assigneesFuture,
        canvassAssignment: canvassAssignmentFuture,
      }}
    >
      {({ data: { canvassAssignment, assignees } }) => {
        return (
          <Box>
            <ZUIPersonSelect
              onChange={(person) => addAssignee(person.id)}
              placeholder={messages.canvassAssignment.addAssignee()}
              selectedPerson={null}
              submitLabel={zuiMessages.createPerson.submitLabel.assign()}
              title={zuiMessages.createPerson.title.assignToCanvassAssignment({
                canvassAss:
                  canvassAssignment.title ||
                  messages.canvassAssignment.empty.title(),
              })}
              variant="outlined"
            />
            <Box>
              Assignees
              {assignees.map((assignee) => (
                <Assignee
                  key={assignee.id}
                  id={assignee.id}
                  orgId={parseInt(orgId)}
                />
              ))}
            </Box>
          </Box>
        );
      }}
    </ZUIFutures>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
