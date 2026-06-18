import { EmailChannel } from '../types';

export const initialData: EmailChannel[] = [
  {
    id: 1,
    is_blocked: true,
    organization_id: 1,
    published: '',
    published_by_user_id: 12,
    sender_email: 'newsletter@united.co.uk',
    sender_name: 'Jane from United',
    title: 'United News - Newsletter',
  },
  {
    id: 2,
    is_blocked: false,
    organization_id: 1,
    published: '',
    published_by_user_id: 12,
    sender_email: 'workplace@united.co.uk',
    sender_name: 'Martin from United',
    title: 'Pipe up! - Workplace issues monthly',
  },
  {
    id: 3,
    is_blocked: false,
    organization_id: 1,
    published: '',
    published_by_user_id: 12,
    sender_email: 'info@united.co.uk',
    sender_name: 'United Union',
    title: 'In the pipeline - Legislation being drafted',
  },
  {
    id: 4,
    is_blocked: false,
    organization_id: 1,
    published: '',
    published_by_user_id: 12,
    sender_email: 'info@united.co.uk',
    sender_name: 'Joss',
    title: 'Action group',
  },
  {
    id: 5,
    is_blocked: false,
    organization_id: 1,
    published: '',
    published_by_user_id: 12,
    sender_email: 'board@united.co.uk',
    sender_name: 'United Union',
    title: 'Board',
  },
];

export default function useEmailChannels(): EmailChannel[] {
  // set auth header on request to get email channels and toggle channels
  return initialData;
}
