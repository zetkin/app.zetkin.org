import { FC, ReactElement } from 'react';

import { FilterConfigOrgOptions } from './types';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';
import { Typography } from '@mui/material';
import useCommaPlural from 'zui/hooks/useCommaPlural';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';

type Props = {
  orgId: number;
  organizations: FilterConfigOrgOptions;
};

const OrgScope: FC<Props> = ({ orgId, organizations }) => {
  const orgs = useSubOrganizations(orgId);
  const titles = Array.isArray(organizations)
    ? organizations
        .map((oid) => orgs.data?.find((org) => org.id == oid)?.title ?? '')
        .filter((str) => !!str)
    : [];

  const orgString = useCommaPlural(titles, 3, {
    few: messageIds.orgScope.few,
    many: messageIds.orgScope.many,
    single: messageIds.orgScope.single,
  });

  let content: ReactElement | string | null = null;

  if (organizations == 'all') {
    content = <Msg id={messageIds.orgScope.all} />;
  } else if (organizations == 'suborgs') {
    content = <Msg id={messageIds.orgScope.suborgs} />;
  } else if (organizations.length == 1 && organizations[0] == orgId) {
    return null;
  } else {
    content = orgString;
  }
  return (
    <Typography color="gray" variant="body2">
      {content}
    </Typography>
  );
};

export default OrgScope;
