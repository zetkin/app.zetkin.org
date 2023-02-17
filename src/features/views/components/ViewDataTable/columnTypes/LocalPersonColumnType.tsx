import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  InputBase,
  List,
  ListItem,
  ListSubheader,
  Paper,
  Popper,
  Theme,
  Typography,
  useAutocomplete,
} from '@mui/material';

import { IColumnType } from '.';
import useAccessLevel from 'features/views/hooks/useAccessLevel';
import { usePersonSelect } from 'zui/ZUIPersonSelect';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import ViewDataModel from 'features/views/models/ViewDataModel';
import ZUIAvatar from 'zui/ZUIAvatar';
import { Close, Person } from '@mui/icons-material';
import { COLUMN_TYPE, LocalPersonViewColumn } from '../../types';
import { FC, HTMLAttributes, useState } from 'react';
import { GridColDef, useGridApiContext } from '@mui/x-data-grid-pro';
import { ZetkinPerson, ZetkinViewRow } from 'utils/types/zetkin';

type LocalPersonViewCell = null | ZetkinPerson;

export default class LocalPersonColumnType
  implements IColumnType<LocalPersonViewColumn, LocalPersonViewCell>
{
  cellToString(cell: ZetkinPerson | null): string {
    return cell ? `${cell.first_name} ${cell.last_name}` : '';
  }
  getColDef(
    col: LocalPersonViewColumn
  ): Omit<GridColDef<ZetkinViewRow>, 'field'> {
    return {
      align: 'center',
      editable: true,
      filterable: false,
      headerAlign: 'center',

      renderCell: (params) => {
        return <ReadCell cell={params.value} />;
      },
      renderEditCell: (params) => {
        return <Cell cell={params.value} column={col} row={params.row} />;
      },
      sortComparator: (
        val0: LocalPersonViewCell,
        val1: LocalPersonViewCell
      ) => {
        if (!val0 && !val1) {
          return 0;
        }
        if (!val0) {
          return 1;
        }
        if (!val1) {
          return -1;
        }

        const name0 = val0.first_name + val1.last_name;
        const name1 = val1.first_name + val1.last_name;
        return name0.localeCompare(name1);
      },
    };
  }
  getSearchableStrings(cell: LocalPersonViewCell): string[] {
    return cell
      ? ([
          cell.first_name,
          cell.last_name,
          cell.email,
          cell.phone,
          cell.alt_phone,
        ].filter((s) => !!s) as string[])
      : [];
  }
}

const useStyles = makeStyles<Theme, { isRestrictedMode: boolean }>({
  popper: {
    display: 'flex',
    flexDirection: 'column',
    height: (props) => (props.isRestrictedMode ? 'auto' : 400),
    width: 300,
  },
  searchingList: {
    height: 'calc(100% - 40px)',
    minWidth: '250px',
    overflowY: 'scroll',
    paddingLeft: '20px',
    position: 'absolute',
    width: '100%',
  },
});

const ReadCell: FC<{
  cell: LocalPersonViewCell | undefined;
}> = ({ cell }) => {
  const query = useRouter().query;
  const orgId = parseInt(query.orgId as string);

  return (
    <Box>
      {cell ? (
        <ZUIAvatar orgId={orgId} personId={cell.id} />
      ) : (
        <Avatar>
          <Person />
        </Avatar>
      )}
    </Box>
  );
};

const Cell: FC<{
  cell: LocalPersonViewCell | undefined;
  column: LocalPersonViewColumn;
  row: ZetkinViewRow;
}> = ({ cell, column, row }) => {
  const query = useRouter().query;
  const [isRestrictedMode] = useAccessLevel();
  const styles = useStyles({ isRestrictedMode });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searching, setSearching] = useState(false);

  const model = useViewDataModel();

  const orgId = parseInt(query.orgId as string);

  const api = useGridApiContext();

  const updateCellValue = (person: ZetkinPerson | null) => {
    api.current.stopCellEditMode({ field: 'col_' + column.id, id: row.id });
    model.setCellValue(row.id, column.id, person?.id ?? null);
    setSearching(false);
  };

  const personSelect = usePersonSelect({
    initialValue: cell ? cell.first_name + ' ' + cell.last_name : '',
    onChange: (person) => {
      updateCellValue(person);
      setAnchorEl(null);
      setSearching(false);
    },
    selectedPerson: null,
  });

  const autoComplete = useAutocomplete({
    ...personSelect.autoCompleteProps,
    disabled: isRestrictedMode,
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
      <Box ref={(div: HTMLDivElement) => setAnchorEl(div)}>
        <InputBase
          /* eslint-disable-next-line jsx-a11y/no-autofocus */
          autoFocus
          fullWidth
          inputProps={autoComplete.getInputProps()}
          onChange={() => setSearching(true)}
        ></InputBase>
      </Box>
      <Popper
        anchorEl={anchorEl}
        open={!!anchorEl}
        popperOptions={{
          placement: 'bottom',
        }}
      >
        <Paper
          className={styles.popper}
          elevation={2}
          onClick={(ev) => {
            ev.stopPropagation();
            anchorEl?.focus();
          }}
        >
          {isRestrictedMode && (
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              gap={1}
              justifyContent="center"
              width="100%"
            >
              {!!cell && <SelectedPerson orgId={orgId} person={cell} />}
              <Typography fontStyle="italic" variant="caption">
                <FormattedMessage id="misc.views.cells.localPerson.restrictedMode" />
              </Typography>
            </Box>
          )}
          {!isRestrictedMode && (
            <Box display="flex" flexDirection="column" height="100%">
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  height: 'calc(100% - 10px)',
                  justifyContent: 'center',
                  minWidth: '290px',
                  width: '100%',
                }}
              >
                {!!cell?.id && (
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    justifyContent="center"
                  >
                    {!isRestrictedMode && !searching && (
                      <>
                        <SelectedPerson orgId={orgId} person={cell} />
                        <Button
                          endIcon={<Close />}
                          onClick={() => updateCellValue(null)}
                        >
                          <FormattedMessage id="misc.views.cells.localPerson.clearLabel" />
                        </Button>
                      </>
                    )}
                  </Box>
                )}
                <List
                  className={styles.searchingList}
                  sx={{ display: showPeopleInView ? 'block' : 'none' }}
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
                            onClick: () => {
                              updateCellValue(option);
                            },
                          }}
                          orgId={orgId}
                          person={option}
                        />
                      ))}
                    </List>
                  )}
                  {searching && (
                    <List {...autoComplete.getListboxProps()}>
                      <ListSubheader sx={{ position: 'relative' }}>
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
                </List>
              </Box>
            </Box>
          )}
        </Paper>
      </Popper>
    </Box>
  );
};

const SelectedPerson: FC<{ orgId: number; person: ZetkinPerson }> = ({
  orgId,
  person,
}) => {
  return (
    <>
      <ZUIAvatar orgId={orgId} personId={person.id} size="lg" />
      <Typography>{`${person.first_name} ${person.last_name}`}</Typography>
    </>
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
