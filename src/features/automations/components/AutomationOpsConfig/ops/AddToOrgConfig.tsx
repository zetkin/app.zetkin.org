import { FC } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { GroupWork } from '@mui/icons-material';

import { PersonAddtoorgBulkOp } from 'features/import/types';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';
import { useMessages } from 'core/i18n';
import messageIds from 'features/automations/l10n/messageIds';
import BaseOpConfig from './BaseOpConfig';

type Props = {
  config: PersonAddtoorgBulkOp | null;
  onChange: (newConfig: PersonAddtoorgBulkOp) => void;
  onDelete: () => void;
};

const AddToOrgConfig: FC<Props> = ({ config, onChange, onDelete }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const subOrgsFuture = useSubOrganizations(orgId);

  return (
    <BaseOpConfig
      icon={<GroupWork />}
      label={messages.opConfig.opTypes.addToOrg.typeLabel()}
      onDelete={onDelete}
    >
      <ZUIFuture future={subOrgsFuture}>
        {(subOrgs) => (
          <TextField
            fullWidth
            label={messages.opConfig.opTypes.addToOrg.subOrgLabel()}
            onChange={(ev) =>
              onChange({
                op: 'person.addtoorg',
                org_id: parseInt(ev.target.value),
              })
            }
            select
            size="small"
            value={config?.org_id ?? ''}
          >
            {subOrgs
              .filter((subOrg) => subOrg.id != orgId)
              .map((subOrg) => (
                <MenuItem key={subOrg.id} value={subOrg.id}>
                  {subOrg.title}
                </MenuItem>
              ))}
          </TextField>
        )}
      </ZUIFuture>
    </BaseOpConfig>
  );
};

export default AddToOrgConfig;
