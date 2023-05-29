import { Delete, Edit } from '@mui/icons-material';
import { FC, ReactNode } from 'react';
import { Grid, IconButton, ListItem, Typography } from '@mui/material';

type QueryOverviewListItemProps = {
  canDelete?: boolean;
  canEdit?: boolean;
  diagram?: ReactNode;
  filterText?: ReactNode;
  icon?: ReactNode;
  onClickDelete?: () => void;
  onClickEdit?: () => void;
};

const QueryOverviewListItem: FC<QueryOverviewListItemProps> = ({
  canEdit,
  canDelete,
  diagram,
  filterText,
  icon,
  onClickDelete,
  onClickEdit,
}) => {
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
          {icon}
        </Grid>
        <Grid item xs={7}>
          <Typography>{filterText}</Typography>
        </Grid>
        <Grid alignSelf="stretch" item xs={3}>
          {diagram}
        </Grid>
        <Grid alignItems="center" display="flex" item xs={1}>
          {canEdit && (
            <IconButton
              onClick={() => onClickEdit && onClickEdit()}
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          )}
          {canDelete && (
            <IconButton
              onClick={() => onClickDelete && onClickDelete()}
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default QueryOverviewListItem;
