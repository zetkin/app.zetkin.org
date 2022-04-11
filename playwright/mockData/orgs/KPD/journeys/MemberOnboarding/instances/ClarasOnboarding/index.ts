import ActivistTag from '../../../../tags/Activist';
import ClaraZetkin from '../../../../people/ClaraZetkin';
import MemberOnboarding from '../../../MemberOnboarding';
import PlaysGuitarTag from '../../../../tags/PlaysGuitar';
import { ZetkinJourneyInstance } from '../../../../../../../../src/types/zetkin';
import milestones, { AttendMeeting } from './milestones';

const ClarasOnboarding: ZetkinJourneyInstance = {
  assigned_to: [ClaraZetkin],
  created_at: '2022-02-01T14:53:15',
  id: 1,
  journey: {
    id: MemberOnboarding.id,
    title: MemberOnboarding.singular_name,
  },
  milestones: milestones,
  next_milestone: AttendMeeting,
  people: [ClaraZetkin],
  status: 'open',
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
  updated_at: '2022-03-21T12:53:15',
};

export default ClarasOnboarding;
