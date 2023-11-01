import { Box } from '@mui/system';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import { Typography } from '@mui/material';
import { ZetkinTag } from 'utils/types/zetkin';

interface AddedTagsTrackerProps {
  changedNum: number;
  fieldName: string;
  tags: ZetkinTag[];
}
const AddedTagsTracker: React.FunctionComponent<AddedTagsTrackerProps> = ({
  changedNum,
  fieldName,
  tags,
}) => {
  return (
    <Box sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}>
      <Box alignItems="center" display="flex" mb={1}>
        <Msg
          id={messageIds.validation.trackers.tags}
          values={{
            count: (
              <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
                {changedNum}
              </Typography>
            ),
            fieldName: (
              <Typography fontWeight="bold" sx={{ mx: 0.5 }}>
                {fieldName}
              </Typography>
            ),
          }}
        />
      </Box>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {tags.map((tag) => (
          <Box key={tag.id}>
            <TagChip tag={tag} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default AddedTagsTracker;
