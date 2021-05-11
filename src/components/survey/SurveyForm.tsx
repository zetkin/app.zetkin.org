import SurveyElement from './SurveyElement';
import { ZetkinSurvey } from '../../types/zetkin';

interface SurveyFormProps {
    survey: ZetkinSurvey;
}

export default function SurveyForm({ survey }: SurveyFormProps): JSX.Element {
    const { title, info_text, elements } = survey;
    return (
        <>
            <h1>{ title }</h1>
            <h2>{ info_text }</h2>
            {
                elements.map((element) => {
                    return <SurveyElement key={ element.id } element={ element } />;
                })
            }
        </>
    );
}
