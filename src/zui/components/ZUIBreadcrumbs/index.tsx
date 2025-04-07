import NextLink from 'next/link';
import { Box, Link, Menu, SvgIconTypeMap } from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import {
  MoreHoriz,
  SubdirectoryArrowLeft,
  SubdirectoryArrowRight,
} from '@mui/icons-material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';

export interface BreadcrumbTreeItem {
  /**
   * The href that the item leads to.
   */
  href: string;

  /**
   * The icon of the item
   */
  icon?: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;

  /**
   * The title of the item
   */
  title: string;

  /**
   * The children of the item
   */
  children: BreadcrumbTreeItem[] | [];
}

const BreadCrumbSibling: FC<{
  children: ReactNode;
  isCurrentItem: boolean;
  isLast: boolean;
  item: BreadcrumbTreeItem;
}> = ({ children, item, isCurrentItem, isLast }) => {
  const Icon = item.icon;
  return (
    <Box>
      <NextLink href={item.href} legacyBehavior passHref>
        <Link underline="none">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              paddingBottom: isLast ? '' : '0.5rem',
            }}
          >
            {Icon ? (
              <Icon
                sx={(theme) => ({
                  color: theme.palette.grey[300],
                  fontSize: '1.25rem',
                  marginRight: '0.375rem',
                })}
              />
            ) : (
              ''
            )}
            <ZUIText
              variant={isCurrentItem ? 'bodySmSemiBold' : 'bodySmRegular'}
            >
              {item.title}
            </ZUIText>
          </Box>
        </Link>
      </NextLink>
      {children}
    </Box>
  );
};

const Breadcrumb: FC<{
  children: ReactNode;
  isLastLevel: boolean;
  isTopLevel: boolean;
}> = ({ children, isTopLevel, isLastLevel }) => (
  <Box sx={{ display: 'flex' }}>
    {!isTopLevel ? (
      <SubdirectoryArrowRight
        sx={(theme) => ({
          color: theme.palette.grey[200],
          fontSize: '1.25rem',
          marginRight: '0.25rem',
        })}
      />
    ) : (
      ''
    )}
    <Box
      sx={{
        display: isLastLevel ? 'flex' : undefined,
        flexDirection: isLastLevel ? 'column' : undefined,
      }}
    >
      {children}
    </Box>
  </Box>
);

const renderTree = (
  breadcrumbs: BreadcrumbTreeItem[],
  currentItemHref: string,
  isTopLevel: boolean,
  parentHref: string
) => {
  const isLastLevel = !breadcrumbs[0].children.length;
  return (
    <Breadcrumb isLastLevel={isLastLevel} isTopLevel={isTopLevel}>
      {breadcrumbs.slice(0, 9).map((item, index) => (
        <BreadCrumbSibling
          key={item.href}
          isCurrentItem={currentItemHref == item.href}
          isLast={isLastLevel && index == breadcrumbs.length - 1}
          item={item}
        >
          {!isLastLevel
            ? renderTree(item.children, currentItemHref, false, parentHref)
            : ''}
        </BreadCrumbSibling>
      ))}
      {breadcrumbs.length > 9 && (
        <NextLink href={parentHref} legacyBehavior passHref>
          <Link>
            <ZUIText variant="bodySmRegular">
              <Msg
                id={messageIds.breadcrumbs.showMore}
                values={{ number: breadcrumbs.length - 9 }}
              />
            </ZUIText>
          </Link>
        </NextLink>
      )}
    </Breadcrumb>
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

const findParentItem = (
  currentItem: BreadcrumbTreeItem,
  breadcrumbs: BreadcrumbTreeItem[]
): BreadcrumbTreeItem => {
  const crumb = breadcrumbs[0];
  if (crumb.children.find((item) => item.href === currentItem.href)) {
    return crumb;
  } else {
    return findParentItem(currentItem, crumb.children);
  }
};

interface ZUIBreadcrumbsProps {
  /**
   * The list of items to be rendered as breadcrumbs.
   */
  breadcrumbs: BreadcrumbTreeItem[];
}

const ZUIBreadcrumbs: FC<ZUIBreadcrumbsProps> = ({ breadcrumbs }) => {
  const [breadcrumbsAnchorEl, setBreadcrumbsAnchorEl] =
    useState<Element | null>(null);

  const currentItem = findCurrentItem(breadcrumbs);
  const parentItem = findParentItem(currentItem, breadcrumbs);

  return (
    <Box sx={{ alignItems: 'center', display: 'inline-flex' }}>
      <NextLink href={parentItem.href || ''}>
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            backgroundColor: theme.palette.grey[50],
            borderRadius: '2rem 0 0 2rem',
            borderRight: `0.063rem solid ${theme.palette.grey[200]}`,
            display: 'flex',
            height: '1.625rem',
          })}
        >
          <SubdirectoryArrowLeft
            sx={(theme) => ({
              color: theme.palette.secondary.main,
              fontSize: '1rem',
              margin: '0.25rem 0.25rem 0.25rem 0.375rem',
              transform: 'rotate(0.25turn)',
            })}
          />
        </Box>
      </NextLink>
      <Box
        onClick={(ev) =>
          setBreadcrumbsAnchorEl(breadcrumbsAnchorEl ? null : ev.currentTarget)
        }
        sx={(theme) => ({
          alignItems: 'center',
          backgroundColor: theme.palette.grey[50],
          borderRadius: '0 2rem 2rem 0',
          cursor: 'pointer',
          display: 'flex',
          height: '1.625rem',
        })}
      >
        <MoreHoriz
          sx={(theme) => ({
            color: theme.palette.secondary.main,
            fontSize: '1.125rem',
            margin: '0.25rem 0.375rem 0.25rem 0.25rem',
          })}
        />
        <Menu
          anchorEl={breadcrumbsAnchorEl}
          onClose={() => setBreadcrumbsAnchorEl(null)}
          open={!!breadcrumbsAnchorEl}
          slotProps={{
            paper: { sx: { boxShadow: '0rem 0.25rem 1.25rem 0rem #0000001F' } },
          }}
        >
          <Box sx={{ paddingX: '1rem' }}>
            {renderTree(breadcrumbs, currentItem?.href, true, parentItem.href)}
          </Box>
        </Menu>
      </Box>
    </Box>
  );
};

export default ZUIBreadcrumbs;
