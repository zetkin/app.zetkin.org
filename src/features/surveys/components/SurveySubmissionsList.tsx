import { useIntl } from 'react-intl';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import {
  DataGridPro,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid-pro';

const SurveySubmissionsList = ({
  submissions,
}: {
  submissions: ZetkinSurveySubmission[];
}) => {
  const intl = useIntl();

  const gridColumns = [
    {
      field: `first_name`,
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeSurvey.surveys.firstNameColumn',
      }),
      sortable: false,
      valueGetter: (
        params: GridValueGetterParams<string, ZetkinSurveySubmission>
      ) => {
        if (params.row.respondent !== null) {
          return `${params.row.respondent.first_name}`;
        }
        return '-';
      },
    },
    {
      field: `last_name`,
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeSurvey.surveys.lastNameColumn',
      }),
      sortable: false,
      valueGetter: (
        params: GridValueGetterParams<string, ZetkinSurveySubmission>
      ) => {
        if (params.row.respondent !== null) {
          return `${params.row.respondent.last_name}`;
        }
        return '-';
      },
    },
    {
      field: `email`,
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeSurvey.surveys.emailColumn',
      }),

      sortable: false,
      valueGetter: (
        params: GridValueGetterParams<string, ZetkinSurveySubmission>
      ) => {
        if (params.row.respondent !== null) {
          return `${params.row.respondent.email}`;
        }
        return '-';
      },
    },
    {
      field: `submitted`,
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeSurvey.surveys.dateColumn',
      }),
      renderCell: (
        params: GridRenderCellParams<string, ZetkinSurveySubmission>
      ) => {
        return <ZUIRelativeTime datetime={params.row.submitted} />;
      },
      sortable: false,
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
