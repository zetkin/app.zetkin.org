import { useState } from 'react';

import { useNumericRouteParams } from 'core/hooks';
import useOrganization from 'features/organizations/hooks/useOrganization';

export default function useEmailSettings(initialSubject: string) {
  const { orgId } = useNumericRouteParams();
  const organization = useOrganization(orgId).data;
  const [subject, setSubject] = useState(initialSubject);

  if (!organization) {
    throw new Error('Error loading organization');
  }

  if (!organization.email) {
    throw new Error('Organization does not have an email address');
  }

  return {
    emailAddress: organization.email,
    orgTitle: organization.title,
    setSubject,
    subject,
  };
}
