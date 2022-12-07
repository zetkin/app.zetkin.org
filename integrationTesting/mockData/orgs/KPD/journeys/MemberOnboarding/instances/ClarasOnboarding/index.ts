import ActivistTag from '../../../../tags/Activist';
import AngelaDavis from '../../../../people/AngelaDavis';
import ClaraZetkin from '../../../../people/ClaraZetkin';
import KPD from '../../../..';
import MemberOnboarding from '../..';
import PlaysGuitarTag from '../../../../tags/PlaysGuitar';
import {
  ZetkinJourneyInstance,
  ZetkinJourneyMilestoneStatus,
} from 'utils/types/zetkin';

// Milestones
export const AttendMeeting: ZetkinJourneyMilestoneStatus = {
  completed: null,
  deadline: '2022-06-18T00:29:12+02:00',
  description: '',
  id: 1,
  title: 'Attend a branch meeting',
};

const AttendTraining: ZetkinJourneyMilestoneStatus = {
  completed: null,
  deadline: '2022-05-16T00:29:12+02:00',
  description: '',
  id: 2,
  title: 'Attend a training',
};

const MeetBranchSec: ZetkinJourneyMilestoneStatus = {
  completed: null,
  deadline: '2022-04-20T00:29:12+02:00',
  description: '',
  id: 3,
  title: 'Meet the branch secretary',
};

// Journey Instance
const ClarasOnboarding: ZetkinJourneyInstance = {
  assignees: [AngelaDavis],
  closed: null,
  created: '2022-02-01T14:53:15',
  id: 1,
  journey: {
    id: MemberOnboarding.id,
    plural_label: MemberOnboarding.plural_label,
    singular_label: MemberOnboarding.singular_label,
    title: MemberOnboarding.title,
  },
  milestones: [AttendMeeting, AttendTraining, MeetBranchSec],
  next_milestone: AttendMeeting,
  opening_note: '',
  organization: KPD,
  outcome: '',
  subjects: [ClaraZetkin],
  summary: `Nullam sagittis neque augue, vitae lacinia purus auctor eget. Mauris bibendum, 
    dui id fringilla dictum, velit ligula efficitur ligula, vitae aliquet mauris augue 
    vel ante. Mauris vitae ante molestie, pharetra risus vel, suscipit metus. Sed cursus 
    quis elit id aliquam. Class aptent taciti sociosqu ad litora torquent per conubia 
    nostra, per inceptos himenaeos. Nulla vitae arcu a neque luctus sodales non id eros. 
    Duis a porta turpis. Vestibulum dignissim tempor consectetur. Maecenas volutpat orci 
    in nulla malesuada sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing 
    elit. Phasellus euismod, purus vel tempus bibendum, purus lorem pulvinar lacus, ac 
    vulputate massa nunc vitae leo. Vivamus suscipit, ex a euismod pretium, ante odio 
    placerat urna, id sollicitudin sem metus eu purus. Nulla id ipsum interdum, 
    pharetra eros vitae, suscipit sapien. Nunc sed massa rhoncus, varius tellus a,
     lobortis lacus. Fusce vel tincidunt lectus, sit amet facilisis nisl. `,
  tags: [ActivistTag, PlaysGuitarTag],
  title: "Clara's onboarding",
  updated: '2022-03-21T12:53:15',
};

export default ClarasOnboarding;
