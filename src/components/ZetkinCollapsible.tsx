import { FormattedMessage } from 'react-intl';
import { Button, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useCallback, useState } from 'react';

interface ZetkinCollapsibleProps {
  collapsedHeight: number;
}

const ZetkinCollapsible: React.FC<ZetkinCollapsibleProps> = ({
  children,
  collapsedHeight,
}) => {
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const [didMeasure, setDidMeasure] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const divCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const height = node.clientHeight;
        if (height > collapsedHeight && !needsCollapse) {
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
        collapsedSize={collapsedHeight}
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
          <FormattedMessage
            id={collapsed ? 'misc.buttons.expand' : 'misc.buttons.collapse'}
          />
        </Button>
      )}
    </>
  );
};

export default ZetkinCollapsible;
