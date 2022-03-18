import { Box } from '@material-ui/core';

const TagsManager: React.FunctionComponent = () => {
  return (
    <Box>
      {/* Tags List */}
      <Box display="flex" flexWrap="wrap">
        {[{ title: '1' }, { title: '2' }].map((tag, i) => {
          // Tag Chip
          return (
            <Box
              key={i}
              bgcolor="pink"
              borderRadius="18px"
              fontSize={12}
              margin={1}
              px={2}
              py={1}
            >
              {tag.title}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default TagsManager;
