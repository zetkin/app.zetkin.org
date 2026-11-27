'use server';

import { ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import { getSeoTags } from 'utils/seoTags';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-requested-path') || '';

  return getSeoTags(
    `Users | ${process.env.HOME_TITLE || 'Zetkin'}`,
    '',
    pathname
  );
}

type Props = {
  children: ReactNode;
};

const Layout = async ({ children }: Props) => children;
export default Layout;
