import SurveyOptionsQuestion from './SurveyOptionsQuestion';
import SurveyTextQuestion from './SurveyTextQuestion';
import { ZetkinSurveyQuestion } from '../../../../types/zetkin';

interface SurveyQuestionProps {
    question: ZetkinSurveyQuestion;
    elementId: number;
}

export default function SurveyQuestion({ question, elementId }: SurveyQuestionProps): JSX.Element {
    const { response_type } = question;

    if (response_type === 'text') {
        return <SurveyTextQuestion question={ question }/>;
    }
    else {
        return <SurveyOptionsQuestion elementId={ elementId } question={ question } />;
    }
}
