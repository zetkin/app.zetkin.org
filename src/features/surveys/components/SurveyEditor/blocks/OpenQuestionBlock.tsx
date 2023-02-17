import AbcIcon from '@mui/icons-material/Abc';
import { FC } from 'react';

import { makeStyles } from '@mui/styles';
import { FormattedMessage as Msg } from 'react-intl';

import SortIcon from '@mui/icons-material/Sort';
import { useIntl } from 'react-intl';
import { ZetkinTextQuestion } from 'utils/types/zetkin';
import { MenuItem, TextField } from '@mui/material';

interface OpenQuestionBlockProps {
  question: ZetkinTextQuestion;
}

enum fieldType {
  multiLine = 'multiLine',
  singleLine = 'singleLine',
}

const useStyles = makeStyles({
  fieldType: {
    alignItems: 'center',
    display: 'flex',
  },
});

const OpenQuestionBlock: FC<OpenQuestionBlockProps> = ({ question }) => {
  const styles = useStyles();

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
      <TextField
        fullWidth
        label={intl.formatMessage({
          id: 'pages.organizeSurvey.openQuestion.textFieldType',
        })}
        margin="normal"
        select
        sx={{ alignItems: 'center', display: 'flex' }}
        value={fieldType}
      >
        <MenuItem
          key={fieldType.singleLine}
          className={styles.fieldType}
          value={fieldType.singleLine}
        >
          <AbcIcon sx={{ marginRight: '10px' }} />
          <Msg id="pages.organizeSurvey.openQuestion.singleLine" />
        </MenuItem>
        <MenuItem
          key={fieldType.multiLine}
          className={styles.fieldType}
          value={fieldType.multiLine}
        >
          <SortIcon sx={{ marginRight: '10px' }} />
          <Msg id="pages.organizeSurvey.openQuestion.multiLine" />
        </MenuItem>
      </TextField>
    </>
  );
};

export default OpenQuestionBlock;
