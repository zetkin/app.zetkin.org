import SurveyQuestion from './SurveyQuestion';
import {
    ZetkinSurveyElement,
    ZetkinSurveyTextblockElement,
} from '../../types/zetkin';

interface SurveyElementProps {
    element: ZetkinSurveyElement;
    onValueChange: (name: string, val: string | number[]) => void;
    value: string | number[];
}

function isText(elem : ZetkinSurveyElement) : elem is ZetkinSurveyTextblockElement {
    return elem.type === 'text';
}

export default function SurveyElement({ element, onValueChange, value }: SurveyElementProps) : JSX.Element {
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
        return (
            <SurveyQuestion
                element={ element }
                onValueChange={ onValueChange }
                value={ value }
            />
        );
    }
}
