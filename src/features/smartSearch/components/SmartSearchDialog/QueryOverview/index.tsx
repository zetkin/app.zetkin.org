import { Alert, Divider } from '@mui/material';
import {
  Box,
  Button,
  DialogActions,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Edit, PlaylistAddOutlined } from '@mui/icons-material';

import DisplayStartsWith from '../../StartsWith/DisplayStartsWith';
import { Msg } from 'core/i18n';
import {
  AnyFilterConfig,
  FILTER_TYPE,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
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
      display="flex"
      flex={1}
      flexDirection="column"
      justifyContent="space-between"
    >
      {readOnly && (
        <Alert severity="info">
          <Msg id={messageIds.readOnly} />
        </Alert>
      )}
      <Box minWidth={0.5} padding={4}>
        <List>
          <ListItem key={FIRST_FILTER} style={{ padding: 0 }}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              width={1}
            >
              <Typography>
                <DisplayStartsWith startsWithAll={startsWithAll} />
              </Typography>
              {!readOnly && (
                <Box alignItems="center" display="flex">
                  <IconButton
                    onClick={onOpenStartsWithEditor}
                    size="small"
                    sx={{ paddingRight: '35px' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </ListItem>
          {filters
            .filter((f) => f.type !== FILTER_TYPE.ALL)
            .map((filter) => (
              <>
                <Divider />
                <QueryOverviewListItem
                  filter={filter}
                  onDeleteFilter={onDeleteFilter}
                  onEditFilter={onEditFilter}
                  readOnly={readOnly}
                />
              </>
            ))}
        </List>
        <Button
          color="primary"
          disabled={readOnly}
          onClick={onOpenFilterGallery}
          startIcon={<PlaylistAddOutlined />}
          sx={{ marginTop: 2 }}
          variant="outlined"
        >
          <Msg id={messageIds.buttonLabels.addNewFilter} />
        </Button>
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
