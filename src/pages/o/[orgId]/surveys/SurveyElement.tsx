interface SurveyElementProps {
    element: {
        id: number;
        text_block: {
            content: string;
            header: string;
        };
        type: string;
    } ;
}

export default function SurveyElement({ element }: SurveyElementProps): JSX.Element {
    const { text_block } = element;
    const { header, content } = text_block;

    return (
        <>
            <h2 data-testid="textblock-header">{ header }</h2>
            <h3 data-testid="textblock-content">{ content }</h3>
        </>
    );
}
