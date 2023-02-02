import { GridColDef } from '@mui/x-data-grid-pro';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  List,
  ListItem,
  Paper,
  Popper,
  TextField,
  Typography,
  useAutocomplete,
} from '@mui/material';
import { Close, Person } from '@mui/icons-material';
import { FC, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { IColumnType } from '.';
import { LocalPersonViewColumn } from '../../types';
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
  const query = useRouter().query;
  const intl = useIntl();
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searching, setSearching] = useState(false);
  const model = useViewDataModel();

  const orgId = parseInt(query.orgId as string);

  const updateCellValue = (person: ZetkinPerson | null) => {
    model.setCellValue(row.id, column.id, person?.id ?? null);
  };

  const personSelect = usePersonSelect({
    onChange: (person) => {
      updateCellValue(person);
      setAnchorEl(null);
      setSearching(false);
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
      {cell ? <ZUIAvatar orgId={orgId} personId={cell.id} /> : <Person />}
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
                onBlur={() => setSearching(false)}
                onFocus={() => setSearching(true)}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                height: 'calc(100% - 60px)',
                overflowY: 'scroll',
              }}
            >
              {searching && (
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
              )}

              {!searching && !!cell?.id && (
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  justifyContent="center"
                  width="100%"
                >
                  <ZUIAvatar orgId={orgId} personId={cell.id} size="lg" />
                  <Typography>
                    {`${cell.first_name} ${cell.last_name}`}
                  </Typography>
                  <Button
                    endIcon={<Close />}
                    onClick={() => updateCellValue(null)}
                  >
                    <FormattedMessage id="misc.views.cells.localPerson.clearLabel" />
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
};
