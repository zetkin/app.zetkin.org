import AbcIcon from '@mui/icons-material/Abc';
import { FormattedMessage as Msg } from 'react-intl';
import SortIcon from '@mui/icons-material/Sort';
import { useIntl } from 'react-intl';
import { ZetkinTextQuestion } from 'utils/types/zetkin';
import {
  ClickAwayListener,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

interface OpenQuestionBlockProps {
  question: ZetkinTextQuestion;
}

enum fieldType {
  multiLine = 'multiLine',
  singleLine = 'singleLine',
}

const OpenQuestionBlock: FC<OpenQuestionBlockProps> = ({ question }) => {
  const intl = useIntl();

  const [preview, setPreview] = useState(true);
  const [typeField, setTypeField] = useState('');

  function handleClickAway() {
    setPreview(true);
  }

  const handleClick = () => {
    setPreview(false);
  };

  const handleSelect = (event: React.BaseSyntheticEvent) => {
    setPreview(false);
    setTypeField(event.target.dataset.value);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        {preview && (
          <div
            key="container"
            onClick={handleClick}
            onKeyDown={handleClick}
            role="button"
            tabIndex={0}
          >
            <Typography component="h4" marginBottom={2} variant="h4">
              {question.question ? (
                question.question
              ) : (
                <Msg id="pages.organizeSurvey.openQuestion.titlePreview" />
              )}
            </Typography>
            <Typography component="h5" marginBottom={2} variant="h5">
              {question.description ? (
                question.description
              ) : (
                <Msg id="pages.organizeSurvey.openQuestion.description" />
              )}
            </Typography>
            <Typography component="h5" marginBottom={2} variant="h5">
              {question.response_config.multiline ? (
                <>
                  <SortIcon sx={{ marginRight: '10px' }} />
                  <Msg id="pages.organizeSurvey.openQuestion.multiLine" />{' '}
                  <Msg id="pages.organizeSurvey.openQuestion.fieldTypePreview" />
                </>
              ) : (
                <>
                  <AbcIcon sx={{ marginRight: '10px' }} />
                  <Msg id="pages.organizeSurvey.openQuestion.singleLine" />{' '}
                  <Msg id="pages.organizeSurvey.openQuestion.fieldTypePreview" />
                </>
              )}
            </Typography>
          </div>
        )}
        {!preview && (
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
              defaultValue={
                question.response_config.multiline === true
                  ? fieldType.multiLine
                  : fieldType.singleLine
              }
              fullWidth
              label={intl.formatMessage({
                id: 'pages.organizeSurvey.openQuestion.textFieldType',
              })}
              margin="normal"
              onClick={handleSelect}
              select
              SelectProps={{
                MenuProps: { disablePortal: true },
              }}
              sx={{ alignItems: 'center', display: 'flex' }}
              value={typeField}
            >
              {Object.values(fieldType).map((value) => (
                <MenuItem key={value} value={value}>
                  {value === 'singleLine' ? (
                    <AbcIcon sx={{ marginRight: '10px' }} />
                  ) : (
                    <SortIcon sx={{ marginRight: '10px' }} />
                  )}
                  <Msg id={`pages.organizeSurvey.openQuestion.${value}`} />
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default OpenQuestionBlock;
