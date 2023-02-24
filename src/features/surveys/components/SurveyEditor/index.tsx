import { Box } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import AddBlocks from './AddBlocks';
import BlockArrowIcon from './blocks/BlockArrowIcon';
import BlockWrapper from './blocks/BlockWrapper';
import ChoiceQuestionBlock from './blocks/ChoiceQuestionBlock';
import OpenQuestionBlock from './blocks/OpenQuestionBlock';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import TextBlock from './blocks/TextBlock';
import { ZetkinSurveyElementPatchBody } from 'features/surveys/repos/SurveysRepo';
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
              {data.elements.map((elem, index) => {
                const blockIsOnEdit = elem.id === idOfBlockInEditMode;
                const blockLength = data.elements.length - 1;

                if (elem.type == ELEMENT_TYPE.QUESTION) {
                  if (elem.question.response_type == RESPONSE_TYPE.TEXT) {
                    return (
                      <Box alignItems="center" display="flex">
                        <BlockArrowIcon
                          blockIndex={index}
                          blockIsOnEdit={blockIsOnEdit}
                          blockLength={blockLength}
                        />
                        <BlockWrapper
                          key={elem.id}
                          hidden={elem.hidden}
                          onDelete={() => handleDelete(elem.id)}
                          onToggleHidden={(hidden) =>
                            handleToggleHidden(elem.id, hidden)
                          }
                        >
                          <OpenQuestionBlock
                            element={elem.question}
                            inEditMode={blockIsOnEdit}
                            onEditModeEnter={() =>
                              setIdOfBlockInEditMode(elem.id)
                            }
                            onEditModeExit={(
                              data: ZetkinSurveyElementPatchBody
                            ) => {
                              if (blockIsOnEdit) {
                                setIdOfBlockInEditMode(undefined);
                              }
                              model.updateOpenQuestionBlock(elem.id, data);
                            }}
                          />
                        </BlockWrapper>
                      </Box>
                    );
                  } else if (
                    elem.question.response_type == RESPONSE_TYPE.OPTIONS
                  ) {
                    return (
                      <Box alignItems="center" display="flex">
                        <BlockArrowIcon
                          blockIndex={index}
                          blockIsOnEdit={blockIsOnEdit}
                          blockLength={blockLength}
                        />
                        <BlockWrapper
                          key={elem.id}
                          hidden={elem.hidden}
                          onDelete={() => handleDelete(elem.id)}
                          onToggleHidden={(hidden) =>
                            handleToggleHidden(elem.id, hidden)
                          }
                        >
                          <ChoiceQuestionBlock question={elem.question} />
                        </BlockWrapper>
                      </Box>
                    );
                  }
                } else if (elem.type == ELEMENT_TYPE.TEXT) {
                  return (
                    <Box alignItems="center" display="flex">
                      <BlockArrowIcon
                        blockIndex={index}
                        blockIsOnEdit={blockIsOnEdit}
                        blockLength={blockLength}
                      />

                      <BlockWrapper
                        key={elem.id}
                        hidden={elem.hidden}
                        onDelete={() => handleDelete(elem.id)}
                        onToggleHidden={(hidden) =>
                          handleToggleHidden(elem.id, hidden)
                        }
                      >
                        <TextBlock
                          element={elem}
                          inEditMode={blockIsOnEdit}
                          onEditModeEnter={() =>
                            setIdOfBlockInEditMode(elem.id)
                          }
                          onEditModeExit={(
                            textBlock: ZetkinSurveyTextElement['text_block']
                          ) => {
                            if (blockIsOnEdit) {
                              setIdOfBlockInEditMode(undefined);
                            }
                            model.updateTextBlock(elem.id, textBlock);
                          }}
                        />
                      </BlockWrapper>
                    </Box>
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
