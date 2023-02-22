import { Box } from '@mui/system';
import SurveySubmissionPane from '../panes/SurveySubmissionPane';
import { useIntl } from 'react-intl';
import { usePanes } from 'utils/panes';
import { useRouter } from 'next/router';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import {
  DataGridPro,
  GridRenderCellParams,
  // GridValueGetterParams,
} from '@mui/x-data-grid-pro';
// import ViewSurveySubmissionPreview from 'features/views/components/ViewSurveySubmissionPreview';

const SurveySubmissionsList = ({
  submissions,
}: {
  submissions: ZetkinSurveySubmission[];
}) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;
  const { openPane } = usePanes();

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
              onClick={() => {
                openPane({
                  render() {
                    return (
                      <SurveySubmissionPane
                        id={params.row.survey.id}
                        orgId={parseInt(orgId as string)}
                      />
                    );
                  },
                  width: 400,
                });
              }}
            >
              {params.row.respondent[field]}
            </Box>
          );
        }
      },
      sortable: true,
      // valueGetter: (
      //   params: GridValueGetterParams<string, ZetkinSurveySubmission>
      // ) => {
      //   if (params.row.respondent !== null) {
      //     return params.row.respondent[field];
      //   }
      //   return '-';
      // },
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
        return <ZUIRelativeTime datetime={params.row.submitted} />;
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
        rows={submissions}
        style={{
          border: 'none',
        }}
      />
    </>
  );
};

export default SurveySubmissionsList;
