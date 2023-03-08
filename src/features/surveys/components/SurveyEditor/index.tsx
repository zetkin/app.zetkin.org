import { Box } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import AddBlocks from './AddBlocks';
import BlockWrapper from './blocks/BlockWrapper';
import ChoiceQuestionBlock from './blocks/ChoiceQuestionBlock';
import OpenQuestionBlock from './blocks/OpenQuestionBlock';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import TextBlock from './blocks/TextBlock';
import ZUIFuture from 'zui/ZUIFuture';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyOptionsQuestionElement,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';

interface SurveyEditorProps {
  model: SurveyDataModel;
}

const SurveyEditor: FC<SurveyEditorProps> = ({ model }) => {
  const [idOfBlockInEditMode, setIdOfBlockInEditMode] = useState<
    number | undefined
  >();

  const lengthRef = useRef<number>();

  useEffect(() => {
    const data = model.getData().data;
    if (data) {
      const elements = data.elements;

      // If the previous length is null, it's because it only now loaded for the
      // first time and the length has not really been read before.
      if (
        lengthRef.current !== undefined &&
        lengthRef.current < elements.length
      ) {
        const lastElement = elements[elements.length - 1];
        setIdOfBlockInEditMode(lastElement.id);
      }

      lengthRef.current = elements.length;
    }
  }, [model.getData().data?.elements.length]);

  return (
    <>
      <ZUIFuture future={model.getData()}>
        {(data) => {
          return (
            <Box paddingBottom={data.elements.length ? 4 : 0}>
              {data.elements.map((elem) => {
                if (elem.type == ELEMENT_TYPE.QUESTION) {
                  if (elem.question.response_type == RESPONSE_TYPE.TEXT) {
                    return (
                      <BlockWrapper key={elem.id} hidden={elem.hidden}>
                        <OpenQuestionBlock
                          editable={elem.id == idOfBlockInEditMode}
                          element={elem as ZetkinSurveyTextQuestionElement}
                          model={model}
                          onEditModeEnter={() =>
                            setIdOfBlockInEditMode(elem.id)
                          }
                          onEditModeExit={() => {
                            setIdOfBlockInEditMode(undefined);
                          }}
                        />
                      </BlockWrapper>
                    );
                  } else if (
                    elem.question.response_type == RESPONSE_TYPE.OPTIONS
                  ) {
                    return (
                      <BlockWrapper key={elem.id} hidden={elem.hidden}>
                        <ChoiceQuestionBlock
                          editable={elem.id == idOfBlockInEditMode}
                          element={elem as ZetkinSurveyOptionsQuestionElement}
                          model={model}
                          onEditModeEnter={() => {
                            setIdOfBlockInEditMode(elem.id);
                          }}
                          onEditModeExit={() => {
                            setIdOfBlockInEditMode(undefined);
                          }}
                        />
                      </BlockWrapper>
                    );
                  }
                } else if (elem.type == ELEMENT_TYPE.TEXT) {
                  return (
                    <BlockWrapper key={elem.id} hidden={elem.hidden}>
                      <TextBlock
                        editable={elem.id == idOfBlockInEditMode}
                        element={elem}
                        model={model}
                        onEditModeEnter={() => setIdOfBlockInEditMode(elem.id)}
                        onEditModeExit={() => {
                          setIdOfBlockInEditMode(undefined);
                        }}
                      />
                    </BlockWrapper>
                  );
                }
              })}
            </Box>
          );
        }}
      </ZUIFuture>
      <AddBlocks model={model} />
    </>
  );
};

export default SurveyEditor;
