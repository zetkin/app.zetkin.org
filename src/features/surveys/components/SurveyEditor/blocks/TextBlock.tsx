import { Box, ClickAwayListener } from '@mui/material';
import { FC, useState } from 'react';

import DeleteHideButtons from '../DeleteHideButtons';
import PreviewableSurveyInput from '../elements/PreviewableSurveyInput';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import useEditPreviewBlock from './useEditPreviewBlock';
import { useMessages } from 'core/i18n';
import { ZetkinSurveyTextElement } from 'utils/types/zetkin';

import messageIds from 'features/surveys/l10n/messageIds';

interface TextBlockProps {
  editable: boolean;
  element: ZetkinSurveyTextElement;
  model: SurveyDataModel;
  onEditModeEnter: () => void;
  onEditModeExit: () => void;
}

const TextBlock: FC<TextBlockProps> = ({
  editable,
  element,
  model,
  onEditModeEnter,
  onEditModeExit,
}) => {
  const messages = useMessages(messageIds);

  const [header, setHeader] = useState(element.text_block.header);
  const [content, setContent] = useState(element.text_block.content);

  const { clickAwayProps, previewableProps } = useEditPreviewBlock({
    editable,
    onEditModeEnter,
    onEditModeExit,
    save: () => {
      model.updateElement(element.id, {
        text_block: {
          content: content,
          header: header,
        },
      });
    },
  });

  return (
    <ClickAwayListener {...clickAwayProps}>
      <Box>
        <PreviewableSurveyInput
          {...previewableProps}
          label={messages.blocks.text.header()}
          onChange={(value) => setHeader(value)}
          placeholder={messages.blocks.text.empty()}
          value={header}
          variant="h4"
        />
        <PreviewableSurveyInput
          {...previewableProps}
          label={messages.blocks.text.content()}
          onChange={(value) => setContent(value)}
          placeholder=""
          value={content}
          variant="h5"
        />
        <Box display="flex" justifyContent="end" m={2}>
          <DeleteHideButtons element={element} model={model} />
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default TextBlock;
