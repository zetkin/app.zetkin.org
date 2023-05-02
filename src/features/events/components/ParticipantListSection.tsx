import EventDataModel from '../models/EventDataModel';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import { FC } from 'react';
import messageIds from 'features/events/l10n/messageIds';
import noPropagate from 'utils/noPropagate';
import { useMessages } from 'core/i18n';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUINumberChip from '../../../zui/ZUINumberChip';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

import { Box, Button, Tooltip, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

interface ParticipantListSectionListProps {
  chipColor: string;
  chipNumber: string;
  description: string;
  model: EventDataModel;
  orgId: number;
  rows: ZetkinEventResponse[] | ZetkinEventParticipant[];
  title: string;
}

const ParticipantListSection: FC<ParticipantListSectionListProps> = ({
  chipColor,
  chipNumber,
  description,
  orgId,
  model,
  rows,
  title,
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
        <ZUIAvatar orgId={orgId} personId={params.row.id} />
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
                <Typography
                  sx={{
                    '&:hover svg': { display: 'inline-block' },
                    cursor: 'pointer',
                  }}
                >
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
      renderCell: (params) => {
        if (params.row.person) {
          return <Typography>{params.row.person.phone}</Typography>;
        } else {
          return <Typography>{params.row.phone}</Typography>;
        }
      },
      resizable: false,
      sortable: false,
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
      renderCell: (params) => {
        if (params.row.person) {
          return (
            <>
              <Button sx={{ marginRight: '10px' }} variant="text">
                {messages.eventParticipantsList.buttonCancel()}
              </Button>
              <Button
                onClick={noPropagate(() => {
                  model.addParticipant(params.row.id);
                })}
                variant="outlined"
              >
                {messages.eventParticipantsList.buttonBook()}
              </Button>
            </>
          );
        } else {
          return (
            <Button variant="text">
              {messages.eventParticipantsList.buttonCancel()}
            </Button>
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
        checkboxSelection
        columns={columns}
        rows={rows ?? []}
      />
    </>
  );
};

export default ParticipantListSection;
