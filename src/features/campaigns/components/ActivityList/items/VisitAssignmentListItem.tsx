import { FC } from 'react';
import { MeetingRoom, Person } from '@mui/icons-material';

import { VisitAssignmentActivity } from 'features/campaigns/types';
import ActivityListItem from './ActivityListItem';
import useVisitAssignment from 'features/visitassignments/hooks/useVisitAssignment';
import useVisitAssignees from 'features/visitassignments/hooks/useVisitAssignees';
import getStatusColor from 'features/campaigns/utils/getStatusColor';
import getVisitAssignees from 'features/visitassignments/utils/getVisitAssignee';

type Props = {
  activity: VisitAssignmentActivity;
  orgId: number;
  vaId: number;
};

const VisitAssignmentListItem: FC<Props> = ({ orgId, vaId, activity }) => {
  const { data: assignment } = useVisitAssignment(orgId, vaId);
  const allSessions = useVisitAssignees(orgId, vaId).data || [];
  const sessions = allSessions.filter((session) => session.visitAssId === vaId);

  if (!assignment) {
    return null;
  }

  const visitAssignees = getVisitAssignees(sessions);
  const color = getStatusColor(activity.visibleFrom, activity.visibleUntil);

  return (
    <ActivityListItem
      color={color}
      endNumber={visitAssignees.length}
      href={`/organize/${orgId}/projects/${
        assignment?.campaign.id ?? 'standalone'
      }/visitassignments/${vaId}`}
      PrimaryIcon={MeetingRoom}
      SecondaryIcon={Person}
      title={assignment?.title || ''}
    />
  );
};

export default VisitAssignmentListItem;
