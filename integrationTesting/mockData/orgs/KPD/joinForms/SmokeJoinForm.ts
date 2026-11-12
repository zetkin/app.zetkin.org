import KPD from '..';
import { ZetkinJoinForm } from 'features/joinForms/types';

const SmokeJoinForm: ZetkinJoinForm = {
  description: '',
  embeddable: true,
  fields: ['first_name', 'last_name'],
  id: 1,
  org_access: 'sameorg',
  organization: KPD,
  renderable: true,
  requires_email_verification: false,
  submit_token: 'join-form-token',
  tags: [],
  title: 'Smoke join form',
};

export default SmokeJoinForm;
