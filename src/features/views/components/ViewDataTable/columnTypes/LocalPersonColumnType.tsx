import { GridColDef } from '@mui/x-data-grid-pro';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListSubheader,
  Paper,
  Popper,
  TextField,
  Typography,
  useAutocomplete,
} from '@mui/material';
import { Close, Person } from '@mui/icons-material';
import { FC, HTMLAttributes, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { IColumnType } from '.';
import { usePersonSelect } from 'zui/ZUIPersonSelect';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import ViewDataModel from 'features/views/models/ViewDataModel';
import ZUIAvatar from 'zui/ZUIAvatar';
import { COLUMN_TYPE, LocalPersonViewColumn } from '../../types';
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

  const options = autoComplete.groupedOptions as ZetkinPerson[];
  const peopleInView = usePeopleInView(model, options);
  const showPeopleInView = searching || !cell;

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
        <ZUIAvatar orgId={orgId} personId={cell.id} />
      ) : (
        <Avatar>
          <Person />
        </Avatar>
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
                onBlur={() => setSearching(false)}
                onFocus={() => setSearching(true)}
              />
            </Box>
            <Box
              sx={{
                height: 'calc(100% - 60px)',
                overflowY: 'scroll',
              }}
            >
              {showPeopleInView && !!peopleInView.length && (
                <List>
                  <ListSubheader>
                    <FormattedMessage id="misc.views.cells.localPerson.alreadyInView" />
                  </ListSubheader>
                  {peopleInView.map((option) => (
                    <PersonListItem
                      key={option.id}
                      itemProps={{
                        onClick: () => updateCellValue(option),
                      }}
                      orgId={orgId}
                      person={option}
                    />
                  ))}
                </List>
              )}
              {searching && (
                <List {...autoComplete.getListboxProps()}>
                  <ListSubheader>
                    <FormattedMessage id="misc.views.cells.localPerson.otherPeople" />
                  </ListSubheader>
                  {options.map((option, index) => {
                    const optProps = autoComplete.getOptionProps({
                      index,
                      option,
                    });
                    return (
                      <PersonListItem
                        key={option.id}
                        itemProps={optProps}
                        orgId={orgId}
                        person={option}
                      />
                    );
                  })}
                </List>
              )}

              {!searching && !!cell?.id && (
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="column"
                  gap={1}
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

const PersonListItem: FC<{
  itemProps: HTMLAttributes<HTMLLIElement>;
  orgId: number;
  person: ZetkinPerson;
}> = ({ itemProps, orgId, person }) => {
  return (
    <ListItem
      {...itemProps}
      disablePadding
      sx={{ paddingBottom: 0.5, paddingTop: 0.5 }}
    >
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <ZUIAvatar orgId={orgId} personId={person.id} size="sm" />
        <Typography component="span">
          {`${person.first_name} ${person.last_name}`}
        </Typography>
      </Box>
    </ListItem>
  );
};

function usePeopleInView(
  model: ViewDataModel,
  searchResults: ZetkinPerson[] = []
): ZetkinPerson[] {
  const rows = model.getRows().data;
  const cols = model.getColumns().data;

  if (!rows || !cols) {
    return [];
  }

  const personColumnIndices = cols
    .filter((col) => col.type == COLUMN_TYPE.LOCAL_PERSON)
    .map((col) => cols.indexOf(col));

  const peopleInView: ZetkinPerson[] = [];

  rows.forEach((row) => {
    row.content.forEach((cell, index) => {
      if (!cell) {
        // Skip empty cells
        return;
      }

      if (!personColumnIndices.includes(index)) {
        // Skip non-person cells
        return;
      }

      const person = cell as ZetkinPerson;
      if (peopleInView.some((existing) => existing.id == person.id)) {
        // Skip people that are already in the list
        return;
      }

      peopleInView.push(person);
    });
  });

  if (searchResults.length) {
    // Filter down people in view to only include search matches
    const matchingIds = searchResults.map((person) => person.id);
    return peopleInView.filter((person) => matchingIds.includes(person.id));
  } else {
    return peopleInView;
  }
}
