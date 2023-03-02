import { Box, Button, Card, Typography } from '@mui/material';
import {
  FormatAlignLeft,
  FormatListBulleted,
  TextFields,
} from '@mui/icons-material';

import { Msg } from 'core/i18n';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import theme from 'theme';
import { ELEMENT_TYPE, RESPONSE_TYPE } from 'utils/types/zetkin';

import messageIds from 'features/surveys/l10n/messageIds';

const AddBlocks = ({ model }: { model: SurveyDataModel }) => {
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.grey[200],
        border: 'none',
        padding: 2,
      }}
    >
      <Typography color="secondary">
        <Msg id={messageIds.addBlocks.title} />
      </Typography>
      <Box display="flex" paddingTop={2}>
        <Button
          onClick={() =>
            model.addElement({
              hidden: false,
              text_block: {
                content: '',
                header: '',
              },
              type: ELEMENT_TYPE.TEXT,
            })
          }
          startIcon={<TextFields />}
          sx={{ marginRight: 1 }}
          variant="outlined"
        >
          <Msg id={messageIds.addBlocks.textButton} />
        </Button>
        <Button
          onClick={() =>
            model.addElement({
              hidden: false,
              question: {
                description: '',
                question: '',
                response_config: {
                  multiline: false,
                },
                response_type: RESPONSE_TYPE.TEXT,
              },
              type: ELEMENT_TYPE.QUESTION,
            })
          }
          startIcon={<FormatAlignLeft />}
          sx={{ marginRight: 1 }}
          variant="outlined"
        >
          <Msg id={messageIds.addBlocks.openQuestionButton} />
        </Button>
        <Button
          onClick={() =>
            model.addElement({
              hidden: false,
              question: {
                description: '',
                question: '',
                response_config: {
                  widget_type: 'checkbox',
                },
                response_type: RESPONSE_TYPE.OPTIONS,
              },
              type: ELEMENT_TYPE.QUESTION,
            })
          }
          startIcon={<FormatListBulleted />}
          variant="outlined"
        >
          <Msg id={messageIds.addBlocks.choiceQuestionButton} />
        </Button>
      </Box>
    </Card>
  );
};

export default AddBlocks;
