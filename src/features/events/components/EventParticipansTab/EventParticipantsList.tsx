import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  DataGridPro,
  GridActionsCellItem,
  GridColDef,
} from '@mui/x-data-grid-pro';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUINumberChip from 'zui/ZUINumberChip';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

interface EventParticipansListProps {
  data: ZetkinEvent;
  model: EventDataModel;
  orgId: number;
}

const EventParticipansList: FC<EventParticipansListProps> = ({
  data,
  model,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const bookedParticipants = model.getParticipants().data;

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      renderCell: (params) => (
        <ZUIAvatar orgId={orgId} personId={params.row.id} />
      ),
    },
    {
      field: 'name',
      flex: 1,
      headerName: messages.eventParticipantsList.columnName(),
      valueGetter: (params) =>
        `${params.row.first_name + ' ' + params.row.last_name} `,
    },
    {
      field: 'phone',
      flex: 1,
      headerName: messages.eventParticipantsList.columnPhone(),
      valueGetter: (params) => `${params.row.phone} `,
    },
    {
      field: 'email',
      flex: 1,
      headerName: messages.eventParticipantsList.columnEmail(),
      valueGetter: (params) => `${params.row.email} `,
    },
    {
      field: 'notified',
      flex: 1,
      headerName: messages.eventParticipantsList.columnNotified(),
      renderCell: (params) => (
        <ZUIRelativeTime datetime={params.row.reminder_sent || ' '} />
      ),
    },
    {
      field: 'cancel',
      headerName: '',
      renderCell: () => (
        <GridActionsCellItem
          icon={<Button variant="text">CANCEL</Button>}
          label=""
        />
      ),
    },
  ];

  const bookColumn: GridColDef = {
    field: 'book',
    headerName: '',
    renderCell: () => <Button variant="outlined">BOOK</Button>,
  };

  const signUpsColumns = [...columns, bookColumn];

  return (
    <Box>
      {model.getSignedParticipants() < 1 && (
        <>
          <Box
            id={'Sign-up-header'}
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '15px',
              marginTop: '15px',
            }}
          >
            <Typography mr={2} variant="h4">
              {messages.eventParticipantsList.signUps()}
            </Typography>
            <ZUINumberChip
              color={theme.palette.grey[500]}
              outlined={true}
              value={model.getSignedParticipants()}
            />
          </Box>
          <Typography mb={2} variant="body1">
            {messages.eventParticipantsList.descriptionSignups()}
          </Typography>
          <DataGridPro
            autoHeight
            checkboxSelection
            columns={signUpsColumns}
            rows={model.getPendingSignUps()}
          />
        </>
      )}

      <Box
        id={'Booked-header'}
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginTop: '15px',
        }}
      >
        <Typography mb={2} mr={2} variant="h4">
          {messages.eventParticipantsList.bookedParticipants()}
        </Typography>
        <ZUINumberChip
          color={model.getParticipantStatus(
            data.num_participants_available,
            data.num_participants_required
          )}
          outlined={true}
          value={
            model.getAvailParticipants() + '/' + data.num_participants_required
          }
        />
      </Box>
      <Typography mb={2} variant="body1">
        {messages.eventParticipantsList.descriptionBooked()}
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection
        columns={columns}
        rows={bookedParticipants ?? []}
      />
    </Box>
  );
};

export default EventParticipansList;
