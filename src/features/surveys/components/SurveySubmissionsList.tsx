import { Box } from '@mui/system';
import { Link } from '@mui/material';
import { useRouter } from 'next/router';
import {
  DataGridPro,
  GridCellParams,
  GridRenderCellParams,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { FC, useEffect, useMemo, useState } from 'react';

import messageIds from '../l10n/messageIds';
import SurveyLinkDialog from './SurveyLinkDialog';
import SurveySubmissionPane from '../panes/SurveySubmissionPane';
import { useNumericRouteParams } from 'core/hooks';
import { usePanes } from 'utils/panes';
import usePersonSearch from 'features/profile/hooks/usePersonSearch';
import useSurveySubmission from '../hooks/useSurveySubmission';
import ZUIPersonGridCell from 'zui/ZUIPersonGridCell';
import ZUIPersonGridEditCell from 'zui/ZUIPersonGridEditCell';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinPerson, ZetkinSurveySubmission } from 'utils/types/zetkin';

const SurveySubmissionsList = ({
  submissions,
}: {
  submissions: ZetkinSurveySubmission[];
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useRouter().query;
  const { openPane } = usePanes();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPerson, setDialogPerson] = useState<ZetkinPerson>();
  const [dialogEmail, setDialogEmail] = useState('');

  const handleUpdateEmail = (option: ZetkinPerson, email: string) => {
    setDialogEmail(email);
    setDialogPerson(option);
    setDialogOpen(true);
  };

  const sortedSubmissions = useMemo(() => {
    const sorted = [...submissions].sort((subOne, subTwo) => {
      const dateOne = new Date(subOne.submitted);
      const dateTwo = new Date(subTwo.submitted);
      return dateTwo.getTime() - dateOne.getTime();
    });
    return sorted;
  }, [submissions]);

  const makeSimpleColumn = (
    field: keyof NonNullable<ZetkinSurveySubmission['respondent']>,
    messageId:
      | 'dateColumn'
      | 'emailColumn'
      | 'firstNameColumn'
      | 'lastNameColumn'
      | 'personRecordColumn'
  ) => {
    return {
      field: field,
      flex: 1,
      headerName: messages.submissions[messageId](),
      renderCell: (
        params: GridRenderCellParams<ZetkinSurveySubmission, string>
      ) => {
        if (params.row.respondent !== null) {
          return <Box>{params.row.respondent[field]}</Box>;
        }
        return (
          <Box
            sx={{
              fontStyle: 'italic',
            }}
          >
            <Msg id={messageIds.submissions.anonymous} />
          </Box>
        );
      },
      sortComparator: (v1: string, v2: string) => v1.localeCompare(v2),
      sortable: true,
      valueGetter: (
        params: GridRenderCellParams<ZetkinSurveySubmission, string>
      ) => {
        if (params.row.respondent !== null) {
          return params.row.respondent[field] || '';
        } else {
          return messages.submissions.anonymous();
        }
      },
    };
  };

  const gridColumns = [
    makeSimpleColumn('first_name', 'firstNameColumn'),
    makeSimpleColumn('last_name', 'lastNameColumn'),
    makeSimpleColumn('email', 'emailColumn'),
    {
      field: `submitted`,
      flex: 1,
      headerName: messages.submissions.dateColumn(),
      renderCell: (
        params: GridRenderCellParams<ZetkinSurveySubmission, string>
      ) => {
        return <ZUIRelativeTime datetime={params.row.submitted} />;
      },
      sortable: true,
    },
    {
      editable: true,
      field: 'respondent',
      flex: 1,
      headerName: messages.submissions.personRecordColumn(),
      renderCell: (
        params: GridRenderCellParams<
          ZetkinSurveySubmission,
          ZetkinSurveySubmission['respondent']
        >
      ) => {
        return <ReadCell row={params.row} />;
      },
      renderEditCell: (
        params: GridRenderCellParams<
          ZetkinSurveySubmission,
          ZetkinSurveySubmission['respondent']
        >
      ) => {
        return <EditCell row={params.row} />;
      },
      sortable: true,
    },
  ];

  const ReadCell: FC<{ row: ZetkinSurveySubmission }> = ({ row }) => {
    const api = useGridApiContext();

    const startEditing = () => {
      return api.current.startCellEditMode({
        field: 'respondent',
        id: row.id,
      });
    };

    if (row.respondent?.id) {
      return (
        <ZUIPersonHoverCard
          personId={row.respondent.id}
          popperProps={{
            modifiers: [
              {
                enabled: true,
                name: 'preventOverflow',
                options: {
                  tetherOffset: 230,
                },
              },
            ],
          }}
        >
          <ZUIPersonGridCell
            onClick={startEditing}
            person={{
              ...row.respondent,
              id: row.respondent.id, // Telling typescript that there is an id
            }}
            sx={{
              cursor: 'pointer',
            }}
            tooltip={false}
          />
        </ZUIPersonHoverCard>
      );
    } else {
      return (
        <Link onClick={startEditing} sx={{ cursor: 'pointer' }}>
          <Msg id={messageIds.submissions.link} />
        </Link>
      );
    }
  };

  const EditCell: FC<{
    row: ZetkinSurveySubmission;
  }> = ({ row }) => {
    const api = useGridApiContext();
    const { orgId } = useNumericRouteParams();
    const { setRespondentId } = useSurveySubmission(orgId, row.id);

    const emailOrName =
      row.respondent?.email ||
      row.respondent?.first_name ||
      row.respondent?.last_name ||
      '';

    const { results: suggestedPeople, setQuery } = usePersonSearch(orgId);

    useEffect(() => {
      if (emailOrName.length > 2) {
        setQuery(emailOrName);
      }
    }, [emailOrName]);

    const updateCellValue = (person: ZetkinPerson | null) => {
      api.current.stopCellEditMode({
        field: 'respondent',
        id: row.id,
      });
      setRespondentId(person?.id || null);

      const personHasNoEmail = person?.id !== null && person?.email === null;
      const respondentEmail = row.respondent?.email;
      if (personHasNoEmail && respondentEmail !== undefined) {
        handleUpdateEmail(person, respondentEmail);
      }
    };

    return (
      <ZUIPersonGridEditCell
        cell={row.respondent}
        onUpdate={updateCellValue}
        removePersonLabel={messages.submissions.unlink()}
        suggestedPeople={row.respondent === null ? [] : suggestedPeople} //filter anonymous
        suggestedPeopleLabel={messages.submissions.suggestedPeople()}
      />
    );
  };

  return (
    <Box
      sx={{
        '& .pointer': {
          cursor: 'pointer',
        },
      }}
    >
      <DataGridPro
        autoHeight
        columns={gridColumns}
        disableColumnFilter
        disableColumnMenu
        getCellClassName={(params: GridCellParams<ZetkinSurveySubmission>) => {
          return params.field === 'respondent' ? '' : 'pointer';
        }}
        onCellClick={(params) => {
          if (params.field !== 'respondent') {
            openPane({
              render() {
                return (
                  <SurveySubmissionPane
                    id={params.row.id}
                    orgId={parseInt(orgId as string)}
                  />
                );
              },
              width: 400,
            });
          }
        }}
        rows={sortedSubmissions}
        style={{
          border: 'none',
        }}
      />
      {dialogPerson && (
        <SurveyLinkDialog
          email={dialogEmail}
          onClose={() => setDialogOpen(false)}
          open={dialogOpen}
          person={dialogPerson}
        />
      )}
    </Box>
  );
};

export default SurveySubmissionsList;
