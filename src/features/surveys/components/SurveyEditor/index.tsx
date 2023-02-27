import { Box } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import AddBlocks from './AddBlocks';
import BlockWrapper from './blocks/BlockWrapper';
import ChoiceQuestionBlock from './blocks/ChoiceQuestionBlock';
import OpenQuestionBlock from './blocks/OpenQuestionBlock';
import { OptionsQuestionPatchBody } from 'features/surveys/repos/SurveysRepo';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import TextBlock from './blocks/TextBlock';
import ZUIFuture from 'zui/ZUIFuture';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyTextElement,
} from 'utils/types/zetkin';

interface SurveyEditorProps {
  model: SurveyDataModel;
}

const SurveyEditor: FC<SurveyEditorProps> = ({ model }) => {
  const [idOfBlockInEditMode, setIdOfBlockInEditMode] = useState<
    number | undefined
  >();

  const lengthRef = useRef(0);

  useEffect(() => {
    const data = model.getData().data;
    if (data) {
      const elements = data.elements;
      //If a block was just added, set its id to be in edit mode.
      if (lengthRef.current < elements.length && lengthRef.current !== 0) {
        setIdOfBlockInEditMode(elements[elements.length - 1].id);
      } else if (lengthRef.current === 0) {
        if (elements.length === 1) {
          setIdOfBlockInEditMode(elements[0].id);
        }
      }
      lengthRef.current = elements.length;
    }
  }, [model.getData().data?.elements.length]);

  function handleAddOption(elemId: number) {
    model.addElementOption(elemId);
  }

  function handleDelete(elemId: number) {
    model.deleteElement(elemId);
  }

  function handleToggleHidden(elemId: number, hidden: boolean) {
    model.toggleElementHidden(elemId, hidden);
  }

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
                          hidden={elem.hidden}
                          onDelete={() => handleDelete(elem.id)}
                          onToggleHidden={(hidden) =>
                            handleToggleHidden(elem.id, hidden)
                          }
                          question={elem.question}
                        />
                      </BlockWrapper>
                    );
                  } else if (
                    elem.question.response_type == RESPONSE_TYPE.OPTIONS
                  ) {
                    return (
                      <BlockWrapper key={elem.id} hidden={elem.hidden}>
                        <ChoiceQuestionBlock
                          hidden={elem.hidden}
                          inEditMode={elem.id === idOfBlockInEditMode}
                          onAddOption={() => handleAddOption(elem.id)}
                          onDelete={() => handleDelete(elem.id)}
                          onEditModeEnter={() =>
                            setIdOfBlockInEditMode(elem.id)
                          }
                          onEditModeExit={(
                            question: OptionsQuestionPatchBody
                          ) => {
                            if (elem.id === idOfBlockInEditMode) {
                              setIdOfBlockInEditMode(undefined);
                            }
                            model.updateOptionsQuestion(elem.id, question);
                          }}
                          onToggleHidden={(hidden) =>
                            handleToggleHidden(elem.id, hidden)
                          }
                          question={elem.question}
                        />
                      </BlockWrapper>
                    );
                  }
                } else if (elem.type == ELEMENT_TYPE.TEXT) {
                  return (
                    <BlockWrapper key={elem.id} hidden={elem.hidden}>
                      <TextBlock
                        element={elem}
                        hidden={elem.hidden}
                        inEditMode={elem.id === idOfBlockInEditMode}
                        onDelete={() => handleDelete(elem.id)}
                        onEditModeEnter={() => setIdOfBlockInEditMode(elem.id)}
                        onEditModeExit={(
                          textBlock: ZetkinSurveyTextElement['text_block']
                        ) => {
                          if (elem.id === idOfBlockInEditMode) {
                            setIdOfBlockInEditMode(undefined);
                          }
                          model.updateTextBlock(elem.id, textBlock);
                        }}
                        onToggleHidden={(hidden) =>
                          handleToggleHidden(elem.id, hidden)
                        }
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
