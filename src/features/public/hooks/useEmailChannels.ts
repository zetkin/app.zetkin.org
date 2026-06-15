import { EmailChannel } from '../types';

export default function useEmailChannels(): EmailChannel[] {
  // set auth header on request to get email channels and toggle channels
  //

  return [
    {
      id: 1,
      is_public: true,
      organization_id: 1,
      sender_email: 'newsletter@united.co.uk',
      sender_name: 'Jane from United',
      subscription: 'subscribed',
      title: 'United News - Newsletter',
    },
    {
      id: 2,
      is_public: true,
      organization_id: 1,
      sender_email: 'workplace@united.co.uk',
      sender_name: 'Martin from United',
      subscription: 'blocked',
      title: 'Pipe up! - Workplace issues monthly',
    },
    {
      id: 3,
      is_public: true,
      organization_id: 1,
      sender_email: 'info@united.co.uk',
      sender_name: 'United Union',
      subscription: 'blocked',
      title: 'In the pipeline - Legislation being drafted',
    },
    {
      id: 4,
      is_public: false,
      organization_id: 1,
      sender_email: 'info@united.co.uk',
      sender_name: 'Joss',
      subscription: 'blocked',
      title: 'Action group',
    },
    {
      id: 5,
      is_public: false,
      organization_id: 1,
      sender_email: 'board@united.co.uk',
      sender_name: 'United Union',
      subscription: 'blocked',
      title: 'Board',
    },
  ];
}
