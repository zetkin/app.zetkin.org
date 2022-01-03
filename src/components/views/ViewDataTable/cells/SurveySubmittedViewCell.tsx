import { FunctionComponent } from 'react';

import { ViewGridCellParams } from '.';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';


export type SurveySubmittedViewCellParams = ViewGridCellParams<{
    submission_id: number;
    submitted: string;
}[] | null>;

interface SurveySubmittedViewCellProps {
    params: SurveySubmittedViewCellParams;
}

const SurveySubmittedViewCell: FunctionComponent<SurveySubmittedViewCellProps> = ({ params }) => {
    if (params.value?.length) {
        const subsWithDates = params.value.map(sub => ({
            ...sub,
            submitted: new Date(sub.submitted),
        }));
        const sorted = subsWithDates.sort((s0, s1) => s1.submitted.getTime() - s0.submitted.getTime());

        return (
            <ZetkinRelativeTime datetime={ sorted[0].submitted.toISOString() }/>
        );
    }

    return null;
};

export default SurveySubmittedViewCell;
