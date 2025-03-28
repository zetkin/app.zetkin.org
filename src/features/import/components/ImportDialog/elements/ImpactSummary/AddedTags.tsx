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
  peoplePerTag: { [key: number]: number };
  tense: 'past' | 'future';
}

const AddedTags: FC<AddedTagsProps> = ({
  addedTags,
  numPeopleWithTagsAdded,
  peoplePerTag,
  tense,
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
          id={messageIds.impactSummary[tense].tagsDesc}
          values={{
            numPeople: (
              <Typography
                component="span"
                marginRight={0.5}
                sx={{ display: 'flex' }}
              >
                <Msg
                  id={messageIds.impactSummary.people}
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
                <Msg id={messageIds.impactSummary[tense].tags} />
              </Typography>
            ),
          }}
        />
      </Typography>
      <Box display="inline" flexWrap="wrap" gap={1} paddingTop={1}>
        {addedTags.map((tag) => (
          <Box key={tag.id} display="flex" paddingTop={1}>
            <TagChip tag={tag} />
            <Typography fontWeight="bold"> : {peoplePerTag[tag.id]}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default AddedTags;
