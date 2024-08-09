import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { Box, Link, Menu, Typography } from '@mui/material';
import { FC, useState } from 'react';
import {
  MoreHoriz,
  SubdirectoryArrowLeft,
  SubdirectoryArrowRight,
} from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  leftSide: {
    alignItems: 'center',
    backgroundColor: theme.palette.grey[200],
    borderRadius: '2em 0 0 2em',
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    display: 'flex',
    paddingLeft: 0.2,
  },
  rightSide: {
    alignItems: 'center',
    backgroundColor: theme.palette.grey[200],
    borderRadius: '0 2em 2em 0',
    cursor: 'pointer',
    display: 'flex',
    paddingRight: 0.2,
  },
}));

export interface BreadcrumbTreeItem {
  href: string;
  id: number;
  title: string;
  parent: {
    href: string;
    id: number;
    title: string;
  } | null;
  children: BreadcrumbTreeItem[] | [];
}

const renderTree = (
  breadcrumbs: BreadcrumbTreeItem[],
  currentItemId: number
) => {
  const isTopLevel = !breadcrumbs[0].parent;
  const isLastLevel = !breadcrumbs[0].children.length;
  return (
    <Box>
      <Box display="flex">
        {!isTopLevel ? (
          <SubdirectoryArrowRight
            color="secondary"
            fontSize="small"
            sx={{ marginRight: 0.5 }}
          />
        ) : (
          ''
        )}
        <Box
          display={isLastLevel ? 'flex' : undefined}
          flexDirection={isLastLevel ? 'column' : undefined}
        >
          {breadcrumbs.map((item, index) => (
            <Box key={item.id}>
              <NextLink href={item.href} legacyBehavior passHref>
                <Link underline="none">
                  <Typography
                    sx={{
                      fontWeight: currentItemId == item.id ? 'bold' : 'normal',
                      paddingBottom:
                        isLastLevel && index == breadcrumbs.length - 1 ? '' : 1,
                    }}
                    variant="body2"
                  >
                    {item.title}
                  </Typography>
                </Link>
              </NextLink>
              {!isLastLevel ? renderTree(item.children, currentItemId) : ''}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const findCurrentItem = (
  breadcrumbs: BreadcrumbTreeItem[]
): BreadcrumbTreeItem => {
  const crumb = breadcrumbs[0];
  if (crumb.children.length === 0) {
    return crumb;
  } else {
    return findCurrentItem(crumb.children);
  }
};

interface ZUIBreadcrumbsProps {
  breadcrumbs: BreadcrumbTreeItem[];
}

const ZUIBreadcrumbs: FC<ZUIBreadcrumbsProps> = ({ breadcrumbs }) => {
  const classes = useStyles();
  const [breadcrumbsAnchorEl, setBreadcrumbsAnchorEl] =
    useState<Element | null>(null);

  const currentItem = findCurrentItem(breadcrumbs);

  return (
    <Box alignItems="center" display="inline-flex">
      <NextLink href={currentItem?.parent?.href || ''}>
        <Box className={classes.leftSide}>
          <SubdirectoryArrowLeft
            color="secondary"
            fontSize="small"
            sx={{
              margin: 0.5,
              transform: 'rotate(0.25turn)',
            }}
          />
        </Box>
      </NextLink>
      <Box
        className={classes.rightSide}
        onClick={(ev) =>
          setBreadcrumbsAnchorEl(breadcrumbsAnchorEl ? null : ev.currentTarget)
        }
      >
        <MoreHoriz color="secondary" fontSize="small" sx={{ margin: 0.5 }} />
        <Menu
          anchorEl={breadcrumbsAnchorEl}
          onClose={() => setBreadcrumbsAnchorEl(null)}
          open={!!breadcrumbsAnchorEl}
        >
          <Box paddingX={2}>{renderTree(breadcrumbs, currentItem?.id)}</Box>
        </Menu>
      </Box>
    </Box>
  );
};

export default ZUIBreadcrumbs;
