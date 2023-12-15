import { ZetkinCallAssignment } from 'utils/types/zetkin';

export default function getCallAssignmentUrl(
  callAssignment: ZetkinCallAssignment | null
) {
  if (callAssignment) {
    return `/organize/${callAssignment.organization.id}/projects/${
      callAssignment.campaign ? `${callAssignment.campaign.id}` : 'standalone'
    }/callassignments/${callAssignment.id}`;
  } else {
    return '';
  }
}
