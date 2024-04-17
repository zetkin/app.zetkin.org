import { FC } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { FILTER_TYPE } from '../types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';

interface FilterGalleryCardProps {
  filter: Exclude<FILTER_TYPE, 'all' | 'call_blocked' | 'most_active'>;
  onAddFilter: () => void;
}

const FilterGalleryCard: FC<FilterGalleryCardProps> = ({
  filter,
  onAddFilter,
}) => {
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
        bgcolor="lightblue"
        display="flex"
        height="75px"
        justifyContent="center"
      />
      <CardContent>
        <Typography variant="h5">
          <Msg id={messageIds.filterTitles[filter]} />
        </Typography>
        <Typography sx={{ paddingTop: 1 }} variant="body2">
          <Msg id={messageIds.filterDescriptions[filter]} />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FilterGalleryCard;
