import messageIds from 'features/organizations/l10n/messageIds';
import NextLink from 'next/link';
import { useMessages } from 'core/i18n';
import useOrganizations from '../hooks/useOrganizations';
import { ZetkinMembership } from 'utils/types/zetkin';

import ZUIFuture from 'zui/ZUIFuture';
import { Avatar, Box, Link, List, ListItem, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
const EditorJsDemo = dynamic(import('features/testEmail/editorjs'), {
  ssr: false,
});
const EasyEmail = dynamic(import('features/testEmail/easyEmail'), {
  ssr: false,
});
const ReactEmailEditor = dynamic(
  import('features/testEmail/reactEditorEmail'),
  {
    ssr: false,
  }
);

const OrganizationsList = () => {
  const messages = useMessages(messageIds);
  const organizations = useOrganizations();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('window.innerHeight', window);
    }
  }, []);

  return (
    <>
      <Typography>{'EditorJsDemo'}</Typography>
      <EditorJsDemo />
    </>
  );
};

export default OrganizationsList;
