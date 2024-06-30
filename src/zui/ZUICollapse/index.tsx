import { Button, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useCallback, useState } from 'react';

import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

interface ZUICollapseProps {
  children: React.ReactNode;
  collapsedSize: number;
}

const ZUICollapse: React.FC<ZUICollapseProps> = ({
  children,
  collapsedSize,
}) => {
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const [didMeasure, setDidMeasure] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const divCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const height = node.clientHeight;
        if (height > collapsedSize && !needsCollapse) {
          setNeedsCollapse(true);
        }
        setDidMeasure(true);
      }
    },
    [setNeedsCollapse]
  );

  return (
    <>
      <Collapse
        collapsedSize={collapsedSize}
        in={(didMeasure && !needsCollapse) || !collapsed}
      >
        <div ref={divCallback}>{children}</div>
      </Collapse>
      {needsCollapse && (
        <Button
          color="primary"
          onClick={() => setCollapsed(!collapsed)}
          startIcon={collapsed ? <ExpandMore /> : <ExpandLess />}
          style={{ textTransform: 'uppercase' }}
        >
          <Msg
            id={
              collapsed
                ? messageIds.collapse.expand
                : messageIds.collapse.collapse
            }
          />
        </Button>
      )}
    </>
  );
};

export default ZUICollapse;
