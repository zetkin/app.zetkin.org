import { Box } from '@mui/system';
import { FC } from 'react';
import { Typography, useTheme } from '@mui/material';

import { FakeDataType } from '.';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

type TagsCreated = FakeDataType['summary']['tagsCreated'];
interface AddedTagsProps {
  tagsCreated: TagsCreated;
  orgId: number;
}

const AddedTags: FC<AddedTagsProps> = ({ orgId, tagsCreated }) => {
  const theme = useTheme();
  const tags = useTags(orgId).data ?? [];

  const addedTags = Object.keys(tagsCreated.byTag).reduce(
    (acc: ZetkinTag[], id) => {
      const tag = tags.find((tag) => tag.id === parseInt(id));
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    },
    []
  );

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
                    numPeople: tagsCreated.total,
                    number: (
                      <Typography fontWeight="bold" sx={{ marginRight: 0.5 }}>
                        {tagsCreated.total}
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
