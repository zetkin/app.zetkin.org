import SurveyElement from './SurveyElement';

interface SurveyFormProps {
    survey: {
        elements: {
            id: number;
            text_block: {
                content: string;
                header: string;
            };
            type: string;
        }[];
        info_text: string;
        title: string;
    };
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
