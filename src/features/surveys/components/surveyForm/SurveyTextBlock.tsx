import { FC } from 'react';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

export type SurveyTextBlockProps = {
  element: ZetkinSurveyTextElement;
};

const SurveyTextBlock: FC<SurveyTextBlockProps> = ({ element }) => {
  return <p>{element.text_block.content}</p>;
};

export default SurveyTextBlock;
