import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
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
  const { orgId } = useRouter().query;

  const makeSimpleColumn = (
    field: keyof NonNullable<ZetkinSurveySubmission['respondent']>,
    messageId: string
  ) => {
    return {
      field: field,
      flex: 1,
      headerName: intl.formatMessage({
        id: `pages.organizeSurvey.surveys.${messageId}`,
      }),
      sortable: true,
      valueGetter: (
        params: GridValueGetterParams<string, ZetkinSurveySubmission>
      ) => {
        if (params.row.respondent !== null) {
          return params.row.respondent[field];
        }
        return '-';
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
      headerName: intl.formatMessage({
        id: 'pages.organizeSurvey.surveys.dateColumn',
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
        id: 'pages.organizeSurvey.surveys.personRecordColumn',
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
