interface SurveyFormProps {
    survey: {
        info_text: string;
        title: string;
    };
}

export default function SurveyForm({ survey }: SurveyFormProps): JSX.Element {
    const { title, info_text } = survey;
    return (
        <>
            <h1>{ title }</h1>
            <h2>{ info_text }</h2>
        </>
    );
}
