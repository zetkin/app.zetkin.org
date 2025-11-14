import { Metadata } from 'next';
import { headers } from 'next/headers';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import { ZetkinOrganization } from './types/zetkin';

const generateMetaDescription = (longText: string, maxLength = 160): string => {
  if (!longText) {
    return '';
  }

  const text = longText.replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) {
    return text;
  }

  // Truncate without cutting mid-word
  let truncated = text.slice(0, maxLength);

  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) {
    truncated = truncated.slice(0, lastSpace);
  }

  return truncated + '…';
};

export const getSeoTags = (
  title: string,
  description: string,
  canonicalPath: string,
  keywords?: string[],
  titleLengthCap = 60,
  descriptionLengthCap = 160
): Metadata => {
  const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
  const host = process.env.ZETKIN_APP_HOST || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  title = generateMetaDescription(title, titleLengthCap);
  description = generateMetaDescription(description, descriptionLengthCap);

  return {
    alternates: { canonical: baseUrl + canonicalPath },
    description,
    icons: [{ url: '/logo-zetkin.png' }],
    keywords: keywords,
    metadataBase: new URL(baseUrl),
    openGraph: {
      description,
      siteName: title,
      title: title,
      type: 'website',
    },
    robots: { follow: true, index: true },
    title: title,
    twitter: {
      card: 'summary',
      description,
      title,
    },
  };
};

export const getOrganizationOpenGraphTags = (
  org: ZetkinOrganization
): OpenGraph => {
  const regionNames = new Intl.DisplayNames(
    [headers().get('accept-language')?.split('-')[0] || 'en'],
    { type: 'region' }
  );
  let countryName = org.country;
  try {
    countryName = regionNames.of(org.country) ?? org.country;
  } catch (e) {
    /* ignored */
  }

  return {
    countryName: countryName,
    emails: org.email ? [org.email] : undefined,
    images: org.avatar_file ? [org.avatar_file.url] : undefined,
    locale: org.lang ? `${org.lang}_${org.country}` : `en_${org.country}`,
  };
};
