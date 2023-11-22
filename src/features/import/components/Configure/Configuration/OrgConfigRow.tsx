import { FC } from 'react';
import { ArrowForward, Delete } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

interface OrgConfigRowProps {
  italic?: boolean;
  numRows: number;
  onSelectOrg: (orgId: number) => void;
  onDeselectOrg: () => void;
  orgs: Pick<ZetkinOrganization, 'id' | 'title'>[];
  selectedOrgId: number | null;
  title: string;
}

const OrgConfigRow: FC<OrgConfigRowProps> = ({
  italic,
  numRows,
  onSelectOrg,
  onDeselectOrg,
  orgs,
  selectedOrgId,
  title,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" paddingTop={1}>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          width="50%"
        >
          <Typography fontStyle={italic ? 'italic' : ''}>{title}</Typography>
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
        </Box>
        <Box display="flex" paddingRight={1} width="50%">
          <FormControl fullWidth size="small">
            <InputLabel>
              <Msg id={messageIds.configuration.configure.orgs.organizations} />
            </InputLabel>
            <Select
              label={messages.configuration.configure.orgs.organizations()}
              onChange={(event) => {
                if (typeof event.target.value == 'number') {
                  onSelectOrg(event.target.value);
                }
              }}
              value={selectedOrgId || ''}
            >
              {orgs.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            disabled={!selectedOrgId}
            onClick={() => {
              if (selectedOrgId) {
                onDeselectOrg();
              }
            }}
          >
            <Delete
              sx={{
                color: selectedOrgId ? 'secondary' : theme.palette.grey[400],
              }}
            />
          </IconButton>
        </Box>
      </Box>
      <Typography color="secondary">
        <Msg
          id={messageIds.configuration.configure.tags.numberOfRows}
          values={{ numRows }}
        />
      </Typography>
    </Box>
  );
};

export default OrgConfigRow;
