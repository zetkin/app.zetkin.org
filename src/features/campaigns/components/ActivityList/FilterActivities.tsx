import { ChangeEvent } from 'react';
import { FilterListOutlined } from '@mui/icons-material';
import { Box, Card, TextField } from '@mui/material';

import messageIds from 'features/campaigns/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface FilterActivitiesProps {
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const FilterActivities = ({ onChange, value }: FilterActivitiesProps) => {
  const messages = useMessages(messageIds);
  return (
    <Card>
      <Box padding={2}>
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <FilterListOutlined
                color="secondary"
                sx={{ marginRight: '0.5em' }}
              />
            ),
          }}
          onChange={onChange}
          placeholder={messages.singleProject.filterActivities()}
          value={value}
        />
      </Box>
    </Card>
  );
};

export default FilterActivities;
