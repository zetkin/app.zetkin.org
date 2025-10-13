import { FC, PropsWithChildren } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import ZUIPersonAvatar, { ZUIPersonAvatarProps } from '../ZUIPersonAvatar';
import { MUIIcon } from '../types';
import ZUIIcon from '../ZUIIcon';
import ZUILink from '../ZUILink';
import ZUIText from '../ZUIText';

type ItemCardBase = {
  /**
   * The content of the card.
   *
   * Can be either an array of elements and/or strings,
   * or just a string.
   *
   * DO NOT: use this prop to send in a complex component,
   * for example a Box that contains a ZUIIconLabel and a ZUIText.
   *
   * DO: Send in an array that contains, for example,
   * a ZUIIconLabel and a string.
   */
  content?: (JSX.Element | string)[] | string;

  /**
   * An optional URL to link to when the title or image is clicked.
   */
  href?: string;

  /**
   * The subtitle of the card
   */
  subtitle?: string;

  /**
   * The title of the card.
   */
  title: string;
};

type AvatarCard = ItemCardBase & {
  /**
   * An avatar to be displayed to the left of the card title.
   */
  avatar: Omit<ZUIPersonAvatarProps, 'size' | 'variant'>;
};

type IconCard = ItemCardBase & {
  /**
   * An icon that will be displayed to the left of the card title.
   */
  icon: MUIIcon;
};

type CardWithoutImage = ItemCardBase | AvatarCard | IconCard;

type ImageSrcCard = CardWithoutImage & {
  /**
   * The src to an image file.
   * The image will be rendered at the top of the card.
   */
  src: string;
};

type ImageElementCard = CardWithoutImage & {
  /**
   * An element to display as an image at the top of the card.
   * Use this prop if the card image is, for example, an icon
   * on a colored background.
   *
   * This element needs to have its height set to 100%.
   *
   * If you have an image file, use the "src" prop instead.
   */
  imageElement?: JSX.Element;
};

type CardWithImage = ImageSrcCard | ImageElementCard;

type CardWithoutActions = CardWithoutImage | CardWithImage;

type CardWithActions = CardWithoutActions & {
  /**
   * An array of elements to be displayed at the bottom of the card.
   *
   * DO NOT: use this prop to send in a complex component,
   * for example a Box that contains a ZUIButton and a ZUIStatusChip.
   *
   * DO: Send in an array that contains, for example, a ZUIButton and a ZUIStatusChip.
   */
  actions: JSX.Element[];
};

type ItemCard = CardWithoutActions | CardWithActions;

const isAvatarCard = (itemCard: ItemCard): itemCard is AvatarCard => {
  return 'avatar' in itemCard;
};

const isIconCard = (itemCard: ItemCard): itemCard is IconCard => {
  return 'icon' in itemCard;
};

const isImageSrcCard = (itemCard: ItemCard): itemCard is ImageSrcCard => {
  return 'src' in itemCard && !!itemCard.src;
};

const isImageElementCard = (
  itemCard: ItemCard
): itemCard is ImageElementCard => {
  return 'imageElement' in itemCard && !!itemCard.imageElement;
};

const isCardWithActions = (itemCard: ItemCard): itemCard is CardWithActions => {
  return 'actions' in itemCard;
};

const ZUIItemCard: FC<ItemCard> = (props) => {
  const { href, title, subtitle } = props;

  const hasImageElement = isImageElementCard(props);
  const hasImageSrc = isImageSrcCard(props);
  const hasAvatar = isAvatarCard(props);
  const hasIcon = isIconCard(props);
  const hasActions = isCardWithActions(props);

  const content = props.content;
  const hasContent = !!content;
  const hasStringContent = hasContent && typeof content == 'string';
  const hasArrayContent = hasContent && Array.isArray(content);

  const hasImage = hasImageElement || hasImageSrc;

  const ImageWrapper: FC<PropsWithChildren> = href
    ? ({ children }) => <Link href={href}>{children}</Link>
    : ({ children }) => children as JSX.Element;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.common.white,
        border: `0.063rem solid ${theme.palette.dividers.main}`,
        borderRadius: '0.25rem',
        overflow: 'hidden',
      })}
    >
      {hasImage && (
        <ImageWrapper>
          <Box
            sx={{
              height: '9.375rem',
            }}
          >
            {hasImageSrc && (
              <Image
                alt={props.title}
                height={480}
                src={props.src}
                style={{ height: '100%', objectFit: 'cover', width: '100%' }}
                width={960}
              />
            )}
            {hasImageElement && props.imageElement}
          </Box>
        </ImageWrapper>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          padding: '1.25rem',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
            {hasIcon && (
              <ZUIIcon color="secondary" icon={props.icon} size="large" />
            )}
            {hasAvatar && (
              <ZUIPersonAvatar
                firstName={props.avatar.firstName}
                id={props.avatar.id}
                lastName={props.avatar.lastName}
                size="large"
              />
            )}
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}
            >
              <Typography variant="bodyMdSemiBold">
                {href ? (
                  <ZUILink href={href} text={title} hoverUnderline={true} />
                ) : (
                  title
                )}
              </Typography>

              {subtitle && (
                <Typography variant="bodyMdRegular">{subtitle}</Typography>
              )}
            </Box>
          </Box>
          {hasArrayContent && (
            <Stack spacing="0.5rem">
              {content.map((c) => {
                if (typeof c == 'string') {
                  return (
                    <ZUIText key={c} color="secondary" variant="bodySmRegular">
                      {c}
                    </ZUIText>
                  );
                } else {
                  return c;
                }
              })}
            </Stack>
          )}
          {hasStringContent && (
            <ZUIText color="secondary" variant="bodySmRegular">
              {content}
            </ZUIText>
          )}
        </Box>
        {hasActions && (
          <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
            {props.actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ZUIItemCard;
