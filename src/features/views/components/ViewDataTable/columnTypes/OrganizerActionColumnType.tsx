import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Paper,
  Popper,
  PopperProps,
  Typography,
} from '@mui/material';
import { Check, ListAlt, PriorityHigh } from '@mui/icons-material';
import { FC, useMemo, useState } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';

import { getEllipsedString } from 'utils/stringUtils';
import { IColumnType } from '.';
import { Msg } from 'core/i18n';
import { OrganizerActionPane } from 'features/callAssignments/panes/OrganizerActionPane';
import theme from 'theme';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import { usePanes } from 'utils/panes';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import { ZetkinOrganizerAction } from 'utils/types/zetkin';
import { ZetkinViewRow } from '../../types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

import messageIds from 'features/views/l10n/messageIds';

type OrganizerActionViewCell = null | ZetkinOrganizerAction[];

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
    };
  }

  getSearchableStrings(): string[] {
    return [];
  }
}

const useStyles = makeStyles<typeof theme, { numUnsolved: number }>(() => ({
  organizerActionContainer: {
    alignItems: 'center',
    backgroundColor: (props) =>
      props.numUnsolved > 0 ? theme.palette.statusColors.orange : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
}));

const Cell: FC<{
  cell?: OrganizerActionViewCell;
  columnIdx: number;
  personId: number;
}> = ({ cell, columnIdx, personId }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openPane } = usePanes();
  const viewModel = useViewDataModel();

  const [isRestricted] = useAccessLevel();
  const numUnsolved =
    cell?.filter((call) => !call.organizer_action_taken).length ?? 0;
  const styles = useStyles({ numUnsolved });

  if (cell?.length) {
    if (!isRestricted) {
      // Onclick?
    }
    return (
      <Box
        className={styles.organizerActionContainer}
        onMouseOut={() => setAnchorEl(null)}
        onMouseOver={(ev) => setAnchorEl(ev.currentTarget)}
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
                    viewModel={viewModel}
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

const usePopperStyles = makeStyles({
  buttonBox: {
    display: 'flex',
    justifyContent: 'end',
  },
  container: {
    width: 300,
  },
  header: {
    color: 'grey',
    fontSize: '1em',
    fontWeight: 'bold',
    paddingBottom: '1em',
    textTransform: 'uppercase',
  },
  messageToOrganizer: {
    paddingBottom: '0.7em',
  },
  solvedIssues: {
    color: 'grey',
    fontSize: '1em',
    fontWeight: 'bold',
    paddingTop: '1em',
    textTransform: 'uppercase',
  },
  timestamp: {
    color: 'grey',
    paddingBottom: '0.5em',
  },
});

const PreviewPopper: FC<PreviewPopperProps> = ({
  anchorEl,
  onOpenCalls,
  calls,
}) => {
  const styles = usePopperStyles();
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
      className={styles.container}
      open={!!anchorEl}
      popperOptions={{
        placement: 'left',
      }}
    >
      <Paper elevation={2}>
        <Box p={2}>
          <Typography className={styles.header}>
            <Msg id={messageIds.cells.organizerAction.actionNeeded} />
          </Typography>
          {sortedUnsolved?.map((call) => (
            <Box key={call.id}>
              <Typography className={styles.timestamp}>
                <ZUIRelativeTime datetime={call.update_time} />
              </Typography>
              <Typography className={styles.messageToOrganizer}>
                {getEllipsedString(call.message_to_organizer || '', 70)}
              </Typography>
            </Box>
          ))}
          {numSolved > 0 ? (
            <Typography className={styles.header}>
              <Msg
                id={messageIds.cells.organizerAction.solvedIssues}
                values={{ count: numSolved }}
              />
            </Typography>
          ) : null}
          <Box className={styles.buttonBox}>
            <Button onClick={onOpenCalls} startIcon={<ListAlt />}>
              <Msg id={messageIds.cells.organizerAction.showDetails} />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Popper>
  );
};
