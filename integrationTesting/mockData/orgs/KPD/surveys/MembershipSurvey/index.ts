import KPD from '../..';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyExtended,
} from 'utils/types/zetkin';

const KPDMembershipSurvey: ZetkinSurveyExtended = {
  access: 'open',
  callers_only: false,
  campaign: null,
  elements: [
    {
      hidden: false,
      id: 1,
      question: {
        description: '',
        options: [
          {
            id: 1,
            text: 'Yes',
          },
          {
            id: 2,
            text: 'No',
          },
        ],
        question: 'Do you want to be active?',
        required: false,
        response_config: {
          widget_type: 'radio',
        },
        response_type: RESPONSE_TYPE.OPTIONS,
      },
      type: ELEMENT_TYPE.QUESTION,
    },
    {
      hidden: false,
      id: 2,
      question: {
        description: '',
        question: 'What would you like to do?',
        required: false,
        response_config: {
          multiline: true,
        },
        response_type: RESPONSE_TYPE.TEXT,
      },
      type: ELEMENT_TYPE.QUESTION,
    },
  ],
  expires: null,
  id: 1,
  info_text: '',
  org_access: 'sameorg',
  organization: {
    id: KPD.id,
    title: KPD.title,
  },
  published: '1857-05-07T13:37:00.000Z',
  signature: 'require_signature',
  title: 'Membership survey',
};

export default KPDMembershipSurvey;
