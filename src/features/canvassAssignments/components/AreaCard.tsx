import MapIcon from '@mui/icons-material/Map';
import { FC } from 'react';
import { Box, Card, Divider, Grid, Typography } from '@mui/material';

import { ZetkinArea } from 'features/areas/types';

type AreaCardProps = {
  areas: ZetkinArea[];
};

const AreaCard: FC<AreaCardProps> = ({ areas }) => {
  return (
    <>
      {areas.map((area) => (
        <Grid key={area.id} item md={4} sm={4} xs={12}>
          <Card key={area.id} sx={{ height: 'auto', marginBottom: 2 }}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
            >
              <Box alignItems="center" display="flex">
                <Typography padding={2} variant="h5">
                  {area.title || 'Untitled area'}
                </Typography>
                <Divider
                  orientation="vertical"
                  sx={{ height: '30px', marginRight: 1 }}
                />
                <Typography>45</Typography>
              </Box>

              <MapIcon sx={{ marginRight: 2 }} />
            </Box>
            <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
            <Box>Graph</Box>
            <Box
              display="flex"
              justifyContent="space-evenly"
              sx={{ marginTop: 2 }}
            >
              <Box textAlign="start">
                <Typography>Households</Typography>
                <Typography variant="h6">23</Typography>
              </Box>
              <Box textAlign="start">
                <Typography>Places</Typography>
                <Typography variant="h6">23</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default AreaCard;
