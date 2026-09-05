import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

import getServerMessages from 'core/i18n/server';
import messageIds from 'features/canvass/l10n/messageIds';
import { decodeFloorShare } from 'features/canvass/utils/floorShare';
import { getBrowserLanguage } from 'utils/locale';
import FloorShareTable from './FloorShareTable';

type Props = {
  searchParams: {
    d?: string;
  };
};

export default async function Page({ searchParams }: Props) {
  const share = searchParams.d ? decodeFloorShare(searchParams.d) : null;

  if (!share) {
    notFound();
  }

  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);

  return (
    <main style={{ margin: '0 auto', maxWidth: 900, padding: '32px 16px' }}>
      <h1 style={{ marginBottom: 24 }}>
        {messages.households.single.subtitle({ floorNumber: share.floor })}
      </h1>
      <p>{messages.households.single.shareInstructions()}</p>
      <FloorShareTable
        recentlyVisitedLabel={messages.households.single.recentlyVisited()}
        share={share}
      />
    </main>
  );
}
