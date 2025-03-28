import { Box, Typography } from '@mui/material';
import { FC, Fragment } from 'react';

import ZUIDivider from '../ZUIDivider';

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
  renderFullWidthHeaderContent: () => JSX.Element;
};

type SubSectionWithRightHeaderContent = SubSectionBase & {
  renderRightHeaderContent: () => JSX.Element;
};

type SubSectionType =
  | SubSectionBase
  | SubSectionWithFullWidthHeaderContent
  | SubSectionWithRightHeaderContent;

type SectionTitles = {
  /**
   * The subtitle of the section.
   */
  subtitle?: string;

  /**
   * The title of the section.
   */
  title: string;
};

type SectionWithContent = SectionTitles & {
  renderContent: () => JSX.Element;
};

type SectionWithSubSections = SectionTitles & {
  subSections: SubSectionType[];
};

type SectionBase = SectionWithContent | SectionWithSubSections;

type SectionWithFullWidthHeaderContent = SectionBase & {
  /**
   * A function that returns a component to be rendered in full width next to the title of the section.
   */
  renderFullWidthHeaderContent: () => JSX.Element;
};

type SectionWithRightHeaderContent = SectionBase & {
  /**
   * A number that renders to the right of the title
   */
  dataPoint?: number;

  /**
   * A  functiont that returns a component to be rendered in the top right side of the header.
   */
  renderRightHeaderContent?: () => JSX.Element;
};

type Section =
  | SectionBase
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
  section: Section
): section is SectionWithContent => {
  return 'renderContent' in section;
};

const isSectionWithSubSections = (
  section: Section
): section is SectionWithSubSections => {
  return 'subSections' in section;
};

const isSectionWithFullWidthHeaderContent = (
  section: Section
): section is SectionWithFullWidthHeaderContent => {
  return 'renderFullWidthHeaderContent' in section;
};

const isSectionWithRightHeaderContent = (
  section: Section
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

const ZUISection: FC<{ section: Section }> = ({ section }) => {
  const { title, subtitle } = section;

  const hasFullWidthHeaderContent =
    isSectionWithFullWidthHeaderContent(section);
  const hasRightHeaderContent = isSectionWithRightHeaderContent(section);
  const hasSubSections = isSectionWithSubSections(section);
  const hasContent = isSectionWithContent(section);

  const showVerticalDivider =
    (hasRightHeaderContent && !!section.dataPoint) || hasFullWidthHeaderContent;

  return (
    <Box
      sx={(theme) => ({
        border: `0.063rem solid ${theme.palette.dividers.main}`,
        borderRadius: '0.25rem',
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
        }}
      >
        <Box
          sx={{ alignItems: 'center', display: 'flex', minHeight: '1.463rem' }}
        >
          <Typography variant="headingMd">{title}</Typography>
          {showVerticalDivider && (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                minHeight: 'inherit',
                paddingX: '0.75rem',
              }}
            >
              <ZUIDivider flexItem orientation="vertical" />
            </Box>
          )}
          {hasRightHeaderContent && section.dataPoint && (
            <Typography
              sx={(theme) => ({ color: theme.palette.data.main })}
              variant="headingMd"
            >
              {section.dataPoint}
            </Typography>
          )}
          {hasRightHeaderContent && section.renderRightHeaderContent && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              {section.renderRightHeaderContent()}
            </Box>
          )}
          {hasFullWidthHeaderContent && (
            <Box sx={{ width: '100%' }}>
              {section.renderFullWidthHeaderContent()}
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
            width: '100%',
          }}
        >
          <ZUIDivider />
          {section.renderContent()}
        </Box>
      )}
      {hasSubSections && (
        <>
          <ZUIDivider />
          <Box sx={{ display: 'flex' }}>
            {section.subSections.map((subSection, index) => (
              <Box
                key={`subSection-${subSection.title}`}
                sx={{
                  display: 'flex',
                  width: `${100 / section.subSections.length}%`,
                }}
              >
                <SubSection subSection={subSection} />
                {index != section.subSections.length - 1 && (
                  <ZUIDivider flexItem orientation="vertical" />
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
