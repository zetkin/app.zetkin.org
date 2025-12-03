import NextLink from 'next/link';
import { CircularProgress, Link, SxProps } from '@mui/material';
import { FC, MouseEvent, useContext } from 'react';

import BrowserDraggableItem from './BrowserDragableItem';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useViewBrowserMutations from 'features/views/hooks/useViewBrowserMutations';
import { ViewBrowserItem } from 'features/views/hooks/useViewBrowserItems';
import { BrowserRowContext } from './BrowserRow';
import messageIds from 'features/views/l10n/messageIds';

interface BrowserItemProps {
  basePath: string;
  item: ViewBrowserItem;
  onClick: (ev: MouseEvent) => void;
}

const BrowserItem: FC<BrowserItemProps> = ({ basePath, item, onClick }) => {
  const dropProps = useContext(BrowserRowContext);
  const { orgId } = useNumericRouteParams();
  const { itemIsRenaming } = useViewBrowserMutations(orgId);

  const linkStyles: SxProps = {
    '&:hover': {
      textDecoration: 'underline',
    },
    color: 'inherit',
    fontWeight: dropProps.active ? 'bold' : 'normal',
    textDecoration: 'none',
  };

  if (item.type == 'back') {
    const subPath = item.folderId ? 'folders/' + item.folderId : '';

    return (
      <NextLink href={`${basePath}/${subPath}`} legacyBehavior passHref>
        <Link onClick={(ev) => onClick(ev)} sx={linkStyles}>
          {item.title ? (
            <Msg
              id={
                dropProps.active
                  ? messageIds.browser.moveToFolder
                  : messageIds.browser.backToFolder
              }
              values={{ folder: <em>{item.title}</em> }}
            />
          ) : (
            <Msg
              id={
                dropProps.active
                  ? messageIds.browser.moveToRoot
                  : messageIds.browser.backToRoot
              }
            />
          )}
        </Link>
      </NextLink>
    );
  } else {
    return (
      <BrowserDraggableItem item={item}>
        <NextLink href={`${basePath}/${item.id}`} legacyBehavior passHref>
          <Link onClick={(ev) => onClick(ev)} sx={linkStyles}>
            {item.title}
          </Link>
        </NextLink>
        {itemIsRenaming(item.type, item.data.id) && (
          <CircularProgress size={20} />
        )}
      </BrowserDraggableItem>
    );
  }
};

export default BrowserItem;
