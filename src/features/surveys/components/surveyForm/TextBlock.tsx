import { FC } from 'react';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

const TextBlock: FC<{ element: ZetkinSurveyTextElement }> = ({ element }) => {
  return <p>{element.text_block.content}</p>;
};

export default TextBlock;
