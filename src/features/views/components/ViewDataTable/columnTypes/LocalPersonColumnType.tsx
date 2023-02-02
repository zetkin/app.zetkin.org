import { GridColDef } from '@mui/x-data-grid-pro';
import { makeStyles } from '@mui/styles';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import {
  Box,
  List,
  ListItem,
  Paper,
  Popper,
  TextField,
  useAutocomplete,
} from '@mui/material';
import { FC, useState } from 'react';

import { IColumnType } from '.';
import { LocalPersonViewColumn } from '../../types';
import { Person } from '@mui/icons-material';
import { usePersonSelect } from 'zui/ZUIPersonSelect';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import ZUIAvatar from 'zui/ZUIAvatar';
import { ZetkinPerson, ZetkinViewRow } from 'utils/types/zetkin';

type LocalPersonViewCell = null | {
  first_name: string;
  id: number;
  last_name: string;
};

export default class LocalPersonColumnType implements IColumnType {
  cellToString(cell: ZetkinPerson): string {
    return `${cell.first_name} ${cell.last_name}`;
  }
  getColDef(
    col: LocalPersonViewColumn
  ): Omit<GridColDef<ZetkinViewRow>, 'field'> {
    return {
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return <Cell cell={params.value} column={col} row={params.row} />;
      },
    };
  }
}

const useStyles = makeStyles({
  popper: {
    display: 'flex',
    flexDirection: 'column',
    height: 400,
    padding: '10px',
    width: 300,
  },
});

const Cell: FC<{
  cell: LocalPersonViewCell;
  column: LocalPersonViewColumn;
  row: ZetkinViewRow;
}> = ({ cell, column, row }) => {
  const { orgId } = useRouter().query;
  const intl = useIntl();
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const model = useViewDataModel();

  const personSelect = usePersonSelect({
    onChange: (person) => {
      model.setCellValue(row.id, column.id, person.id);
      setAnchorEl(null);
    },
    selectedPerson: null,
  });

  const autoComplete = useAutocomplete({
    ...personSelect.autoCompleteProps,
  });

  return (
    <Box
      onMouseEnter={(ev) => {
        setAnchorEl(ev.currentTarget);
      }}
      onMouseLeave={() => {
        setAnchorEl(null);
      }}
    >
      {cell ? (
        <ZUIAvatar orgId={parseInt(orgId as string)} personId={cell.id} />
      ) : (
        <Person />
      )}
      <Popper anchorEl={anchorEl} open={!!anchorEl}>
        <Paper
          className={styles.popper}
          elevation={2}
          onClick={(ev) => {
            ev.stopPropagation();
          }}
        >
          <Box display="flex" flexDirection="column" height="100%">
            <Box flex={0} height={60}>
              <TextField
                fullWidth
                inputProps={autoComplete.getInputProps()}
                label={intl.formatMessage({
                  id: 'misc.views.cells.localPerson.searchLabel',
                })}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                height: 'calc(100% - 60px)',
                overflowY: 'scroll',
              }}
            >
              <List {...autoComplete.getListboxProps()}>
                {(autoComplete.groupedOptions as ZetkinPerson[]).map(
                  (option, index) => {
                    const optProps = autoComplete.getOptionProps({
                      index,
                      option,
                    });
                    return (
                      <ListItem key={option.id} {...optProps}>
                        {`${option.first_name} ${option.last_name}`}
                      </ListItem>
                    );
                  }
                )}
              </List>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
};
