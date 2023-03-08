import { FC } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Link } from '@mui/material';
import {
  DataGridPro,
  GridRenderCellParams,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { FormattedMessage, useIntl } from 'react-intl';

import getPeopleSearchResults from 'utils/fetching/getPeopleSearchResults';
import SurveySubmissionModel from '../models/SurveySubmissionModel';
import useModel from 'core/useModel';
import ZUIPersonGridCell from 'zui/ZUIPersonGridCell';
import ZUIPersonGridEditCell from 'zui/ZUIPersonGridEditCell';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { ZetkinPerson, ZetkinSurveySubmission } from 'utils/types/zetkin';

const SurveySubmissionsList = ({
  submissions,
}: {
  submissions: ZetkinSurveySubmission[];
}) => {
  const intl = useIntl();

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
          return <Box>{params.row.respondent[field]}</Box>;
        }
        return (
          <Box
            sx={{
              fontStyle: 'italic',
            }}
          >
            <FormattedMessage
              id={`pages.organizeSurvey.submissions.anonymous`}
            />
          </Box>
        );
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
        return <ZUIRelativeTime datetime={params.row.submitted} />;
      },
      sortable: true,
    },
    {
      editable: true,
      field: 'respondent',
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
        return <ReadCell params={params} />;
      },
      renderEditCell: (
        params: GridRenderCellParams<
          ZetkinSurveySubmission['respondent'],
          ZetkinSurveySubmission
        >
      ) => {
        return <EditCell params={params} />;
      },
      sortable: true,
    },
  ];

  const ReadCell: FC<
    GridRenderCellParams<
      ZetkinSurveySubmission['respondent'],
      ZetkinSurveySubmission
    >
  > = ({ params }) => {
    const api = useGridApiContext();

    const startEditing = () => {
      return api.current.startCellEditMode({
        field: 'respondent',
        id: params.id,
      });
    };

    if (params.value?.id) {
      return <ZUIPersonGridCell cell={params.value} onClick={startEditing} />;
    } else {
      return (
        <Link onClick={startEditing} sx={{ cursor: 'pointer' }}>
          Link
        </Link>
      );
    }
  };

  const EditCell: FC<
    GridRenderCellParams<
      ZetkinSurveySubmission['respondent'],
      ZetkinSurveySubmission
    >
  > = ({ params }) => {
    const api = useGridApiContext();
    const { orgId } = useRouter().query;
    const email = params.value?.email || '';
    let { data: suggestedPeople } = useQuery(
      ['peopleSearchResults', email],
      getPeopleSearchResults(email, orgId as string),
      {
        enabled: email.length >= 2,
        retry: true,
      }
    );

    if (!suggestedPeople) {
      suggestedPeople = [];
    }

    const subsModel = useModel(
      (env) =>
        new SurveySubmissionModel(
          env,
          parseInt(orgId as string),
          parseInt(params.id)
        )
    );

    const updateCellValue = (person: ZetkinPerson | null) => {
      api.current.stopCellEditMode({
        field: 'respondent',
        id: params.id,
      });
      subsModel.setRespondentId(person?.id || null);
    };

    return (
      <ZUIPersonGridEditCell
        cell={params.value}
        onUpdate={updateCellValue}
        removePersonLabel="misc.surveys.submissions.unlink"
        suggestedPeople={suggestedPeople}
        suggestedPeopleLabel="misc.surveys.suggestedPeople"
      />
    );
  };

  return (
    <>
      <DataGridPro
        autoHeight
        columns={gridColumns}
        disableColumnFilter
        disableColumnMenu
        experimentalFeatures={{ newEditingApi: true }}
        rows={submissions}
        style={{
          border: 'none',
        }}
      />
    </>
  );
};

export default SurveySubmissionsList;
