import { AutoAwesome, ArrowForward, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import messageIds from 'features/import/l10n/messageIds';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';
import { mapScoreToColour } from './TagConfigRow';

interface OrgConfigRowProps {
  italic?: boolean;
  numRows: number;
  onSelectOrg: (orgId: number) => void;
  onDeselectOrg: () => void;
  orgs: Pick<ZetkinOrganization, 'id' | 'title'>[];
  selectedOrgId: number | null;
  selectedScore: number | null;
  title: string;
}

const OrgConfigRow: FC<OrgConfigRowProps> = ({
  italic,
  numRows,
  onSelectOrg,
  onDeselectOrg,
  orgs,
  selectedOrgId,
  selectedScore,
  title,
}) => {
  const messages = useMessages(messageIds);
  const [mapping, setMapping] = useState(false);

  const showSelect = mapping || selectedOrgId;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Box
          alignItems="flex-start"
          display="flex"
          flex={1}
          justifyContent="space-between"
          paddingTop={1}
        >
          <Box display="flex" sx={{ wordBreak: 'break-all' }} width="100%">
            <Typography fontStyle={italic ? 'italic' : ''}>{title}</Typography>
          </Box>
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
        </Box>
        <Box flex={1} paddingRight={1}>
          {!showSelect && (
            <Button onClick={() => setMapping(true)}>
              <Msg
                id={
                  messageIds.configuration.configure.orgs
                    .showOrganizationSelectButton
                }
              />
            </Button>
          )}
          {showSelect && (
            <Box alignItems="flex-start" display="flex">
              <FormControl fullWidth size="small">
                <InputLabel>
                  <Msg
                    id={messageIds.configuration.configure.orgs.organizations}
                  />
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
                onClick={() => {
                  onDeselectOrg();
                  setMapping(false);
                }}
              >
                <Delete color="secondary" />
              </IconButton>
            </Box>
          )}
          {showSelect && selectedScore != null && (
            <Box
              display="flex"
              sx={{
                color: mapScoreToColour(selectedScore),
                marginTop: '5px',
              }}
            >
              <AutoAwesome sx={{ marginRight: '5px' }} />
              <Typography variant="body2">
                {selectedScore < 0.01
                  ? messages.configuration.configure.orgs.scorePerfect()
                  : messages.configuration.configure.orgs.scoreImperfect()}
              </Typography>
            </Box>
          )}
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
