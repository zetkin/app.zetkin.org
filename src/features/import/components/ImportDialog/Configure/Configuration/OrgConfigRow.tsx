import Fuse from 'fuse.js';
import { ArrowForward, Delete } from '@mui/icons-material';
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
  const messages = useMessages(messageIds);
  const [mapping, setMapping] = useState(false);

  const showSelect = mapping || selectedOrgId;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex">
        <Box
          alignItems="flex-start"
          display="flex"
          justifyContent="space-between"
          paddingTop={1}
          width="50%"
        >
          <Box display="flex" sx={{ wordBreak: 'break-all' }} width="100%">
            <Typography fontStyle={italic ? 'italic' : ''}>{title}</Typography>
          </Box>
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
        </Box>
        <Box
          alignItems="flex-start"
          display="flex"
          paddingRight={1}
          width="50%"
        >
          {!showSelect && (
            <>
              <Button onClick={() => setMapping(true)}>
                <Msg
                  id={
                    messageIds.configuration.configure.ids
                      .showOrganizationSelectButton
                  }
                />
              </Button>
              {title && (
                <Button
                  onClick={() => {
                    // Find org with most similar name
                    const fuse = new Fuse(orgs, {
                      includeScore: true,
                      keys: ['title'],
                    });

                    const results = fuse.search(title);

                    // Filter out items with a bad match
                    const goodResults = results.filter(
                      (result) => result.score && result.score < 0.5
                    );

                    // If there is a match, guess it
                    if (goodResults && goodResults.length > 0) {
                      onSelectOrg(goodResults[0].item.id);
                    }
                  }}
                >
                  Guess
                </Button>
              )}
            </>
          )}
          {showSelect && (
            <>
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
            </>
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
