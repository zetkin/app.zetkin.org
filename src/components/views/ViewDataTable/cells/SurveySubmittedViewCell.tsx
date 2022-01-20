import { FunctionComponent } from 'react';
import { ViewGridCellParams } from '.';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';

interface Submission {submission_id: number; submitted: string}

export type SurveySubmittedParams = ViewGridCellParams<Submission[] | null>;

export type SurveySubmittedViewCellParams = ViewGridCellParams<string | null>;

export const getNewestSubmission = (submissions: Submission[]): string => {
    const subsWithDates = submissions.map(sub => ({
        ...sub,
        submitted: new Date(sub.submitted),
    }));
    const sorted = subsWithDates.sort((s0, s1) => s1.submitted.getTime() - s0.submitted.getTime());

    return sorted[0].submitted.toISOString();
};

const SurveySubmittedViewCell: FunctionComponent<{params: SurveySubmittedViewCellParams}> = ({ params }) => {
    return params.value ? <ZetkinRelativeTime datetime={ params.value }/> : null;
};

export default SurveySubmittedViewCell;
