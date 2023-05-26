import { Alert, Divider, Grid } from '@mui/material';
import {
  ArrowForwardOutlined,
  CircleOutlined,
  Edit,
  PlaylistAddOutlined,
  RadioButtonCheckedOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  DialogActions,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';

import DisplayStartsWith from '../../StartsWith/DisplayStartsWith';
import { Msg } from 'core/i18n';
import {
  AnyFilterConfig,
  FILTER_TYPE,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import QueryOverviewChip from './QueryOverviewChip';
import QueryOverviewListItem from './QueryOverviewListItem';

const FIRST_FILTER = 'first_filter';

interface QueryOverviewProps {
  filters: SmartSearchFilterWithId<AnyFilterConfig>[];
  onCloseDialog?: () => void;
  onSaveQuery?: () => void;
  onOpenFilterGallery: () => void;
  onEditFilter: (filter: SmartSearchFilterWithId) => void;
  onDeleteFilter: (filter: SmartSearchFilterWithId) => void;
  onOpenStartsWithEditor: () => void;
  startsWithAll: boolean;
  readOnly?: boolean;
  hasSaveCancelButtons?: boolean;
}

const QueryOverview = ({
  filters,
  hasSaveCancelButtons = true,
  readOnly = false,
  onCloseDialog,
  onSaveQuery,
  onOpenFilterGallery,
  onEditFilter,
  onDeleteFilter,
  onOpenStartsWithEditor,
  startsWithAll,
}: QueryOverviewProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: '90%',
      }}
    >
      {readOnly && (
        <Alert severity="info">
          <Msg id={messageIds.readOnly} />
        </Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
          padding: '0 24px',
        }}
      >
        <List sx={{ overflowY: 'auto' }}>
          <ListItem key={FIRST_FILTER} sx={{ padding: 0 }}>
            <Grid
              alignItems="center"
              container
              display="flex"
              justifyContent="space-between"
              width={1}
            >
              <Grid display="flex" item xs={1}>
                <QueryOverviewChip
                  filterOperatorIcon={
                    <ArrowForwardOutlined color="secondary" fontSize="small" />
                  }
                  filterTypeIcon={
                    startsWithAll ? (
                      <RadioButtonCheckedOutlined
                        color="secondary"
                        fontSize="small"
                      />
                    ) : (
                      <CircleOutlined color="secondary" fontSize="small" />
                    )
                  }
                />
              </Grid>
              <Grid item xs={10}>
                <Typography>
                  <DisplayStartsWith startsWithAll={startsWithAll} />
                </Typography>
              </Grid>
              {!readOnly && (
                <Grid alignItems="center" display="flex" item xs={1}>
                  <IconButton
                    onClick={onOpenStartsWithEditor}
                    size="small"
                    sx={{ paddingRight: '35px' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </ListItem>
          {filters
            .filter((f) => f.type !== FILTER_TYPE.ALL)
            .map((filter) => (
              <Box key={filter.id}>
                <Divider />
                <QueryOverviewListItem
                  filter={filter}
                  onDeleteFilter={onDeleteFilter}
                  onEditFilter={onEditFilter}
                  readOnly={readOnly}
                />
              </Box>
            ))}
        </List>
        {!readOnly && (
          <Button
            color="primary"
            disabled={readOnly}
            onClick={onOpenFilterGallery}
            startIcon={<PlaylistAddOutlined />}
            sx={{ alignSelf: 'flex-start', marginTop: 2 }}
            variant="outlined"
          >
            <Msg id={messageIds.buttonLabels.addNewFilter} />
          </Button>
        )}
      </Box>
      {hasSaveCancelButtons && (
        <DialogActions>
          <Box
            display="flex"
            justifyContent="flex-end"
            m={1}
            style={{ gap: '1rem' }}
          >
            {readOnly && (
              <Button
                color="primary"
                onClick={onCloseDialog}
                variant="outlined"
              >
                <Msg id={messageIds.buttonLabels.close} />
              </Button>
            )}
            {!readOnly && (
              <>
                <Button color="primary" onClick={onCloseDialog} variant="text">
                  <Msg id={messageIds.buttonLabels.cancel} />
                </Button>
                <Button
                  color="primary"
                  data-testid="QueryOverview-saveButton"
                  onClick={onSaveQuery}
                  variant="contained"
                >
                  <Msg id={messageIds.buttonLabels.save} />
                </Button>
              </>
            )}
          </Box>
        </DialogActions>
      )}
    </Box>
  );
};

export default QueryOverview;
