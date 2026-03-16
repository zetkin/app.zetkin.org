import { ZetkinCallAssignment } from 'utils/types/zetkin';

export default function getCallAssignmentUrl(
  callAssignment: ZetkinCallAssignment | null
) {
  if (callAssignment) {
    return `/organize/${callAssignment.organization.id}/projects/${
      callAssignment.project ? `${callAssignment.project.id}` : 'standalone'
    }/callassignments/${callAssignment.id}`;
  } else {
    return '';
  }
}
