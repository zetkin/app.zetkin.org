import AddBlocks from './AddBlocks';
import BlockWrapper from './blocks/BlockWrapper';
import { Box } from '@mui/material';
import ChoiceQuestionBlock from './blocks/ChoiceQuestionBlock';
import OpenQuestionBlock from './blocks/OpenQuestionBlock';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import TextBlock from './blocks/TextBlock';
import { ZetkinSurveyElementPatchBody } from 'features/surveys/repos/SurveysRepo';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIReorderable, { IDType } from 'zui/ZUIReorderable';

import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyElement,
  ZetkinSurveyTextElement,
} from 'utils/types/zetkin';
import { FC, useEffect, useRef, useState } from 'react';

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

  const getElement = (elem: ZetkinSurveyElement) => {
    if (elem.type == ELEMENT_TYPE.QUESTION) {
      if (elem.question.response_type == RESPONSE_TYPE.TEXT) {
        return {
          element: (
            <BlockWrapper
              key={elem.id}
              hidden={elem.hidden}
              onDelete={() => handleDelete(elem.id)}
              onToggleHidden={(hidden) => handleToggleHidden(elem.id, hidden)}
            >
              <OpenQuestionBlock
                element={elem.question}
                inEditMode={elem.id === idOfBlockInEditMode}
                onEditModeEnter={() => setIdOfBlockInEditMode(elem.id)}
                onEditModeExit={(data: ZetkinSurveyElementPatchBody) => {
                  if (elem.id === idOfBlockInEditMode) {
                    setIdOfBlockInEditMode(undefined);
                  }
                  model.updateOpenQuestionBlock(elem.id, data);
                }}
              />
            </BlockWrapper>
          ),
          id: elem.id,
        };
      } else if (elem.question.response_type == RESPONSE_TYPE.OPTIONS) {
        return {
          element: (
            <BlockWrapper
              key={elem.id}
              hidden={elem.hidden}
              onDelete={() => handleDelete(elem.id)}
              onToggleHidden={(hidden) => handleToggleHidden(elem.id, hidden)}
            >
              <ChoiceQuestionBlock question={elem.question} />
            </BlockWrapper>
          ),
          id: elem.id,
        };
      }
    } else if (elem.type == ELEMENT_TYPE.TEXT) {
      return {
        element: (
          <BlockWrapper
            key={elem.id}
            hidden={elem.hidden}
            onDelete={() => handleDelete(elem.id)}
            onToggleHidden={(hidden) => handleToggleHidden(elem.id, hidden)}
          >
            <TextBlock
              element={elem}
              inEditMode={elem.id === idOfBlockInEditMode}
              onEditModeEnter={() => setIdOfBlockInEditMode(elem.id)}
              onEditModeExit={(
                textBlock: ZetkinSurveyTextElement['text_block']
              ) => {
                if (elem.id === idOfBlockInEditMode) {
                  setIdOfBlockInEditMode(undefined);
                }
                model.updateTextBlock(elem.id, textBlock);
              }}
            />
          </BlockWrapper>
        ),
        id: elem.id,
      };
    }
    return { element: <></>, id: 0 };
  };

  const onReorder = (orderedIds: IDType[]) => {};

  return (
    <>
      <ZUIFuture future={model.getData()}>
        {(data) => {
          return (
            <Box paddingBottom={data.elements.length ? 4 : 0}>
              <ZUIReorderable
                items={data.elements.map(getElement)}
                onReorder={onReorder}
              />
            </Box>
          );
        }}
      </ZUIFuture>
      <AddBlocks model={model} />
    </>
  );
};

export default SurveyEditor;
