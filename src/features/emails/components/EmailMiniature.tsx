import { Box, useTheme } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import { useApiClient } from 'core/hooks';
import renderEmail from '../rpc/renderEmail/client';
import ZUICleanHtml from 'zui/ZUICleanHtml';

type Props = {
  emailId: number;
  margin?: number;
  orgId: number;
  selectedTag?: string | null;
  width: number;
};

type Rect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

const EmailMiniature: FC<Props> = ({
  emailId,
  margin = 4,
  orgId,
  selectedTag,
  width,
}) => {
  const containerRef = useRef<HTMLDivElement>();
  const [html, setHtml] = useState('');
  const [height, setHeight] = useState(0);
  const apiClient = useApiClient();
  const [rect, setRect] = useState<Rect | null>(null);

  const theme = useTheme();

  useEffect(() => {
    async function load() {
      const renderData = await apiClient.rpc(renderEmail, { emailId, orgId });
      setHtml(renderData.html);
    }

    load();
  }, []);

  useEffect(() => {
    const elem = document.querySelector(`.email-link-${selectedTag}`);
    if (elem && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elemRect = elem.getBoundingClientRect();
      setRect({
        height: elemRect.height,
        left: elemRect.left - containerRect.left,
        top: elemRect.top - containerRect.top,
        width: elemRect.width,
      });
    } else {
      setRect(null);
    }
  }, [selectedTag]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: height,
        position: 'relative',
        width: width,
      }}
    >
      {rect && (
        <Box
          sx={{
            borderColor: theme.palette.primary.main,
            borderRadius: 1,
            borderStyle: 'solid',
            borderWidth: 2,
            height: rect.height + margin * 2,
            left: rect.left - margin,
            position: 'absolute',
            top: rect.top - margin,
            width: rect.width + margin * 2,
            zIndex: 100,
          }}
        />
      )}
      <div
        ref={(elem) => {
          if (elem) {
            setHeight(0.2 * elem.clientHeight);
          }
        }}
        style={{
          left: 0,
          position: 'absolute',
          top: 0,
          transform: 'scale(0.2)',
          transformOrigin: 'top left',
          width: width / 0.2,
        }}
      >
        <ZUICleanHtml dirtyHtml={html} />;
      </div>
    </Box>
  );
};

export default EmailMiniature;
