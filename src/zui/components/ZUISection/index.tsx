import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import ZUIDivider from '../ZUIDivider';
import { ZUIOrientation } from '../types';

type SubSectionBase = {
  /**
   * The content of the sub section.
   */
  renderContent: () => JSX.Element;

  /**
   * The subtitle of the sub section.
   */
  subtitle?: string;

  /**
   * The title of the sub section,
   */
  title: string;
};

type SubSectionWithFullWidthHeaderContent = SubSectionBase & {
  /**
   * A function that returns a component that will be
   * rendered as full width content in the header.
   */
  renderFullWidthHeaderContent: () => JSX.Element;
};

type SubSectionWithRightHeaderContent = SubSectionBase & {
  /**
   * A function that returns a component that will be rendered
   * in the right side of the header.
   */
  renderRightHeaderContent: () => JSX.Element;
};

type SubSectionType =
  | SubSectionBase
  | SubSectionWithFullWidthHeaderContent
  | SubSectionWithRightHeaderContent;

type SectionBase = {
  /**
   * If the section should have rounded gray borders.
   * Defaults to "true".
   */
  borders?: boolean;

  /**
   * If the section should grow to the height of its parent.
   * Defaults to "false".
   */
  fullHeight?: boolean;

  /**
   * The subtitle of the section.
   */
  subtitle?: string;

  /**
   * The title of the section.
   */
  title: string;
};

type SectionWithContent = SectionBase & {
  /**
   * A function that returns an element to be rendered as the content of the section.
   */
  renderContent: () => JSX.Element;
};

type SectionWithSubSections = SectionBase & {
  /**
   * The orientation of the sub sections.
   *
   * Defaults to "horizontal".
   */
  subSectionOrientation?: ZUIOrientation;

  /**
   * A list of sub sections.
   */
  subSections: SubSectionType[];
};

type SectionWithChildren = SectionWithContent | SectionWithSubSections;

type SectionWithFullWidthHeaderContent = SectionWithChildren & {
  /**
   * A function that returns a component to be rendered in full width next to the title of the section.
   */
  renderFullWidthHeaderContent: () => JSX.Element;
};

type SectionWithRightHeaderContent = SectionWithChildren & {
  /**
   * A number that renders to the right of the title
   */
  dataPoint?: number;

  /**
   * A  functiont that returns a component to be rendered in the top right side of the header.
   */
  renderRightHeaderContent?: () => JSX.Element;
};

type SectionProps =
  | SectionWithChildren
  | SectionWithFullWidthHeaderContent
  | SectionWithRightHeaderContent;

const isSubSectionWithFullWidthHeaderContent = (
  subSection: SubSectionType
): subSection is SubSectionWithFullWidthHeaderContent => {
  return 'renderFullWidthHeaderContent' in subSection;
};

const isSubSectionWithRightHeaderContent = (
  subSection: SubSectionType
): subSection is SubSectionWithRightHeaderContent => {
  return 'renderRightHeaderContent' in subSection;
};

const isSectionWithContent = (
  section: SectionProps
): section is SectionWithContent => {
  return 'renderContent' in section;
};

const isSectionWithSubSections = (
  section: SectionProps
): section is SectionWithSubSections => {
  return 'subSections' in section;
};

const isSectionWithFullWidthHeaderContent = (
  section: SectionProps
): section is SectionWithFullWidthHeaderContent => {
  return 'renderFullWidthHeaderContent' in section;
};

const isSectionWithRightHeaderContent = (
  section: SectionProps
): section is SectionWithRightHeaderContent => {
  return 'renderRightHeaderContent' in section || 'dataPoint' in section;
};

const SubSection: FC<{ subSection: SubSectionType }> = ({ subSection }) => {
  const hasRightHeaderContent = isSubSectionWithRightHeaderContent(subSection);
  const hasFullWidthHeaderContent =
    isSubSectionWithFullWidthHeaderContent(subSection);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: subSection.subtitle ? '1rem' : '0.75rem',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '1.875rem',
            justifyContent: hasRightHeaderContent ? 'space-between' : '',
          }}
        >
          <Typography
            sx={{
              flex: hasFullWidthHeaderContent ? 1 : '',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant="headingSm"
          >
            {subSection.title}
          </Typography>
          {hasFullWidthHeaderContent && (
            <Box sx={{ flex: 2 }}>
              {subSection.renderFullWidthHeaderContent()}
            </Box>
          )}
          {hasRightHeaderContent && (
            <Box sx={{ paddingLeft: '0.25rem' }}>
              {subSection.renderRightHeaderContent()}
            </Box>
          )}
        </Box>
        {subSection.subtitle && (
          <Typography color="secondary" variant="labelMdRegular">
            {subSection.subtitle}
          </Typography>
        )}
      </Box>
      <ZUIDivider flexItem />
      <Box sx={{ paddingTop: '1rem' }}>{subSection.renderContent()}</Box>
    </Box>
  );
};

const ZUISection: FC<SectionProps> = (props) => {
  const { title, subtitle, fullHeight = false, borders = true } = props;

  const hasFullWidthHeaderContent = isSectionWithFullWidthHeaderContent(props);
  const hasRightHeaderContent = isSectionWithRightHeaderContent(props);
  const hasSubSections = isSectionWithSubSections(props);
  const hasContent = isSectionWithContent(props);
  const hasVerticalSubSections =
    hasSubSections && props.subSectionOrientation == 'vertical';

  const showVerticalDivider =
    (hasRightHeaderContent && !!props.dataPoint) || hasFullWidthHeaderContent;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.grey[800]
            : theme.palette.common.white,
        border: borders ? `0.063rem solid ${theme.palette.dividers.main}` : '',
        borderRadius: borders ? '0.25rem' : '',
        display: 'flex',
        flexDirection: 'column',
        height: fullHeight ? '100%' : 'auto',
        padding: !hasSubSections ? '1.25rem' : '',
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          paddingBottom: '1rem',
          paddingTop: hasSubSections ? '1.25rem' : '',
          paddingX: hasSubSections ? '1.25rem' : '',
          width: '100%',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '1.463rem',
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              height: '100%',
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                flex: hasFullWidthHeaderContent ? 1 : '',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              variant="headingMd"
            >
              {title}
            </Typography>
          </Box>
          {showVerticalDivider && (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexShrink: 0,
                height: '100%',
                paddingX: '0.75rem',
              }}
            >
              <ZUIDivider flexItem orientation="vertical" />
            </Box>
          )}
          {hasRightHeaderContent && props.dataPoint && (
            <Typography
              sx={(theme) => ({
                color: theme.palette.data.main,
                flexShrink: 0,
                paddingRight: '0.5rem',
              })}
              variant="headingMd"
            >
              {props.dataPoint}
            </Typography>
          )}
          {hasRightHeaderContent && props.renderRightHeaderContent && (
            <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                flexShrink: 0,
                justifyContent: 'flex-end',
                paddingLeft: '0.5rem',
              }}
            >
              {props.renderRightHeaderContent()}
            </Box>
          )}
          {hasFullWidthHeaderContent && (
            <Box sx={{ flexGrow: 2, flexShrink: 0, minWidth: '50%' }}>
              {props.renderFullWidthHeaderContent()}
            </Box>
          )}
        </Box>
        {subtitle && (
          <Typography
            sx={(theme) => ({
              color: theme.palette.text.secondary,
            })}
            variant="headingSm"
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {hasContent && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: fullHeight ? '100%' : '',
            width: '100%',
          }}
        >
          <ZUIDivider />
          {props.renderContent()}
        </Box>
      )}
      {hasSubSections && (
        <>
          <ZUIDivider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: hasVerticalSubSections ? 'column' : 'row',
            }}
          >
            {props.subSections.map((subSection, index) => (
              <Box
                key={`subSection-${subSection.title}`}
                sx={{
                  display: 'flex',
                  flexDirection: hasVerticalSubSections ? 'column' : 'row',
                  width: hasVerticalSubSections
                    ? 'inherit'
                    : `${100 / props.subSections.length}%`,
                }}
              >
                <SubSection subSection={subSection} />
                {index != props.subSections.length - 1 && (
                  <ZUIDivider
                    flexItem
                    orientation={
                      hasVerticalSubSections ? 'horizontal' : 'vertical'
                    }
                  />
                )}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ZUISection;
