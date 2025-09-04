import { useState } from 'react';
import { Alert, Divider, Typography, useTheme } from '@mui/material';
import {
  ArrowForwardOutlined,
  CircleOutlined,
  PlaylistAddOutlined,
  RadioButtonCheckedOutlined,
} from '@mui/icons-material';
import { Box, Button, DialogActions, List } from '@mui/material';

import DisplayStartsWith from '../../StartsWith/DisplayStartsWith';
import { Msg } from 'core/i18n';
import useSmartSearchStats from 'features/smartSearch/hooks/useSmartSearchStats';
import {
  AnyFilterConfig,
  FILTER_TYPE,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import QueryOverviewChip from './QueryOverviewChip';
import QueryOverviewFilterListItem from './QueryOverviewFilterListItem';
import QueryOverviewListItem from './QueryOverviewListItem';
import {
  SmartSearchSankeyEntrySegment,
  SmartSearchSankeyExitSegment,
  SmartSearchSankeyProvider,
} from '../../sankeyDiagram';
import ZUIReorderable, { ZUIReorderableWidget } from 'zui/ZUIReorderable';

interface QueryOverviewProps {
  filters: SmartSearchFilterWithId<AnyFilterConfig>[];
  onCloseDialog?: () => void;
  onSaveQuery?: () => void;
  onOpenFilterGallery: () => void;
  onReorderFilters: (filters: SmartSearchFilterWithId[]) => void;
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
  onReorderFilters,
  startsWithAll,
}: QueryOverviewProps): JSX.Element => {
  const [dragging, setDragging] = useState(false);
  const theme = useTheme();
  const stats = useSmartSearchStats(filters);
  const resultCount = stats?.length ? stats[stats.length - 1].result : 0;

  const reorderableItems = filters
    .filter(
      (f) =>
        f.type !== FILTER_TYPE.ALL ||
        (f.type == FILTER_TYPE.ALL && f.config && 'organizations' in f.config)
    )
    .map((filter, index) => ({
      id: filter.id,
      renderContent: () => {
        return (
          <QueryOverviewFilterListItem
            key={filter.id}
            filter={filter}
            filterIndex={index}
            onDeleteFilter={onDeleteFilter}
            onEditFilter={onEditFilter}
            readOnly={readOnly}
            showDiagram={!dragging}
          />
        );
      },
    }));

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
        }}
      >
        <SmartSearchSankeyProvider
          filters={filters}
          hoverColor={theme.palette.primary.main}
        >
          <List sx={{ overflowY: 'auto', paddingX: 4 }}>
            <QueryOverviewListItem
              canEdit={!readOnly}
              diagram={(hovered) =>
                !dragging && <SmartSearchSankeyEntrySegment hovered={hovered} />
              }
              filterText={<DisplayStartsWith startsWithAll={startsWithAll} />}
              icon={
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
              }
              onClickEdit={onOpenStartsWithEditor}
            />
            <ZUIReorderable
              centerWidgets
              items={reorderableItems}
              onDragEnd={() => {
                setDragging(false);
              }}
              onDragStart={() => {
                setDragging(true);
              }}
              onReorder={(ids) => {
                setDragging(false);
                onReorderFilters(
                  filters
                    .concat()
                    .sort((f0, f1) => ids.indexOf(f0.id) - ids.indexOf(f1.id))
                );
              }}
              widgets={[
                ZUIReorderableWidget.MOVE_UP,
                ZUIReorderableWidget.DRAG,
                ZUIReorderableWidget.MOVE_DOWN,
              ]}
              widgetsOnlyOnHover
              widgetsProps={{
                sx: {
                  left: -40,
                  position: 'absolute',
                },
              }}
            />
            <Divider />
            <QueryOverviewListItem
              diagram={!dragging && <SmartSearchSankeyExitSegment />}
            />
          </List>
        </SmartSearchSankeyProvider>
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
            alignItems="center"
            display="flex"
            justifyContent="flex-end"
            m={1}
            style={{ gap: '1rem' }}
          >
            <Typography color={theme.palette.text.secondary}>
              <Msg
                id={messageIds.resultHint.hint}
                values={{
                  count: (
                    <Typography
                      color={theme.palette.text.primary}
                      component="span"
                    >
                      <Msg
                        id={messageIds.resultHint.countLabel}
                        values={{ count: resultCount }}
                      />
                    </Typography>
                  ),
                }}
              />
            </Typography>
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
