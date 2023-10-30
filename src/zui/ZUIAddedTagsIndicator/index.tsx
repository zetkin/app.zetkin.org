import { Box } from '@mui/system';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import { Typography } from '@mui/material';
import { ZetkinTag } from 'utils/types/zetkin';

interface ZUIAddedTagsIndicatorProps {
  count: number;
  desc: string;
  fieldName: string;
  tags: ZetkinTag[];
}
const ZUIAddedTagsIndicator: React.FunctionComponent<
  ZUIAddedTagsIndicatorProps
> = ({ count, desc, fieldName, tags }) => {
  return (
    <Box sx={{ border: 'solid 1px lightgrey', borderRadius: '4px', p: 2 }}>
      <Box display="flex" mb={1}>
        <Typography sx={{ mr: 0.5 }}>
          {count} {desc} {fieldName} added. This message will be fixed later
          with messageIds
        </Typography>
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
export default ZUIAddedTagsIndicator;
