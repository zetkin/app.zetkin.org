import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { useDrag } from 'react-dnd';
import { Box, CircularProgress, Link } from '@mui/material';

import ViewBrowserModel, {
  ViewBrowserItem,
} from 'features/views/models/ViewBrowserModel';

interface BrowserItemProps {
  basePath: string;
  item: ViewBrowserItem;
  model: ViewBrowserModel;
}

const useStyles = makeStyles(() => ({
  itemLink: {
    '&:hover': {
      textDecoration: 'underline',
    },
    color: 'inherit',
    textDecoration: 'none',
  },
}));

const BrowserItem: FC<BrowserItemProps> = ({ basePath, item, model }) => {
  const styles = useStyles();

  const [, dragRef] = useDrag({
    item: item,
    type: 'ITEM',
  });

  if (item.type == 'back') {
    const subPath = item.folderId ? 'folders/' + item.folderId : '';

    return (
      <NextLink href={`${basePath}/${subPath}`} passHref>
        <Link className={styles.itemLink}>
          {item.title ? (
            <FormattedMessage
              id="pages.people.views.browser.backToFolder"
              values={{ folder: <em>{item.title}</em> }}
            />
          ) : (
            <FormattedMessage id="pages.people.views.browser.backToRoot" />
          )}
        </Link>
      </NextLink>
    );
  } else {
    return (
      <Box ref={dragRef} display="flex" gap={1}>
        <NextLink href={`${basePath}/${item.id}`} passHref>
          <Link className={styles.itemLink}>{item.title}</Link>
        </NextLink>
        {model.itemIsRenaming(item.type, item.data.id) && (
          <CircularProgress size={20} />
        )}
      </Box>
    );
  }
};

export default BrowserItem;
