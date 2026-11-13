import { SignatureData } from '../types';
import useMembership from 'features/organizations/hooks/useMembership';
import usePerson from 'features/profile/hooks/usePerson';

export default function useSignatureDefaults(orgId: number): SignatureData {
  const membership = useMembership(orgId).data;
  const person = usePerson(orgId, membership?.profile.id).data;

  return {
    email: person?.email || '',
    name: [person?.first_name, person?.last_name].filter(Boolean).join(' '),
    organization: membership?.organization.title || '',
    phone: person?.phone || '',
    title: '',
  };
}
