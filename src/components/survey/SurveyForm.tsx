import { FormattedMessage as Msg } from 'react-intl';
import SurveyElement from './SurveyElement';
import { ZetkinSurvey } from '../../types/zetkin';

import { ChangeEvent, useState } from 'react';

interface OnValidSubmitProps {
    responses: Record<string, string | number[]>;
}

interface SurveyFormProps {
    initialState: Record<string, string | number[]>;
    onValidSubmit: (data: OnValidSubmitProps) => void;
    survey: ZetkinSurvey;
}

export default function SurveyForm({ initialState, onValidSubmit, survey }: SurveyFormProps): JSX.Element {
    const { title, info_text, elements } = survey;
    const [state, setState] = useState(initialState);

    const onSubmit = (ev: ChangeEvent<HTMLFormElement>) => {
        onValidSubmit({
            responses: state,
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
