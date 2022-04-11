import { ZetkinJourneyMilestone } from '../../../../../../../../src/types/zetkin';

export const AttendMeeting: ZetkinJourneyMilestone = {
  deadline: '2022-06-18T00:29:12+02:00',
  status: 'unfinished',
  title: 'Attend a branch meeting',
};

export const AttendTraining: ZetkinJourneyMilestone = {
  deadline: '2022-05-16T00:29:12+02:00',
  status: 'unfinished',
  title: 'Attend a training',
};

export const MeetBranchSec: ZetkinJourneyMilestone = {
  deadline: '2022-04-20T00:29:12+02:00',
  status: 'unfinished',
  title: 'Meet the branch secretary',
};

const milestones = [AttendMeeting, AttendTraining, MeetBranchSec];

export default milestones;
