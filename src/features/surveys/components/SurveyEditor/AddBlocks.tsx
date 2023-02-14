import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Card, Typography } from '@mui/material';
import {
  FormatAlignLeft,
  FormatListBulleted,
  TextFields,
} from '@mui/icons-material';

import { ELEMENT_TYPE } from 'utils/types/zetkin';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import theme from 'theme';

const AddBlocks = ({ model }: { model: SurveyDataModel }) => {
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.grey[200],
        border: 'none',
        marginTop: 4,
        padding: 2,
      }}
    >
      <Typography color="secondary">
        <Msg id="misc.surveys.addBlocks.title" />
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
          <Msg id="misc.surveys.addBlocks.textButton" />
        </Button>
        <Button
          startIcon={<FormatAlignLeft />}
          sx={{ marginRight: 1 }}
          variant="outlined"
        >
          <Msg id="misc.surveys.addBlocks.openQuestionButton" />
        </Button>
        <Button startIcon={<FormatListBulleted />} variant="outlined">
          <Msg id="misc.surveys.addBlocks.choiceQuestionButton" />
        </Button>
      </Box>
    </Card>
  );
};

export default AddBlocks;
