/* eslint-disable sort-keys */
import { Box } from '@mui/material';
import ContentEditable from 'react-contenteditable';
import DOMPurify from 'dompurify';
import { FC, useState } from 'react';

import { BlockAttributes } from 'features/emails/types';
import { ButtonData } from '.';
import { defaultButtonAttributes } from '../../utils/defaultBlockAttributes';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface ButtonEditableBlockProps {
  attributes?: BlockAttributes['button'];
  data: ButtonData;
  onChange: (newButtonText: string) => void;
  readOnly: boolean;
}

const ButtonEditableBlock: FC<ButtonEditableBlockProps> = ({
  attributes = {},
  data,
  onChange,
  readOnly,
}) => {
  const messages = useMessages(messageIds);
  const [buttonText, setButtonText] = useState(
    data.buttonText || messages.editor.tools.button.block.noButtonText()
  );

  const verticalAlignment = () => {
    const centered = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    };

    if (attributes['vertical-align'] === 'top') {
      centered['justifyContent'] = 'flex-start';
    } else if (attributes['vertical-align'] === 'bottom') {
      centered['justifyContent'] = 'flex-end';
    }

    return centered;
  };

  return (
    <Box
      bgcolor={
        attributes['container-background-color']
          ? attributes['container-background-color']
          : ''
      }
      display="flex"
      justifyContent="center"
      padding={2}
    >
      <Box
        sx={{
          backgroundColor: attributes['background-color']
            ? attributes['background-color']
            : defaultButtonAttributes['backgroundColor'],
          borderBottom: attributes['border-bottom']
            ? attributes['border-bottom']
            : defaultButtonAttributes['borderBottom'],
          borderLeft: attributes['border-left']
            ? attributes['border-left']
            : defaultButtonAttributes['borderLeft'],
          borderRadius: attributes['border-radius']
            ? attributes['border-radius']
            : defaultButtonAttributes['borderRadius'],
          borderRight: attributes['border-right']
            ? attributes['border-right']
            : defaultButtonAttributes['borderRight'],
          borderTop: attributes['border-top']
            ? attributes['border-top']
            : defaultButtonAttributes['borderTop'],
          border: attributes['border']
            ? attributes['border']
            : defaultButtonAttributes['border'],
          color: attributes['color']
            ? attributes['color']
            : defaultButtonAttributes['color'],
          fontFamily: attributes['font-family']
            ? attributes['font-family']
            : defaultButtonAttributes['fontFamily'],
          fontSize: attributes['font-size']
            ? attributes['font-size']
            : defaultButtonAttributes['fontSize'],
          fontStyle: attributes['font-style']
            ? attributes['font-style']
            : defaultButtonAttributes['fontStyle'],
          fontWeight: attributes['font-weight']
            ? attributes['font-weight']
            : defaultButtonAttributes['fontWeight'],
          height: attributes['height']
            ? attributes['height']
            : defaultButtonAttributes['height'],
          letterSpacing: attributes['letter-spacing']
            ? attributes['letter-spacing']
            : defaultButtonAttributes['letterSpacing'],
          lineHeight: attributes['line-height']
            ? attributes['line-height']
            : defaultButtonAttributes['lineHeight'],
          marginBottom: attributes['padding-bottom']
            ? `${attributes['padding-bottom']}px`
            : defaultButtonAttributes['marginBottom'],
          marginLeft: attributes['padding-left']
            ? `${attributes['padding-left']}px`
            : defaultButtonAttributes['marginLeft'],
          marginRight: attributes['padding-right']
            ? `${attributes['padding-right']}px`
            : defaultButtonAttributes['marginRight'],
          marginTop: attributes['padding-top']
            ? `${attributes['padding-top']}px`
            : defaultButtonAttributes['marginTop'],
          margin: attributes['padding']
            ? attributes['padding']
            : defaultButtonAttributes['margin'], //This looks wrong, but in mjml "style" the word padding is what in css is called margin
          padding: attributes['inner-padding']
            ? `${attributes['inner-padding']}px`
            : defaultButtonAttributes['padding'],
          textAlign: attributes['text-align']
            ? attributes['text-align']
            : defaultButtonAttributes['textAlign'],
          textDecoration: attributes['text-decoration']
            ? attributes['text-decoration']
            : defaultButtonAttributes['textDecoration'],
          textTransform: attributes['text-transform']
            ? attributes['text-transform']
            : defaultButtonAttributes['textTransform'],
          width: attributes['width']
            ? `${attributes['width']}px`
            : defaultButtonAttributes['width'],
          ...verticalAlignment(),
        }}
      >
        {readOnly ? (
          buttonText
        ) : (
          <ContentEditable
            html={buttonText}
            onChange={(ev) => {
              const cleanHtml = DOMPurify.sanitize(ev.currentTarget.innerHTML, {
                ALLOWED_TAGS: [],
              });
              setButtonText(cleanHtml);
              onChange(cleanHtml);
            }}
            style={{ outline: 'none' }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ButtonEditableBlock;
