import { FC } from 'react';
import { Hiking, Person } from '@mui/icons-material';

import { VisitAssignmentActivity } from 'features/campaigns/types';
import ActivityListItem from './ActivityListItem';
import useVisitAssignment from 'features/visitassignments/hooks/useVisitAssignment';
import useVisitAssignees from 'features/visitassignments/hooks/useVisitAssignees';
import getStatusColor from 'features/campaigns/utils/getStatusColor';

type Props = {
  activity: VisitAssignmentActivity;
  orgId: number;
  vaId: number;
};

const VisitAssignmentListItem: FC<Props> = ({ orgId, vaId, activity }) => {
  const { data: assignment } = useVisitAssignment(orgId, vaId);

  const visitAssignees = useVisitAssignees(orgId, vaId).data || [];

  if (!assignment) {
    return null;
  }

  const color = getStatusColor(activity.visibleFrom, activity.visibleUntil);

  return (
    <ActivityListItem
      color={color}
      endNumber={visitAssignees.length}
      href={`/organize/${orgId}/projects/${
        assignment?.campaign.id ?? 'standalone'
      }/visitassignments/${vaId}`}
      PrimaryIcon={Hiking}
      SecondaryIcon={Person}
      title={assignment?.title || ''}
    />
  );
};

export default VisitAssignmentListItem;
