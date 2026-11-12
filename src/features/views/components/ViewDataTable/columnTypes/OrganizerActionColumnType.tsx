import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Paper,
  Popper,
  PopperProps,
  Stack,
  Typography,
} from '@mui/material';
import { Check, ListAlt, PriorityHigh } from '@mui/icons-material';
import { FC, Fragment, useMemo, useState } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';

import { getEllipsedString } from 'utils/stringUtils';
import { IColumnType } from '.';
import { Msg } from 'core/i18n';
import { OrganizerActionPane } from 'features/callAssignments/panes/OrganizerActionPane';
import oldTheme from 'theme';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import { usePanes } from 'utils/panes';
import { ZetkinOrganizerAction } from 'utils/types/zetkin';
import { ZetkinViewRow } from '../../types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import messageIds from 'features/views/l10n/messageIds';
import useToggleDebounce from 'utils/hooks/useToggleDebounce';

type OrganizerActionViewCell = null | ZetkinOrganizerAction[];

const sortByOa = (v1: ZetkinOrganizerAction[], v2: ZetkinOrganizerAction[]) => {
  const getPriority = (v: ZetkinOrganizerAction[]) => {
    if (v.length === 0) {
      return 2;
    }
    if (v.every((oan) => oan.organizer_action_taken)) {
      return 1;
    }
    return 0;
  };

  return getPriority(v1) - getPriority(v2);
};

export default class OrganizerActionColumnType implements IColumnType {
  cellToString(cell: OrganizerActionViewCell): string {
    const requiresAction = cell?.length
      ? cell.some((oan) => !oan.organizer_action_taken)
      : false;

    return requiresAction ? 'X' : '';
  }

  getColDef(): Omit<GridColDef, 'field'> {
    return {
      align: 'center',
      headerAlign: 'center',
      renderCell: (
        params: GridRenderCellParams<ZetkinViewRow, OrganizerActionViewCell>
      ) => {
        // Get the index of the column
        const columnIdx = Object.keys(params.row).indexOf(params.field) - 1;
        return (
          <Cell
            cell={params.value}
            columnIdx={columnIdx}
            personId={params.row.id}
          />
        );
      },
      sortComparator: (v1, v2) => sortByOa(v1, v2),
    };
  }

  getSearchableStrings(): string[] {
    return [];
  }
}

const Cell: FC<{
  cell?: OrganizerActionViewCell;
  columnIdx: number;
  personId: number;
}> = ({ cell, columnIdx, personId }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);
  const viewId = parseInt(query.viewId as string);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openPane } = usePanes();
  const { open: openPopper, close: closePopper } = useToggleDebounce(
    (ev) => setAnchorEl(ev.currentTarget),
    () => setAnchorEl(null)
  );

  const [isRestricted] = useAccessLevel();
  const numUnsolved =
    cell?.filter((call) => !call.organizer_action_taken).length ?? 0;

  if (cell?.length) {
    if (!isRestricted) {
      // Onclick?
    }
    return (
      <Box
        onMouseOut={closePopper}
        onMouseOver={openPopper}
        sx={{
          alignItems: 'center',
          backgroundColor:
            numUnsolved > 0
              ? oldTheme.palette.statusColors.orange
              : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {numUnsolved < 1 ? (
          <Check />
        ) : (
          <>
            <Typography sx={{ fontSize: '1.3em' }}>
              {numUnsolved > 1 ? numUnsolved : null}
            </Typography>
            <PriorityHigh />
          </>
        )}
        <PreviewPopper
          anchorEl={anchorEl}
          calls={cell}
          onOpenCalls={() => {
            openPane({
              render() {
                return (
                  <OrganizerActionPane
                    columnIdx={columnIdx}
                    orgId={orgId}
                    personId={personId}
                    viewId={viewId}
                  />
                );
              },
              width: 400,
            });
          }}
        />
      </Box>
    );
  }

  return null;
};

interface PreviewPopperProps {
  anchorEl?: PopperProps['anchorEl'];
  onOpenCalls?: () => void;
  calls: OrganizerActionViewCell;
}

export const PreviewPopper: FC<PreviewPopperProps> = ({
  anchorEl,
  onOpenCalls,
  calls,
}) => {
  const sortedUnsolved = useMemo(
    () =>
      calls
        ?.filter((call) => !call.organizer_action_taken)
        .sort((call0, call1) => {
          const d0 = new Date(call0.update_time);
          const d1 = new Date(call1.update_time);
          return d1.getTime() - d0.getTime();
        }),
    [calls]
  );

  const numSolved =
    calls?.filter((call) => !!call.organizer_action_taken).length || 0;

  return (
    <Popper
      anchorEl={anchorEl}
      open={!!anchorEl}
      popperOptions={{
        placement: 'left',
      }}
      sx={{
        width: 300,
      }}
    >
      <Paper elevation={2}>
        <Stack sx={{ alignItems: 'flex-start', gap: 1, padding: 2 }}>
          <Typography variant="h5">
            <Msg id={messageIds.cells.organizerAction.actionNeeded} />
          </Typography>
          {sortedUnsolved?.map((call) => (
            <Fragment key={call.id}>
              <Typography color="secondary">
                <ZUIRelativeTime datetime={call.update_time} />
              </Typography>
              <Typography color="secondary">{call.assignment.title}</Typography>
              <Typography>
                {getEllipsedString(call.message_to_organizer || '', 70)}
              </Typography>
            </Fragment>
          ))}
          {numSolved > 0 ? (
            <Typography color="secondary">
              <Msg
                id={messageIds.cells.organizerAction.solvedIssues}
                values={{ count: numSolved }}
              />
            </Typography>
          ) : null}
          <Button onClick={onOpenCalls} startIcon={<ListAlt />}>
            <Msg id={messageIds.cells.organizerAction.showDetails} />
          </Button>
        </Stack>
      </Paper>
    </Popper>
  );
};
