import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import { FC } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import EventDataModel from '../models/EventDataModel';
import filterParticipants from '../utils/filterParticipants';
import noPropagate from 'utils/noPropagate';
import { removeOffset } from 'utils/dateUtils';
import { useMessages } from 'core/i18n';
import ZUINumberChip from '../../../zui/ZUINumberChip';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

import messageIds from 'features/events/l10n/messageIds';

type attendance = 'noshow' | 'attended' | 'cancelled';

interface ButtonOption {
  value?: attendance;
  callback: () => void;
  longTitle?: string;
  title: string;
  variant: 'text' | 'outlined' | 'contained' | undefined;
}

const Buttons: FC<{ options: ButtonOption[] }> = ({ options }) => {
  return (
    <FormControl
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 0.5,
      }}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={noPropagate(() => option.callback())}
          size="small"
          variant={option.variant}
        >
          {option.title}
        </Button>
      ))}
    </FormControl>
  );
};

const Dropdown: FC<{
  label: string;
  options: ButtonOption[];
  value: attendance;
}> = ({ options, value, label }) => {
  return (
    <FormControl size="small" variant="outlined">
      <InputLabel id={'attendance-select-label'}>{label}</InputLabel>
      <Select
        label={label}
        labelId={'attendance-select-label'}
        onChange={(event) => {
          const selected = options.find(
            (option) => option.value == event.target.value
          );
          selected?.callback();
        }}
        value={value}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.longTitle || option.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface ParticipantListSectionListProps {
  chipColor: string;
  chipNumber: string;
  description: string;
  filterString: string;
  model: EventDataModel;
  orgId: number;
  rows: ZetkinEventResponse[] | ZetkinEventParticipant[];
  title: string;
  type: 'booked' | 'cancelled' | 'signups';
}

const ParticipantListSection: FC<ParticipantListSectionListProps> = ({
  chipColor,
  chipNumber,
  description,
  filterString,
  orgId,
  model,
  rows,
  title,
  type,
}) => {
  const messages = useMessages(messageIds);

  const columns: GridColDef[] = [
    {
      align: 'center',
      disableColumnMenu: true,
      field: 'avatar',
      headerName: '',
      hideSortIcons: true,
      renderCell: (params) => (
        <ZUIPersonHoverCard personId={params.row.id}>
          <ZUIPersonAvatar orgId={orgId} personId={params.row.id} />
        </ZUIPersonHoverCard>
      ),
      resizable: false,
      sortable: false,
      width: 20,
    },
    {
      disableColumnMenu: true,
      field: 'name',
      flex: 1,
      headerName: messages.eventParticipantsList.columnName(),
      hideSortIcons: true,
      minWidth: 250,
      renderCell: (params) => {
        if (params.row.person) {
          return <Typography>{params.row.person.name}</Typography>;
        } else {
          return (
            <>
              {model.getData().data?.contact?.id === params.row.id ? (
                <Typography>
                  {params.row.first_name + ' ' + params.row.last_name}
                  <Tooltip
                    title={messages.eventParticipantsList.contactTooltip()}
                  >
                    <FaceOutlinedIcon
                      sx={{ marginLeft: '8px', verticalAlign: 'bottom' }}
                    />
                  </Tooltip>
                </Typography>
              ) : (
                <Typography>
                  {params.row.first_name + ' ' + params.row.last_name}

                  <Tooltip
                    title={messages.eventParticipantsList.participantTooltip()}
                  >
                    <FaceOutlinedIcon
                      onClick={noPropagate(() =>
                        model.setContact(params.row.id)
                      )}
                      sx={{
                        display: 'none',
                        marginLeft: '8px',
                        opacity: '50%',
                        verticalAlign: 'bottom',
                      }}
                    />
                  </Tooltip>
                </Typography>
              )}
            </>
          );
        }
      },
      resizable: false,
      sortable: false,
    },
    {
      disableColumnMenu: true,
      field: 'phone',
      flex: 1,
      headerName: messages.eventParticipantsList.columnPhone(),
      hideSortIcons: true,
      resizable: false,
      sortable: false,
      valueGetter: (params) => {
        if (params.row.person) {
          return params.row.person.phone;
        } else {
          return params.row.phone;
        }
      },
    },
    {
      disableColumnMenu: true,
      field: 'email',
      flex: 1,
      headerName: messages.eventParticipantsList.columnEmail(),
      hideSortIcons: true,
      resizable: false,
      sortable: false,
      valueGetter: (params) => {
        if (params.row.person) {
          return `${params.row.person.email}`;
        } else {
          return `${params.row.email}`;
        }
      },
    },
    {
      disableColumnMenu: true,
      field: 'notified',
      flex: 1,
      headerName: messages.eventParticipantsList.columnNotified(),
      hideSortIcons: true,
      renderCell: (params) => {
        if (params.row.person) {
          return <ZUIRelativeTime datetime={params.row.response_date} />;
        } else {
          return <ZUIRelativeTime datetime={params.row.reminder_sent} />;
        }
      },
      resizable: false,
      sortable: false,
    },
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'cancel',
      flex: 1,
      headerName: '',
      hideSortIcons: true,
      minWidth: 300,
      renderCell: (params) => {
        if (type == 'signups') {
          return (
            <Buttons
              options={[
                {
                  callback: () => {
                    model.cancelParticipant(params.row.id);
                  },
                  title: messages.eventParticipantsList.buttonCancel(),
                  variant: 'text',
                },
                {
                  callback: () => {
                    model.reBookParticipant(params.row.id);
                  },
                  title: messages.eventParticipantsList.buttonBook(),
                  variant: 'outlined',
                },
              ]}
            />
          );
        } else if (type == 'booked') {
          const event = model.getData().data;
          if (event && new Date(removeOffset(event.start_time)) < new Date()) {
            const options: ButtonOption[] = [
              {
                callback: () => {
                  model.cancelParticipant(params.row.id);
                },
                title: messages.eventParticipantsList.buttonCancelled(),
                value: 'cancelled',
                variant: 'text',
              },
              {
                callback: () => {
                  model.noShowParticipant(params.row.id);
                },
                longTitle: messages.eventParticipantsList.dropDownNoshow(),
                title: messages.eventParticipantsList.buttonNoshow(),
                value: 'noshow',
                variant: 'text',
              },
              {
                callback: () => {
                  model.attendedParticipant(params.row.id);
                },
                longTitle: messages.eventParticipantsList.dropDownAttended(),
                title: messages.eventParticipantsList.buttonAttended(),
                value: 'attended',
                variant: 'outlined',
              },
            ];

            if (params.row.noshow || params.row.attended) {
              const value = params.row.attended ? 'attended' : 'noshow';
              return (
                <Dropdown
                  label={messages.eventParticipantsList.attendance()}
                  options={options}
                  value={value}
                />
              );
            } else {
              return <Buttons options={options} />;
            }
          } else {
            return (
              <Buttons
                options={[
                  {
                    callback: () => {
                      model.cancelParticipant(params.row.id);
                    },
                    title: messages.eventParticipantsList.buttonCancel(),
                    variant: 'text',
                  },
                ]}
              />
            );
          }
        } else if (type == 'cancelled') {
          return (
            <Buttons
              options={[
                {
                  callback: () => {
                    model.reBookParticipant(params.row.id);
                  },
                  title: messages.eventParticipantsList.buttonBook(),
                  variant: 'text',
                },
              ]}
            />
          );
        }
      },
      resizable: false,
      sortable: false,
    },
  ];

  return (
    <>
      <Box
        sx={{
          '& div': { backgroundColor: 'transparent' },
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '15px',
          marginTop: '15px',
        }}
      >
        <Typography mr={2} variant="h4">
          {title}
        </Typography>
        <ZUINumberChip color={chipColor} outlined={true} value={chipNumber} />
      </Box>
      <Typography mb={2} variant="body1">
        {description}
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection={false}
        columns={columns}
        rows={
          filterString ? filterParticipants(rows, filterString) : rows ?? []
        }
        sx={{
          '& .MuiDataGrid-row:hover': {
            '&:hover svg': { display: 'inline-block' },
            cursor: 'pointer',
          },
        }}
      />
    </>
  );
};

export default ParticipantListSection;
