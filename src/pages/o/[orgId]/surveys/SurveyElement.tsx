import SurveyQuestion from './SurveyQuestion';
import {
    ZetkinSurveyElement,
    ZetkinSurveyTextblockElement,
} from '../../../../types/zetkin';

interface SurveyElementProps {
    element: ZetkinSurveyElement;
}

function isText(elem : ZetkinSurveyElement) : elem is ZetkinSurveyTextblockElement {
    return elem.type === 'text';
}

export default function SurveyElement({ element }: SurveyElementProps) : JSX.Element {
    if (isText(element)) {
        const { text_block } = element;
        return (
            <>
                <h2 data-testid="textblock-header">{ text_block.header }</h2>
                <h3 data-testid="textblock-content">{ text_block.content }</h3>
            </>
        );
    }
    else {
        const { question } = element;
        return (
            <SurveyQuestion question={ question }/>
        );
    }
}
