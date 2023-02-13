import { Box } from '@mui/material';
import { FC } from 'react';

import BlockWrapper from './blocks/BlockWrapper';
import ChoiceQuestionBlock from './blocks/ChoiceQuestionBlock';
import OpenQuestionBlock from './blocks/OpenQuestionBlock';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import TextBlock from './blocks/TextBlock';
import ZUIFuture from 'zui/ZUIFuture';
import { ELEMENT_TYPE, RESPONSE_TYPE } from 'utils/types/zetkin';

interface SurveyEditorProps {
  model: SurveyDataModel;
}

const SurveyEditor: FC<SurveyEditorProps> = ({ model }) => {
  return (
    <ZUIFuture future={model.getData()}>
      {(data) => {
        return (
          <Box>
            {data.elements.map((elem) => {
              if (elem.type == ELEMENT_TYPE.QUESTION) {
                if (elem.question.response_type == RESPONSE_TYPE.TEXT) {
                  return (
                    <BlockWrapper>
                      <OpenQuestionBlock question={elem.question} />
                    </BlockWrapper>
                  );
                } else if (
                  elem.question.response_type == RESPONSE_TYPE.OPTIONS
                ) {
                  return (
                    <BlockWrapper>
                      <ChoiceQuestionBlock question={elem.question} />
                    </BlockWrapper>
                  );
                }
              } else if (elem.type == ELEMENT_TYPE.TEXT) {
                return (
                  <BlockWrapper>
                    <TextBlock element={elem} />
                  </BlockWrapper>
                );
              }
            })}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default SurveyEditor;
