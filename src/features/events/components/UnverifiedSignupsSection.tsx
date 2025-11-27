import { Box, Button, Link, Typography } from '@mui/material';
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import filterParticipants from '../utils/filterParticipants';
import messageIds from 'features/events/l10n/messageIds';
import { EventSignupModelType } from '../models';
import noPropagate from 'utils/noPropagate';
import { useMessages } from 'core/i18n';
import { useApiClient } from 'core/hooks';
import usePersonSearch from 'features/profile/hooks/usePersonSearch';
import useUnverifiedSignupMutations from '../hooks/useUnverifiedSignupMutations';
import ZUINumberChip from 'zui/ZUINumberChip';
import ZUIPersonGridEditCell from 'zui/ZUIPersonGridEditCell';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUICreatePerson from 'zui/ZUICreatePerson';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import { ZetkinPerson } from 'utils/types/zetkin';

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

const LinkReadCell: FC<{
  linkedPerson?: ZetkinPerson;
  linkedPersonId: number | null;
  orgId: number;
  params: GridRenderCellParams<EventSignupModelType>;
}> = ({ params, orgId, linkedPerson, linkedPersonId }) => {
  const api = useGridApiContext();
  const messages = useMessages(messageIds);

  const startEditing = () => {
    api.current.startCellEditMode({
      field: 'link',
      id: params.row.id,
    });
  };

  if (linkedPerson) {
    return (
      <Box onClick={noPropagate(startEditing)} sx={{ cursor: 'pointer' }}>
        <ZUIPersonHoverCard personId={linkedPerson.id}>
          <ZUIPerson
            id={linkedPerson.id}
            link={false}
            name={`${linkedPerson.first_name} ${linkedPerson.last_name}`}
            showText={false}
            size={32}
          />
        </ZUIPersonHoverCard>
      </Box>
    );
  }

  if (linkedPersonId) {
    return (
      <Link href={`/organize/${orgId}/people/${linkedPersonId}`}>
        <Typography>{linkedPersonId}</Typography>
      </Link>
    );
  }

  return (
    <Link onClick={startEditing} sx={{ cursor: 'pointer' }}>
      {messages.eventParticipantsList.actions.link()}
    </Link>
  );
};

const LinkEditCell: FC<{
  onCreatePerson: (signup: EventSignupModelType) => void;
  onLinkChange: (
    signupId: string,
    person: ZetkinPerson | null
  ) => Promise<void>;
  orgId: number;
  params: GridRenderCellParams<EventSignupModelType>;
}> = ({ params, orgId, onLinkChange, onCreatePerson }) => {
  const api = useGridApiContext();
  const messages = useMessages(messageIds);

  const emailOrName =
    params.row.email ||
    `${params.row.first_name} ${params.row.last_name}`.trim() ||
    '';

  const { results: suggestedPeople, setQuery } = usePersonSearch(orgId);

  useEffect(() => {
    if (emailOrName.length > 2) {
      setQuery(emailOrName);
    }
  }, [emailOrName, setQuery]);

  const updateCellValue = async (person: ZetkinPerson | null) => {
    api.current.stopCellEditMode({
      field: 'link',
      id: params.row.id,
    });
    await onLinkChange(params.row.id, person);
  };

  return (
    <ZUIPersonGridEditCell
      cell={null}
      onCreate={() => onCreatePerson(params.row)}
      onUpdate={updateCellValue}
      removePersonLabel={messages.eventParticipantsList.actions.unlink()}
      suggestedPeople={suggestedPeople}
      suggestedPeopleLabel={messages.eventParticipantsList.actions.suggestedPeople()}
    />
  );
};

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
  const apiClient = useApiClient();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { bookUnverifiedSignup, deleteUnverifiedSignup, linkSignupToPerson } =
    useUnverifiedSignupMutations(orgId, eventId);
  const [linkedPersons, setLinkedPersons] = useState<
    Record<string, number | null>
  >(() => {
    const initial: Record<string, number | null> = {};
    rows.forEach((row) => {
      if (row.person_id) {
        initial[row.id] = row.person_id;
      }
    });
    return initial;
  });
  const [loadingSignups, setLoadingSignups] = useState<Set<string>>(new Set());
  const [linkedPersonDetails, setLinkedPersonDetails] = useState<
    Record<string, ZetkinPerson>
  >({});
  const linkedPersonDetailsRef = useRef(linkedPersonDetails);
  const [createPersonSignup, setCreatePersonSignup] =
    useState<EventSignupModelType | null>(null);
  const [bulkLoading, setBulkLoading] = useState<'book' | 'remove' | null>(
    null
  );

  useEffect(() => {
    setLinkedPersons((prev) => {
      let changed = false;
      const next = { ...prev };

      rows.forEach((row) => {
        if (row.person_id && next[row.id] !== row.person_id) {
          next[row.id] = row.person_id;
          changed = true;
        } else if (
          !row.person_id &&
          Object.prototype.hasOwnProperty.call(next, row.id) &&
          next[row.id] !== null
        ) {
          next[row.id] = null;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [rows]);

  useEffect(() => {
    linkedPersonDetailsRef.current = linkedPersonDetails;
  }, [linkedPersonDetails]);

  useEffect(() => {
    const fetchPersons = async () => {
      const missingRows = rows.filter((row) => {
        const personId = linkedPersons[row.id] ?? row.person_id;
        return personId && !linkedPersonDetailsRef.current[row.id];
      });

      if (!missingRows.length) {
        return;
      }

      await Promise.all(
        missingRows.map(async (row) => {
          const personId = linkedPersons[row.id] ?? row.person_id;
          if (!personId) {
            return;
          }
          try {
            const person = await apiClient.get<ZetkinPerson>(
              `/api/orgs/${orgId}/people/${personId}`
            );
            setLinkedPersonDetails((prev) => ({
              ...prev,
              [row.id]: person,
            }));
          } catch {
            // Ignore failures when person data cannot be loaded
          }
        })
      );
    };

    fetchPersons();
  }, [apiClient, linkedPersons, orgId, rows]);

  const displayRows = useMemo(() => {
    return rows.map((row) => {
      const person = linkedPersonDetails[row.id];
      const activePersonId = linkedPersons[row.id] ?? row.person_id;
      if (!person || !activePersonId) {
        return row;
      }
      return {
        ...row,
        created: row.created,
        email: person.email ?? row.email,
        first_name: person.first_name ?? row.first_name,
        last_name: person.last_name ?? row.last_name,
        phone: person.phone ?? row.phone ?? undefined,
      };
    });
  }, [linkedPersonDetails, linkedPersons, rows]);

  const linkableRows = useMemo(
    () => rows.filter((row) => Boolean(linkedPersons[row.id] ?? row.person_id)),
    [linkedPersons, rows]
  );

  const handleLinkChange = useCallback(
    async (signupId: string, person: ZetkinPerson | null) => {
      await linkSignupToPerson(signupId, person?.id ?? null);
      setLinkedPersons((prev) => ({
        ...prev,
        [signupId]: person?.id ?? null,
      }));
      setLinkedPersonDetails((prev) => {
        const next = { ...prev };
        if (person) {
          next[signupId] = person;
        } else {
          delete next[signupId];
        }
        return next;
      });
    },
    [linkSignupToPerson]
  );

  const runBulkBook = useCallback(async () => {
    setBulkLoading('book');
    try {
      for (const signup of linkableRows) {
        const linkedId = linkedPersons[signup.id] ?? signup.person_id;
        await bookUnverifiedSignup(signup, linkedId || undefined);
      }
    } finally {
      setBulkLoading(null);
    }
  }, [bookUnverifiedSignup, linkableRows, linkedPersons]);

  const runBulkRemove = useCallback(async () => {
    setBulkLoading('remove');
    try {
      for (const signup of rows) {
        await deleteUnverifiedSignup(signup.id);
      }
    } finally {
      setBulkLoading(null);
    }
  }, [deleteUnverifiedSignup, rows]);

  const confirmBulkBook = useCallback(() => {
    showConfirmDialog({
      onSubmit: () => runBulkBook(),
      title: messages.eventParticipantsList.confirmBulkBook({
        count: linkableRows.length,
      }),
      warningText: messages.eventParticipantsList.confirmBulkBookDescription(),
    });
  }, [
    linkableRows.length,
    messages.eventParticipantsList,
    runBulkBook,
    showConfirmDialog,
  ]);

  const confirmBulkRemove = useCallback(() => {
    showConfirmDialog({
      onSubmit: () => runBulkRemove(),
      title: messages.eventParticipantsList.confirmBulkRemove({
        count: rows.length,
      }),
      warningText:
        messages.eventParticipantsList.confirmBulkRemoveDescription(),
    });
  }, [
    messages.eventParticipantsList,
    rows.length,
    runBulkRemove,
    showConfirmDialog,
  ]);

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
          <ZUIRelativeTime
            datetime={
              typeof params.row.created === 'string'
                ? params.row.created
                : params.row.created.toISOString()
            }
          />
        ) : (
          <Typography>—</Typography>
        ),
      resizable: false,
      sortingOrder: ['asc', 'desc', null],
      valueGetter: (params) =>
        params.row.created ? new Date(params.row.created) : null,
    },
    {
      disableColumnMenu: true,
      editable: true,
      field: 'link',
      flex: 1,
      headerName: messages.eventParticipantsList.columnLinking(),
      renderCell: (params) => (
        <LinkReadCell
          linkedPerson={
            linkedPersons[params.row.id] ?? params.row.person_id
              ? linkedPersonDetails[params.row.id]
              : undefined
          }
          linkedPersonId={
            linkedPersons[params.row.id] ?? params.row.person_id ?? null
          }
          orgId={orgId}
          params={params}
        />
      ),
      renderEditCell: (params) => (
        <LinkEditCell
          onCreatePerson={(signup) => setCreatePersonSignup(signup)}
          onLinkChange={handleLinkChange}
          orgId={orgId}
          params={params}
        />
      ),
      resizable: false,
      sortable: false,
    },
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'actions',
      flex: 1,
      headerName: messages.eventParticipantsList.columnAction(),
      minWidth: 200,
      renderCell: (params) => {
        const isLoading = loadingSignups.has(params.row.id);
        const linkedPersonId =
          linkedPersons[params.row.id] ?? params.row.person_id;

        return (
          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button
              disabled={isLoading}
              onClick={noPropagate(async () => {
                setLoadingSignups((prev) => new Set(prev).add(params.row.id));
                try {
                  await deleteUnverifiedSignup(params.row.id);
                } finally {
                  setLoadingSignups((prev) => {
                    const next = new Set(prev);
                    next.delete(params.row.id);
                    return next;
                  });
                }
              })}
              size="small"
              variant="text"
            >
              {messages.eventParticipantsList.actions.remove()}
            </Button>
            <Button
              disabled={isLoading || !linkedPersonId}
              onClick={noPropagate(async () => {
                setLoadingSignups((prev) => new Set(prev).add(params.row.id));
                try {
                  await bookUnverifiedSignup(
                    params.row,
                    linkedPersonId || undefined
                  );
                } finally {
                  setLoadingSignups((prev) => {
                    const next = new Set(prev);
                    next.delete(params.row.id);
                    return next;
                  });
                }
              })}
              size="small"
              variant="outlined"
            >
              {messages.eventParticipantsList.actions.book()}
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
      <Box display="flex" gap={1} justifyContent="flex-end" mb={2}>
        <Button
          disabled={!rows.length || bulkLoading !== null}
          onClick={confirmBulkRemove}
          size="small"
          variant="text"
        >
          {messages.eventParticipantsList.bulkRemoveAll()}
        </Button>
        <Button
          disabled={!linkableRows.length || bulkLoading !== null}
          onClick={confirmBulkBook}
          size="small"
          variant="contained"
        >
          {messages.eventParticipantsList.bulkBookAll()}
        </Button>
      </Box>
      <DataGridPro<EventSignupModelType>
        autoHeight
        checkboxSelection={false}
        columns={columns}
        rows={
          filterString
            ? (filterParticipants(
                displayRows,
                filterString
              ) as EventSignupModelType[])
            : displayRows
        }
        sx={{
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
      />
      {createPersonSignup && (
        <ZUICreatePerson
          initialValues={{
            email: createPersonSignup.email ?? null,
            first_name: createPersonSignup.first_name,
            last_name: createPersonSignup.last_name,
            phone: createPersonSignup.phone ?? null,
          }}
          onClose={() => setCreatePersonSignup(null)}
          onSubmit={async (_, person) => {
            await handleLinkChange(createPersonSignup.id, person);
          }}
          open={!!createPersonSignup}
        />
      )}
    </>
  );
};

export default UnverifiedSignupsSection;
