import { Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { Box, TextField, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTag } from 'types/zetkin';

import { groupTags } from './utils';
import GroupToggle from './GroupToggle';
import TagChip from './TagChip';
import TagsList from './TagsList';

const TagsManager: React.FunctionComponent<{
  appliedTags: ZetkinTag[];
}> = ({ appliedTags }) => {
  const intl = useIntl();

  const [isGrouped, setIsGrouped] = useState(false);

  const groupedTags = groupTags(
    appliedTags,
    intl.formatMessage({
      id: 'misc.tags.tagsManager.ungroupedHeader',
    })
  );

  return (
    <ZetkinSection
      action={
        <GroupToggle
          checked={isGrouped}
          onChange={() => setIsGrouped(!isGrouped)}
        />
      }
      title={intl.formatMessage({ id: 'misc.tags.tagsManager.title' })}
    >
      <Box>
        {appliedTags.length > 0 ? (
          <TagsList
            groupedTags={groupedTags}
            isGrouped={isGrouped}
            tags={appliedTags}
          />
        ) : (
          // If no tags
          <Typography>
            <FormattedMessage id="misc.tags.tagsManager.noTags" />
          </Typography>
        )}
      </Box>
      <Box mt={2}>
        {/* <Button
          color="primary"
          onClick={(event) => setAddTagButton(event.currentTarget)}
        >
          <FormattedMessage id="misc.tags.tagsManager.addTag" />
        </Button> */}
        <Autocomplete
          getOptionLabel={(option) => option.title}
          groupBy={(option) =>
            option.group?.title ||
            intl.formatMessage({
              id: 'misc.tags.tagsManager.ungroupedHeader',
            })
          }
          id="grouped-demo"
          options={appliedTags}
          renderInput={(params) => (
            <TextField
              {...params}
              label={<FormattedMessage id="misc.tags.tagsManager.addTag" />}
              variant="outlined"
            />
          )}
          renderOption={(option) => {
            return <TagChip tag={option} />;
          }}
          style={{ width: 300 }}
        />
      </Box>
    </ZetkinSection>
  );
};

export default TagsManager;
