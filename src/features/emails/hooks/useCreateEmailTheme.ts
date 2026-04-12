import { useDispatch } from 'react-redux';

import { EmailTheme } from 'features/emails/types';
import { useApiClient } from 'core/hooks';
import { themeCreate, themeCreated } from 'features/emails/store';

interface UseCreateEmailThemeReturn {
  createEmailTheme: () => Promise<EmailTheme>;
}

const defaultBlockAttributes = {
  button: {},
  image: {},
};

const defaultFrameMjml = {
  attributes: {},
  children: [
    {
      attributes: {},
      children: [],
      tagName: 'mj-section',
    },
    {
      attributes: {},
      children: [
        {
          attributes: {},
          children: [
            {
              attributes: {},
              tagName: 'placeholder',
            },
          ],
          tagName: 'mj-column',
        },
      ],
      tagName: 'mj-section',
    },
    {
      attributes: {},
      children: [
        {
          attributes: {
            align: 'center',
            color: '#a1a1a1',
            'font-size': '12px',
          },
          content:
            'To unsubscribe from emails, click <a href="{{unsub_org_url}}">here</a>.',
          tagName: 'mj-text',
        },
      ],
      tagName: 'mj-section',
    },
  ],
  tagName: 'mj-wrapper',
};

const defaultCss = "h1 {}\nh2 {}\nh3 {}\na:link {}\na:visited {}\na:hover {}\np {}\np b {}";

export default function useCreateEmailTheme(
  orgId: number
): UseCreateEmailThemeReturn {
  const apiClient = useApiClient();
  const dispatch = useDispatch();

  const createEmailTheme = async () => {
    dispatch(themeCreate);
    const theme = await apiClient.post<EmailTheme>(
      `/api/orgs/${orgId}/email_themes`,
      {
        block_attributes: defaultBlockAttributes,
        css: defaultCss,
        frame_mjml: defaultFrameMjml
      }
    );
    dispatch(themeCreated([theme, orgId]));
    return theme;
  };

  return { createEmailTheme };
}
