import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { useApiClient } from 'core/hooks';
import renderEmail from '../rpc/renderEmail/client';
import ZUICleanHtml from 'zui/ZUICleanHtml';

type Props = {
  emailId: number;
  orgId: number;
  width: number;
};

const EmailMiniature: FC<Props> = ({ emailId, orgId, width }) => {
  const [html, setHtml] = useState('');
  const [height, setHeight] = useState(0);
  const apiClient = useApiClient();

  useEffect(() => {
    async function load() {
      const renderData = await apiClient.rpc(renderEmail, { emailId, orgId });
      setHtml(renderData.html);
    }

    load();
  });

  return (
    <Box
      sx={{
        height: height,
        position: 'relative',
        width: width,
      }}
    >
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
