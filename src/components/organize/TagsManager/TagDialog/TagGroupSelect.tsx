import { ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from '@material-ui/lab';
import { Box, TextField } from '@material-ui/core';

import { tagGroupsResource } from 'api/tags';
import { ZetkinTagGroup } from 'types/zetkin';

const TagGroupSelect: React.FunctionComponent<{
  onChange: (
    e: ChangeEvent<{ [key: string]: never }>,
    value: ZetkinTagGroup | null,
    reason: AutocompleteChangeReason,
    details: AutocompleteChangeDetails<ZetkinTagGroup> | undefined
  ) => void;
  value?: ZetkinTagGroup;
}> = ({ value, onChange }) => {
  const { orgId } = useRouter().query;
  const { data: tagGroups } = tagGroupsResource(orgId as string).useQuery();

  return (
    <Box mb={0.8} mt={1.5}>
      <Autocomplete
        getOptionLabel={(group) => group.title}
        onChange={onChange}
        options={tagGroups || []}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
            }}
            label={'Group'}
            variant="outlined"
          />
        )}
        value={value}
      />
    </Box>
  );
};

export default TagGroupSelect;
