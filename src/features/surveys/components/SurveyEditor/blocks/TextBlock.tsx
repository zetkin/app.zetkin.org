import { Box, ClickAwayListener } from '@mui/material';
import { FC, useState } from 'react';

import DeleteHideButtons from '../DeleteHideButtons';
import PreviewableSurveyInput from '../elements/PreviewableSurveyInput';
import useEditPreviewBlock from 'zui/hooks/useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import useSurveyMutations from 'features/surveys/hooks/useSurveyMutations';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

import messageIds from 'features/surveys/l10n/messageIds';

interface TextBlockProps {
  editable: boolean;
  element: ZetkinSurveyTextElement;
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
  orgId: number;
  readOnly: boolean;
  surveyId: number;
}

const TextBlock: FC<TextBlockProps> = ({
  editable,
  element,
  onEditModeEnter,
  onEditModeExit,
  orgId,
  readOnly,
  surveyId,
}) => {
  const messages = useMessages(messageIds);
  const { updateElement } = useSurveyMutations(orgId, surveyId);

  const [header, setHeader] = useState(element.text_block.header);
  const [content, setContent] = useState(element.text_block.content);

  const { autoFocusDefault, clickAwayProps, containerProps, previewableProps } =
    useEditPreviewBlock({
      editable,
      onEditModeEnter,
      onEditModeExit,
      readOnly,
      save: () => {
        updateElement(element.id, {
          text_block: {
            content: content,
            header: header,
          },
        });
      },
    });

  return (
    <ClickAwayListener {...clickAwayProps}>
      <Box {...containerProps}>
        <PreviewableSurveyInput
          {...previewableProps}
          focusInitially={autoFocusDefault}
          label={messages.blocks.text.header()}
          onChange={(value) => setHeader(value)}
          placeholder={messages.blocks.text.empty()}
          value={header}
          variant="header"
        />
        <PreviewableSurveyInput
          {...previewableProps}
          label={messages.blocks.text.content()}
          onChange={(value) => setContent(value)}
          placeholder=""
          value={content}
          variant="content"
        />
        <Box display="flex" justifyContent="end" m={2}>
          {!readOnly && (
            <DeleteHideButtons
              element={element}
              orgId={orgId}
              surveyId={surveyId}
            />
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default TextBlock;
