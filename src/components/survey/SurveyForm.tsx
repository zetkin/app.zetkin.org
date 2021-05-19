import { FormattedMessage as Msg } from 'react-intl';
import SurveyElement from './SurveyElement';
import { ZetkinSurvey } from '../../types/zetkin';

import { ChangeEvent, useState } from 'react';

interface SurveyResponse {
    options?: number[];
    response?: string;
    question_id: number;
}

interface OnValidSubmitProps {
    responses: SurveyResponse[];
}

interface SurveyFormProps {
    initialState?: Record<string, string | number[]>;
    onValidSubmit: (data: OnValidSubmitProps) => void;
    survey: ZetkinSurvey;
}

export default function SurveyForm({ initialState, onValidSubmit, survey }: SurveyFormProps): JSX.Element {
    const { title, info_text, elements } = survey;
    const [state, setState] = useState(initialState || {});

    const onSubmit = (ev: ChangeEvent<HTMLFormElement>) => {
        const responses: SurveyResponse[] = [];

        Object.entries(state).map((response) => {
            const newResponse: SurveyResponse = {
                question_id: parseInt(response[0].substring(9)),
            };

            if (typeof response[1] === 'string') {
                newResponse.response = response[1];
            }
            else {
                newResponse.options = response[1];
            }

            responses.push(newResponse);
        });

        onValidSubmit({
            responses: responses,
        });
        ev.preventDefault();
    };

    return (
        <form onSubmit={ onSubmit }>
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
                            value={ state[`question-${ element.id }`] ?? [] }
                        />);
                })
            }
            <button
                data-testid="submit-button"
                type="submit">
                <Msg id="forms.reg.actions.submit"/>
            </button>
        </form>
    );
}
