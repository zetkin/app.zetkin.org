import mjml2html from 'mjml';
import { BodyComponent, MJMLJsonObject, registerComponent } from 'mjml-core';

import IApiClient from 'core/api/client/IApiClient';
import { FrameBase, HtmlFrame } from 'features/emails/types';
import { Params, paramsSchema, Result } from './client';

class Placeholder extends BodyComponent {
  static endingTag = true;

  render() {
    return '<div id="ClientOnlyEditor-container"></div>';
  }
}

function mjmlToHtml(mjml: MJMLJsonObject) {
  registerComponent(Placeholder);
  return mjml2html(mjml);
}

export const getEmailRouteDef = {
  handler: handle,
  name: 'getFrame',
  schema: paramsSchema,
};

type MjmlFrame = FrameBase & { frame_mjml: MJMLJsonObject };

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { frameId, orgId } = params;

  /*
  const frame = await apiClient.get<MjmlFrame>(
    `/api/orgs/${orgId}/frames/${frameId}`
  );
  */

  const htmlFrame: HtmlFrame = {
    blockAttributes: {}, // TODO: Use frame.blockAttributes
    css: 'body { background-color: green; }',
    frameHtml: mjmlToHtml({
      attributes: {},
      children: [
        {
          attributes: {},
          children: [
            {
              attributes: {},
              content: 'body { background-color: green; }',
              tagName: 'mj-style',
            },
          ],
          tagName: 'mj-head',
        },
        {
          attributes: {},
          children: [
            // TODO: Replace this with frame.frame_mjml
            {
              attributes: {
                'background-color': 'white',
              },
              children: [
                {
                  attributes: {},
                  children: [
                    {
                      attributes: {},
                      children: [
                        {
                          attributes: {
                            src: 'https://mjml.io/assets/img/logo-small.png',
                          },
                          tagName: 'mj-image',
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
              ],
              tagName: 'mj-wrapper',
            },
          ],
          tagName: 'mj-body',
        },
      ],
      tagName: 'mjml',
    }).html,
    id: 1, // TODO: Use frame.id
  };

  return htmlFrame;
}
