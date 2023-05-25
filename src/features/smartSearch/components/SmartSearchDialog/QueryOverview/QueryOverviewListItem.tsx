import { FC } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import { Grid, IconButton, ListItem, Typography } from '@mui/material';

import getFilterComponents from './getFilterComponents';
import QueryOverviewChip from './QueryOverviewChip';
import {
  AnyFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

interface QueryOverviewListItemProps {
  filter: SmartSearchFilterWithId<AnyFilterConfig>;
  onDeleteFilter: (filter: SmartSearchFilterWithId<AnyFilterConfig>) => void;
  onEditFilter: (filter: SmartSearchFilterWithId<AnyFilterConfig>) => void;
  readOnly: boolean;
}

const QueryOverviewListItem: FC<QueryOverviewListItemProps> = ({
  filter,
  onDeleteFilter,
  onEditFilter,
  readOnly,
}) => {
  const { displayFilter, filterOperatorIcon, filterTypeIcon } =
    getFilterComponents(filter);
  return (
    <ListItem style={{ padding: 0 }}>
      <Grid
        alignItems="center"
        container
        display="flex"
        justifyContent="space-between"
        width={1}
      >
        <Grid display="flex" item xs={1}>
          <QueryOverviewChip
            filterOperatorIcon={filterOperatorIcon}
            filterTypeIcon={filterTypeIcon}
          />
        </Grid>
        <Grid item xs={10}>
          <Typography>{displayFilter}</Typography>
        </Grid>
        {!readOnly && (
          <Grid alignItems="center" display="flex" item xs={1}>
            <IconButton onClick={() => onEditFilter(filter)} size="small">
              <Edit fontSize="small" />
            </IconButton>
            <IconButton onClick={() => onDeleteFilter(filter)} size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </ListItem>
  );
};

export default QueryOverviewListItem;
