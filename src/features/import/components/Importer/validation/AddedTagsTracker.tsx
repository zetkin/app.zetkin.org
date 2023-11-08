import { Box } from '@mui/system';
import { Typography } from '@mui/material';

import { Msg } from 'core/i18n';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

import messageIds from 'features/import/l10n/messageIds';

interface AddedTagsTrackerProps {
  createdTags: { [key: number]: number };
  orgId: number;
  updatedTags: { [key: number]: number };
}
const AddedTagsTracker: React.FunctionComponent<AddedTagsTrackerProps> = ({
  createdTags,
  orgId,
  updatedTags,
}) => {
  const { data } = useTags(orgId);
  const tags = data || [];
  const createdTagsKeys = Object.keys(createdTags);
  const updatedTagsKeys = Object.keys(updatedTags);
  const createdTagsSum = Object.values(createdTags).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const updatedTagsSum = Object.values(updatedTags).reduce(
    (acc, cur) => acc + cur,
    0
  );

  const addedTags = [
    ...new Set([...createdTagsKeys, ...updatedTagsKeys]),
  ].reduce((acc: ZetkinTag[], id) => {
    const tag = tags.find((tag) => tag.id === parseInt(id));
    if (tag) {
      return acc.concat(tag);
    }
    return acc;
  }, []);

  return (
    <Box sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}>
      <Box alignItems="center" display="flex" mb={1}>
        <Msg
          id={messageIds.validation.trackers.tagsDesc}
          values={{
            count: (
              <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
                {createdTagsSum + updatedTagsSum}
              </Typography>
            ),
            fieldName: (
              <Typography fontWeight="bold" sx={{ mx: 0.5 }}>
                <Msg id={messageIds.validation.trackers.tags} />
              </Typography>
            ),
          }}
        />
      </Box>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {addedTags.map((tag) => (
          <Box key={tag.id}>
            <TagChip tag={tag} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default AddedTagsTracker;
