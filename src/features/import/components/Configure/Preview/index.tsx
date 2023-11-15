import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

const MappingPreview = () => {
  return (
    <Box p={2} sx={{ bgColor: 'beige' }}>
      <Box alignItems="center" display="flex" sx={{ mb: 1.5 }}>
        <Typography sx={{ mr: 2 }} variant="h5">
          Mapping preview
        </Typography>
        <Button disabled startIcon={<ArrowBackIos />}>
          Previous
        </Button>
        <Button endIcon={<ArrowForwardIos />}>Next</Button>
      </Box>
      <Box
        sx={{
          border: '1px solid lightgrey',
          borderRadius: '5px',
          height: '80px',
        }}
      >
        Check out!
      </Box>
    </Box>
  );
};

export default MappingPreview;
