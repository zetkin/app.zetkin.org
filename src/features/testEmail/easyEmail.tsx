//import React from 'react';
import { AdvancedType, BasicType, BlockManager } from 'easy-email-core';
import {
  EmailEditor,
  EmailEditorProvider,
  IEmailTemplate,
  useBlock,
  BlockAvatarWrapper,
  useFocusIdx,
} from 'easy-email-editor';
import 'easy-email-editor/lib/style.css';
import { ExtensionProps, StandardLayout } from 'easy-email-extensions';
import { useWindowSize } from 'react-use';
import template1 from './template.js';

import 'easy-email-extensions/lib/style.css';

// theme, If you need to change the theme, you can make a duplicate in https://arco.design/themes/design/1799/setting/base/Color
import '@arco-themes/react-zetkin/css/arco.css';
//import '@arco-themes/react-easy-email-theme/css/arco.css';
import { useEffect, useMemo, useState } from 'react';
import { Config } from 'final-form';
import { Box } from '@mui/system';

const defaultCategories: ExtensionProps['categories'] = [
  {
    label: 'Zetkin Content',
    active: true,
    blocks: [
      {
        type: AdvancedType.TEXT,
      },
      {
        type: AdvancedType.IMAGE,
        payload: { attributes: { padding: '0px 0px 0px 0px' } },
      },
      {
        type: AdvancedType.BUTTON,
      },
      {
        type: AdvancedType.SOCIAL,
      },
      {
        type: AdvancedType.DIVIDER,
      },
      {
        type: AdvancedType.SPACER,
      },
      {
        type: AdvancedType.HERO,
      },
      {
        type: AdvancedType.WRAPPER,
      },
      {
        type: AdvancedType.SECTION,
      },
      {
        type: AdvancedType.CAROUSEL,
      },
    ],
  },
  {
    label: 'Layout',
    active: true,
    displayType: 'column',
    blocks: [
      {
        title: '2 columns',
        payload: [
          ['50%', '50%'],
          ['33%', '67%'],
          ['67%', '33%'],
          ['25%', '75%'],
          ['75%', '25%'],
        ],
      },
      {
        title: '3 columns',
        payload: [
          ['33.33%', '33.33%', '33.33%'],
          ['25%', '25%', '50%'],
          ['50%', '25%', '25%'],
        ],
      },
      {
        title: '4 columns',
        payload: [['25%', '25%', '25%', '25%']],
      },
    ],
  },
];

const pageBlock = BlockManager.getBlockByType(BasicType.PAGE)!;

const EasyEmail = () => {
  const { width } = useWindowSize();

  const smallScene = width < 1400;

  const [template, setTemplate] = useState<IEmailTemplate['content']>(
    pageBlock.create({
      data: {
        value: {
          width: '200px',
        },
      },
    })
  );

  const initialValues = {
    subject: 'Welcome to Easy-email',
    subTitle: 'Nice to meet you!',
    content: template,
  };

  console.log('here', initialValues.content);

  return (
    <EmailEditorProvider
      data={initialValues}
      height={'calc(100vh - 72px)'}
      autoComplete
      dashed={true}
    >
      {({ values }) => {
        return (
          <StandardLayout
            compact={!smallScene}
            showSourceCode={true}
            categories={defaultCategories}
          >
            <EmailEditor />
          </StandardLayout>
        );
      }}
    </EmailEditorProvider>
  );
};

export default EasyEmail;
