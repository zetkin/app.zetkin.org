import { FormattedMessage } from 'react-intl';
import { Box, Tooltip, Typography } from '@material-ui/core';

import { ZetkinTag } from 'types/zetkin';

const TagsManager: React.FunctionComponent<{
  appliedTags: ZetkinTag[];
}> = ({ appliedTags }) => {
  return (
    <Box>
      {/* Tags List */}
      {appliedTags.length > 0 && (
        <Box display="flex" flexWrap="wrap" style={{ gap: 8 }}>
          {appliedTags.map((tag, i) => {
            // Tag Chip
            return (
              <Tooltip key={i} arrow title={tag.description}>
                <Box
                  bgcolor={tag.color || '#e1e1e1'}
                  borderRadius="18px"
                  fontSize={12}
                  px={2}
                  py={0.7}
                >
                  {tag.title}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      )}
      {/* If no tags */}
      {appliedTags?.length === 0 && (
        <Typography>
          <FormattedMessage id="pages.people.person.tags.noTags" />
        </Typography>
      )}
    </Box>
  );
};

export default TagsManager;
