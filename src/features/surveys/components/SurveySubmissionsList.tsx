import { Box } from '@mui/system';
import SurveySubmissionPane from '../panes/SurveySubmissionPane';
import { useIntl } from 'react-intl';
import { usePanes } from 'utils/panes';
import { useRouter } from 'next/router';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { DataGridPro, GridRenderCellParams } from '@mui/x-data-grid-pro';

const SurveySubmissionsList = ({
  submissions,
}: {
  submissions: ZetkinSurveySubmission[];
}) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;
  const { openPane } = usePanes();

  const sortedSubmissions = [...submissions].sort((subOne, subTwo) => {
    const dateOne = new Date(subOne.submitted);
    const dateTwo = new Date(subTwo.submitted);
    return dateTwo.getTime() - dateOne.getTime();
  });

  const makeSimpleColumn = (
    field: keyof NonNullable<ZetkinSurveySubmission['respondent']>,
    messageId: string
  ) => {
    return {
      field: field,
      flex: 1,
      headerName: intl.formatMessage({
        id: `pages.organizeSurvey.submissions.${messageId}`,
      }),
      renderCell: (
        params: GridRenderCellParams<string, ZetkinSurveySubmission>
      ) => {
        if (params.row.respondent !== null) {
          return (
            <Box
              key={`submissionList-${params.row.id}`}
              onClick={() =>
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
                })
              }
              sx={{ cursor: 'pointer', width: '200px' }}
            >
              {params.row.respondent[field]}
            </Box>
          );
        }
        return '-';
      },
      sortable: true,
    };
  };

  const gridColumns = [
    makeSimpleColumn('first_name', 'firstNameColumn'),
    makeSimpleColumn('last_name', 'lastNameColumn'),
    makeSimpleColumn('email', 'emailColumn'),
    {
      field: `submitted`,
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeSurvey.submissions.dateColumn',
      }),
      renderCell: (
        params: GridRenderCellParams<string, ZetkinSurveySubmission>
      ) => {
        if (params.row.respondent !== null) {
          return (
            <Box
              key={`submissionList-${params.row.id}`}
              onClick={() =>
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
                })
              }
              sx={{ cursor: 'pointer', width: '200px' }}
            >
              <ZUIRelativeTime datetime={params.row.submitted} />
            </Box>
          );
        }
      },
      sortable: true,
    },
    {
      field: `respondent`,
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeSurvey.submissions.personRecordColumn',
      }),
      renderCell: (
        params: GridRenderCellParams<
          ZetkinSurveySubmission['respondent'],
          ZetkinSurveySubmission
        >
      ) => {
        if (params.value?.id) {
          return (
            <ZUIPersonHoverCard personId={params.value.id}>
              <ZUIAvatar
                orgId={parseInt(orgId as string)}
                personId={params.value.id}
              />
            </ZUIPersonHoverCard>
          );
        }
        return <></>;
      },
      sortable: true,
    },
  ];

  return (
    <>
      <DataGridPro
        autoHeight
        columns={gridColumns}
        disableColumnFilter
        disableColumnMenu
        rows={sortedSubmissions}
        style={{
          border: 'none',
        }}
      />
    </>
  );
};

export default SurveySubmissionsList;
