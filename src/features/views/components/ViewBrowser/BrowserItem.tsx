import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { CircularProgress, Link, Theme } from '@mui/material';
import { FC, useContext } from 'react';

import BrowserDraggableItem from './BrowserDragableItem';
import { Msg } from 'core/i18n';
import { BrowserRowContext, BrowserRowDropProps } from './BrowserRow';
import ViewBrowserModel, {
  ViewBrowserItem,
} from 'features/views/models/ViewBrowserModel';

import messageIds from 'features/views/l10n/messageIds';

interface BrowserItemProps {
  basePath: string;
  item: ViewBrowserItem;
  model: ViewBrowserModel;
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

const BrowserItem: FC<BrowserItemProps> = ({ basePath, item, model }) => {
  const dropProps = useContext(BrowserRowContext);
  const styles = useStyles(dropProps);

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
        {model.itemIsRenaming(item.type, item.data.id) && (
          <CircularProgress size={20} />
        )}
      </BrowserDraggableItem>
    );
  }
};

export default BrowserItem;
