import {
  Check,
  ListAlt,
  PriorityHigh,
  ViewModuleOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Paper,
  Popper,
  PopperProps,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { FC, KeyboardEvent, useMemo, useState } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  MuiEvent,
} from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import ViewDataModel from 'features/views/models/ViewDataModel';
import { ZetkinObjectAccess } from 'core/api/types';
import ZUIFuture from 'zui/ZUIFuture';
import { OrganizerActionViewColumn, ZetkinViewRow } from '../../types';
import theme from 'theme';

import { getEllipsedString } from 'utils/stringUtils';
import messageIds from 'features/views/l10n/messageIds';
import { Msg } from 'core/i18n';
import { usePanes } from 'utils/panes';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { ZetkinOrganizerAction } from 'utils/types/zetkin';
import { OrganizerActionPane } from 'features/callAssignments/panes/OrganizerActionPane';
import { ModelBase } from 'core/models';
import useViewDataModel from 'features/views/hooks/useViewDataModel';

type OrganizerActionViewCell = null | [ZetkinOrganizerAction];

export default class OrganizerActionColumnType implements IColumnType {
  cellToString(cell: OrganizerActionViewCell): string {
    return cell?.value ? cell.value.toString() : Boolean(cell).toString();
  }

  getColDef(column: OrganizerActionViewColumn): Omit<GridColDef, 'field'> {
    return {
      align: 'center',
      headerAlign: 'center',
      renderCell: (
        params: GridRenderCellParams<OrganizerActionViewCell, ZetkinViewRow>
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

  handleKeyDown(
    model: ViewDataModel,
    column: OrganizerActionViewColumn,
    personId: number,
    data: OrganizerActionViewCell,
    ev: MuiEvent<KeyboardEvent<HTMLElement>>,
    accessLevel: ZetkinObjectAccess['level']
  ): void {
    if (accessLevel) {
      // Any non-null value means we're in restricted mode
      return;
    }

    if (ev.key == 'Enter' || ev.key == ' ') {
      model.toggleTag(personId, column.config.tag_id, !data);
      ev.defaultMuiPrevented = true;
    }
  }
}

const useStyles = makeStyles(() => ({
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

  if (cell?.length) {
    if (!isRestricted) {
      // Onclick?
    }
    const numUnsolved = cell.filter(
      (call) => !call.organizer_action_taken
    ).length;
    const styles = useStyles({ numUnsolved });
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
};

interface PreviewPopperProps {
  anchorEl?: PopperProps['anchorEl'];
  onOpenCalls?: () => void;
  calls: OrganizerActionViewCell;
}

const usePopperStyles = makeStyles(() => ({
  buttonBox: {
    display: 'flex',
    justifyContent: 'end',
  },
  buttonIcon: { marginRight: '0.2em' },
  container: {
    width: 300,
  },
  header: {
    fontSize: '1.1em',
  },
  timestamp: {
    color: 'grey',
  },
}));

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
          <Typography variant="h6">
            <Msg id={messageIds.cells.organizerAction.actionNeeded} />
          </Typography>
          {sortedUnsolved?.map((call) => (
            <Box key={call.id}>
              <ZUIRelativeTime datetime={call.update_time} />
              <Typography>
                {getEllipsedString(call.message_to_organizer, 70)}
              </Typography>
            </Box>
          ))}
          {numSolved > 0 ? (
            <Typography variant="h6">
              <Msg
                id={messageIds.cells.organizerAction.solvedIssues}
                values={{ count: numSolved }}
              />
            </Typography>
          ) : null}
          <Box className={styles.buttonBox}>
            <Button onClick={onOpenCalls}>
              <ListAlt className={styles.buttonIcon} />
              <Msg id={messageIds.cells.organizerAction.showDetails} />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Popper>
  );
};
