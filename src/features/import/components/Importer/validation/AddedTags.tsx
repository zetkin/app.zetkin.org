import { Box } from '@mui/system';
import { FC } from 'react';
import { Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import { ZetkinTag } from 'utils/types/zetkin';

interface AddedTagsProps {
  addedTags: ZetkinTag[];
  numPeopleWithTagsAdded: number;
}

const AddedTags: FC<AddedTagsProps> = ({
  addedTags,
  numPeopleWithTagsAdded,
}) => {
  const theme = useTheme();
  return (
    <Box
      border={1}
      borderColor={theme.palette.grey[300]}
      borderRadius={1}
      display="flex"
      flexDirection="column"
      mb={1}
      padding={2}
    >
      <Typography
        component="span"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <Msg
          id={messageIds.validation.updateOverview.tagsDesc}
          values={{
            numPeople: (
              <Typography
                component="span"
                marginRight={0.5}
                sx={{ display: 'flex' }}
              >
                <Msg
                  id={messageIds.validation.updateOverview.people}
                  values={{
                    numPeople: numPeopleWithTagsAdded,
                    number: (
                      <Typography fontWeight="bold" sx={{ marginRight: 0.5 }}>
                        {numPeopleWithTagsAdded}
                      </Typography>
                    ),
                  }}
                />
              </Typography>
            ),
            tags: (
              <Typography fontWeight="bold" sx={{ marginX: 0.5 }}>
                <Msg id={messageIds.validation.updateOverview.tags} />
              </Typography>
            ),
          }}
        />
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1} paddingTop={1}>
        {addedTags.map((tag) => (
          <TagChip key={tag.id} tag={tag} />
        ))}
      </Box>
    </Box>
  );
};
export default AddedTags;
