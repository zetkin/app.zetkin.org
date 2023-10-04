import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { CircularProgress, Link, Theme } from '@mui/material';
import { FC, useContext } from 'react';

import BrowserDraggableItem from './BrowserDragableItem';
import { Msg } from 'core/i18n';
import useItems, { ViewBrowserItem } from 'features/views/hooks/useItems';

import { BrowserRowContext, BrowserRowDropProps } from './BrowserRow';

import messageIds from 'features/views/l10n/messageIds';

interface BrowserItemProps {
  basePath: string;
  item: ViewBrowserItem;
}

const useStyles = makeStyles<Theme, BrowserRowDropProps>({
  itemLink: {
    '&:hover': {
      textDecoration: 'underline',
    },
    color: 'inherit',
    fontWeight: (props) => (props.active ? 'bold' : 'normal'),
    textDecoration: 'none',
  },
});

const BrowserItem: FC<BrowserItemProps> = ({ basePath, item }) => {
  const dropProps = useContext(BrowserRowContext);
  const styles = useStyles(dropProps);
  const { orgId } = useRouter().query;
  const { itemIsRenaming } = useItems(parseInt(orgId as string), item.folderId);

  if (item.type == 'back') {
    const subPath = item.folderId ? 'folders/' + item.folderId : '';

    return (
      <NextLink href={`${basePath}/${subPath}`} passHref>
        <Link className={styles.itemLink}>
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
        <NextLink href={`${basePath}/${item.id}`} passHref>
          <Link className={styles.itemLink}>{item.title}</Link>
        </NextLink>
        {itemIsRenaming(item.type, item.data.id) && (
          <CircularProgress size={20} />
        )}
      </BrowserDraggableItem>
    );
  }
};

export default BrowserItem;
