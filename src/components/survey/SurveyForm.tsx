import { useState } from 'react';

import SurveyElement from './SurveyElement';
import { ZetkinSurvey } from '../../types/zetkin';

interface SurveyFormProps {
    survey: ZetkinSurvey;
    initialState: Record<string, number[]>;
}

export default function SurveyForm({ initialState, survey }: SurveyFormProps): JSX.Element {
    const { title, info_text, elements } = survey;
    const [state, setState] = useState(initialState);

    return (
        <>
            <h1>{ title }</h1>
            <h2>{ info_text }</h2>
            {
                elements.map((element) => {
                    return (
                        <SurveyElement
                            key={ element.id }
                            element={ element }
                            onValueChange={
                                (name, val) => {
                                    setState({ ...state, [name]: val });
                                } }
                            value={ state[`question-${ element.id }`] }
                        />);
                })
            }
        </>
    );
}
