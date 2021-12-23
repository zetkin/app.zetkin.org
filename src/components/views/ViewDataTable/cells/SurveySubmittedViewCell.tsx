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
        const subDates = params.value.map(sub => new Date(sub.submitted));
        const sorted = subDates.sort();

        return (
            <ZetkinRelativeTime datetime={ sorted[0].toUTCString() }/>
        );
    }

    return null;
};

export default SurveySubmittedViewCell;
