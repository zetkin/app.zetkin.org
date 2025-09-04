import { FC } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { FILTER_TYPE } from '../../types';
import filterGalleryPattern from './filterGalleryPattern';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';

interface FilterGalleryCardProps {
  colors: { pale: string; strong: string };
  filter: Exclude<FILTER_TYPE, 'call_blocked' | 'most_active'>;
  onAddFilter: () => void;
}

const FilterGalleryCard: FC<FilterGalleryCardProps> = ({
  colors,
  filter,
  onAddFilter,
}) => {
  const pattern = filterGalleryPattern(filter, colors);
  return (
    <Card
      onClick={onAddFilter}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        alignItems="center"
        display="flex"
        height="75px"
        justifyContent="center"
        sx={{ ...pattern, opacity: '30%' }}
      />
      <CardContent>
        <Typography variant="h5">
          <Msg id={messageIds.filterGallery.filters[filter].title} />
        </Typography>
        <Typography sx={{ paddingTop: 1 }} variant="body2">
          <Msg id={messageIds.filterGallery.filters[filter].description} />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FilterGalleryCard;
