import { Box, Button, Link, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { FC, PointerEventHandler, useContext, useState } from 'react';

import { useMessages } from 'core/i18n';
import messageIds from 'features/events/l10n/messageIds';
import noPropagate from 'utils/noPropagate';
import ZUICreatePerson from 'zui/ZUICreatePerson';
import ZUINumberChip from 'zui/ZUINumberChip';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import useUnverifiedSignupMutations from '../hooks/useUnverifiedSignupMutations';
import { EventSignupModelType } from '../models';
import { filterUnverifiedSignups } from '../utils/filterParticipants';
import { UnverifiedSignupLinkDialog } from './UnverifiedSignupLinkDialog';

interface UnverifiedSignupsSectionProps {
  chipColor: string;
  chipNumber: string;
  description: string;
  filterString: string;
  eventId: number;
  orgId: number;
  rows: EventSignupModelType[];
  title: string;
}

type SignupState =
  | { mode: 'idle' }
  | { mode: 'booking'; signup: EventSignupModelType }
  | { mode: 'linking'; signup: EventSignupModelType }
  | { mode: 'creating'; signup: EventSignupModelType };

const UnverifiedSignupsSection: FC<UnverifiedSignupsSectionProps> = ({
  chipColor,
  chipNumber,
  description,
  filterString,
  eventId,
  orgId,
  rows,
  title,
}) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const { bookSignup, linkSignup } = useUnverifiedSignupMutations(
    orgId,
    eventId
  );

  const [signUpState, setSignUpState] = useState<SignupState>({ mode: 'idle' });

  const linkingSignup =
    signUpState.mode === 'linking' ? signUpState.signup : null;
  const creatingSignup =
    signUpState.mode === 'creating' ? signUpState.signup : null;

  const activeSignupId = 'signup' in signUpState ? signUpState.signup.id : null;
  const isActiveRow = signUpState.mode !== 'idle';
  const isRowDisabled = (signupId: string) =>
    isActiveRow && activeSignupId !== signupId;
  const isRowLoading = (signupId: string) =>
    isActiveRow && activeSignupId === signupId;

  const handleRowBookAction: (
    row: EventSignupModelType
  ) => PointerEventHandler<HTMLButtonElement> = (row) =>
    noPropagate(async () => {
      setSignUpState({ mode: 'booking', signup: row });

      try {
        const result = await bookSignup(row.id);

        if (result.matched) {
          showSnackbar(
            'success',
            messages.unverifiedSignups.exactMatchBooked({
              name: `${row.first_name} ${row.last_name}`,
            })
          );
          setSignUpState({ mode: 'idle' });
        } else {
          setSignUpState({ mode: 'linking', signup: row });
        }
      } catch {
        setSignUpState({ mode: 'idle' });
        showSnackbar('error', messages.unverifiedSignups.actionFailed());
      }
    });

  const handleLinkPerson = async (personId: number) => {
    if (!linkingSignup) {
      return;
    }

    setSignUpState({ mode: 'booking', signup: linkingSignup });

    try {
      await linkSignup(linkingSignup.id, personId);
      showSnackbar(
        'success',
        messages.unverifiedSignups.booked({
          name: `${linkingSignup.first_name} ${linkingSignup.last_name}`,
        })
      );
    } catch {
      showSnackbar('error', messages.unverifiedSignups.actionFailed());
    } finally {
      setSignUpState({ mode: 'idle' });
    }
  };

  const handleCreatePersonFromLink = () => {
    if (linkingSignup) {
      setSignUpState({ mode: 'creating', signup: linkingSignup });
    }
  };

  const columns: GridColDef<EventSignupModelType>[] = [
    {
      disableColumnMenu: true,
      field: 'name',
      flex: 1,
      headerName: messages.eventParticipantsList.columnName(),
      minWidth: 250,
      renderCell: (params) => (
        <Typography>
          {params.row.first_name} {params.row.last_name}
        </Typography>
      ),
      resizable: false,
      sortingOrder: ['asc', 'desc', null],
      valueGetter: (params) =>
        `${params.row.first_name || ''} ${params.row.last_name || ''}`,
    },
    {
      disableColumnMenu: true,
      field: 'phone',
      flex: 1,
      headerName: messages.eventParticipantsList.columnPhone(),
      renderCell: (params) =>
        params.row.phone ? (
          <Link href={`tel:${params.row.phone}`}>{params.row.phone}</Link>
        ) : null,
      resizable: false,
      sortingOrder: ['asc', 'desc', null],
    },
    {
      disableColumnMenu: true,
      field: 'email',
      flex: 1,
      headerName: messages.eventParticipantsList.columnEmail(),
      renderCell: (params) =>
        params.row.email ? (
          <Link href={`mailto:${params.row.email}`}>{params.row.email}</Link>
        ) : null,
      resizable: false,
      sortingOrder: ['asc', 'desc', null],
    },
    {
      disableColumnMenu: true,
      field: 'created',
      flex: 1,
      headerName: messages.eventParticipantsList.columnSignedUp(),
      minWidth: 160,
      renderCell: (params) =>
        params.row.created ? (
          <ZUIRelativeTime datetime={params.row.created} />
        ) : (
          <Typography>—</Typography>
        ),
      resizable: false,
      sortingOrder: ['asc', 'desc', null],
      valueGetter: (params) =>
        params.row.created ? new Date(params.row.created) : null,
    },
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'actions',
      flex: 1,
      headerName: '',
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button
              disabled={isRowDisabled(params.row.id)}
              loading={isRowLoading(params.row.id)}
              onClick={handleRowBookAction(params.row)}
              size="small"
              variant="outlined"
            >
              {messages.eventParticipantsList.buttonBook()}
            </Button>
          </Box>
        );
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
        rows={filterString ? filterUnverifiedSignups(rows, filterString) : rows}
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
      />
      {creatingSignup && (
        <ZUICreatePerson
          initialValues={{
            email: creatingSignup.email ?? null,
            first_name: creatingSignup.first_name,
            last_name: creatingSignup.last_name,
            phone: creatingSignup.phone ?? null,
          }}
          onClose={() => {
            setSignUpState({ mode: 'idle' });
          }}
          onSubmit={async (_, person) => {
            setSignUpState({ mode: 'booking', signup: creatingSignup });
            try {
              await linkSignup(creatingSignup.id, person.id);
              showSnackbar(
                'success',
                messages.unverifiedSignups.booked({
                  name: `${person.first_name} ${person.last_name}`,
                })
              );
            } catch {
              showSnackbar('error', messages.unverifiedSignups.actionFailed());
            } finally {
              setSignUpState({ mode: 'idle' });
            }
          }}
          open={!!creatingSignup}
        />
      )}
      {linkingSignup && (
        <UnverifiedSignupLinkDialog
          onClose={() => {
            setSignUpState({ mode: 'idle' });
          }}
          onCreatePerson={handleCreatePersonFromLink}
          onSelectPerson={(person) => handleLinkPerson(person.id)}
          open={!!linkingSignup}
          orgId={orgId}
          signup={linkingSignup}
        />
      )}
    </>
  );
};

export default UnverifiedSignupsSection;
