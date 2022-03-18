import { Box } from '@material-ui/core';

const TagsManager: React.FunctionComponent = () => {
  return (
    <Box>
      {/* Tags List */}
      <Box display="flex" flexWrap="wrap" style={{ gap: 8 }}>
        {[{ title: 'Activist' }, { title: 'Contributor' }].map((tag, i) => {
          // Tag Chip
          return (
            <Box
              key={i}
              bgcolor="pink"
              borderRadius="18px"
              fontSize={12}
              px={2}
              py={0.7}
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
