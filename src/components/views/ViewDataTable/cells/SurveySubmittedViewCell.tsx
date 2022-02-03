import { FunctionComponent } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { ViewGridCellParams } from '.';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';

interface Submission {
  submission_id: number;
  submitted: string;
}

export type SurveySubmittedParams = ViewGridCellParams<Submission[] | null>;

export const getNewestSubmission = (
  submissions: Submission[]
): string | null => {
  if (!submissions.length) return null;
  const subsWithDates = submissions.map((sub) => ({
    ...sub,
    submitted: new Date(sub.submitted),
  }));
  const sorted = subsWithDates.sort(
    (s0, s1) => s1.submitted.getTime() - s0.submitted.getTime()
  );

  return sorted[0].submitted.toISOString();
};

const SurveySubmittedViewCell: FunctionComponent<{
  params: GridRenderCellParams;
}> = ({ params }) => {
  const latestSubmission =
    params?.row && getNewestSubmission(params.row[params.field]);
  return latestSubmission ? (
    <ZetkinRelativeTime datetime={latestSubmission} />
  ) : null;
};

export default SurveySubmittedViewCell;
