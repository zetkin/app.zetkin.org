import { OpenInNew } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Popper,
  TextField,
} from '@mui/material';
import { FC, useState } from 'react';

import formatUrl from 'utils/formatUrl';
import messageIds from 'zui/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

type Props = {
  href: string;
  onCancel: () => void;
  onChangeHref: (href: string) => void;
  onChangeText: (text: string) => void;
  onRemove?: () => void;
  onSubmit: () => void;
  open: boolean;
  text: string;
  x: number;
  y: number;
};

const TextAndHrefOverlay: FC<Props> = ({
  href,
  onCancel,
  onChangeHref,
  onChangeText,
  onRemove,
  onSubmit,
  open,
  text,
  x,
  y,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const messages = useMessages(messageIds);

  const formattedHref = formatUrl(href);
  const canSubmit = !!formattedHref && text.length > 0;

  return (
    <Box position="relative">
      <Box
        ref={(el: HTMLElement) => setAnchorEl(el)}
        sx={{
          left: x,
          position: 'absolute',
          top: y,
        }}
      >
        <Popper anchorEl={anchorEl} open={open}>
          <Paper elevation={1}>
            <Box
              alignItems="stretch"
              display="flex"
              flexDirection="column"
              gap={1}
              padding={1}
            >
              <Box display="flex">
                <TextField
                  fullWidth
                  onChange={(ev) => onChangeHref(ev.target.value)}
                  size="small"
                  value={href}
                />
                <IconButton
                  disabled={!formattedHref}
                  href={formattedHref || ''}
                  target="_blank"
                >
                  <OpenInNew />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <TextField
                  fullWidth
                  onChange={(ev) => onChangeText(ev.target.value)}
                  placeholder={messages.editor.extensions.link.textPlaceholder()}
                  size="small"
                  value={text}
                />
              </Box>
              <Box
                display="flex"
                justifyContent={onRemove ? 'space-between' : 'flex-end'}
              >
                {!!onRemove && (
                  <Button
                    onClick={() => {
                      onRemove();
                    }}
                    size="small"
                    variant="text"
                  >
                    <Msg id={messageIds.editor.extensions.link.remove} />
                  </Button>
                )}
                <Box display="flex" gap={1}>
                  <Button
                    onClick={() => {
                      onCancel();
                    }}
                    size="small"
                  >
                    <Msg id={messageIds.editor.extensions.link.cancel} />
                  </Button>

                  <Button
                    disabled={!canSubmit}
                    onClick={() => {
                      onSubmit();
                    }}
                    size="small"
                    variant="outlined"
                  >
                    <Msg id={messageIds.editor.extensions.link.apply} />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Popper>
      </Box>
    </Box>
  );
};

export default TextAndHrefOverlay;
