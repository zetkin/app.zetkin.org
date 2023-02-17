import { FC } from 'react';
import { TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { ZetkinTextQuestion } from 'utils/types/zetkin';

interface OpenQuestionBlockProps {
  question: ZetkinTextQuestion;
}

const OpenQuestionBlock: FC<OpenQuestionBlockProps> = ({ question }) => {
  const intl = useIntl();
  return (
    <>
      <TextField
        defaultValue={question.question}
        fullWidth
        label={intl.formatMessage({
          id: 'pages.organizeSurvey.openQuestion.title',
        })}
        margin="normal"
      />
      <TextField
        defaultValue={question.description}
        fullWidth
        label={intl.formatMessage({
          id: 'pages.organizeSurvey.openQuestion.description',
        })}
        margin="normal"
      />
    </>
  );
};

export default OpenQuestionBlock;
