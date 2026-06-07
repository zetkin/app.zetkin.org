import Iron from '@hapi/iron';
import { getMessages } from 'next-intl/server';
import { NextResponse } from 'next/server';

import submitJoinForm from 'features/joinForms/actions/submitEmbeddedJoinForm';
import { EmbeddedJoinFormData } from 'features/joinForms/types';
import { CUSTOM_FIELD_TYPE } from 'utils/types/zetkin';

type Props = {
  params: {
    formData: string;
    locale: string;
  };
};

type JoinFormMessages = {
  feat: {
    joinForms: {
      embedding: {
        formSubmitted: string;
        submitButton: string;
      };
    };
  };
  glob: {
    genderOptions: Record<string, string>;
    personFields: Record<string, string>;
  };
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function joinFormDataFromParam(formData: string) {
  const formDataStr = decodeURIComponent(formData);
  return {
    formDataObj: Iron.unseal(
      formDataStr,
      process.env.SESSION_PASSWORD || '',
      Iron.defaults
    ) as Promise<EmbeddedJoinFormData>,
    formDataStr,
  };
}

function renderStyles(stylesheet: string | null) {
  if (stylesheet) {
    return `<style>@import url(${escapeHtml(stylesheet)});</style>`;
  }

  return `<style>
    body {
      padding: 0.5rem;
    }

    .zetkin-joinform__field {
      margin-bottom: 1rem;
    }

    .zetkin-joinform__field input[type="text"], .zetkin-joinform__field select {
      width: 100%;
      max-width: 600px;
      padding: 0.3rem;
      font-size: 1.5rem;
    }

    .zetkin-joinform__submit-button {
      border-width: 0;
      font-size: 1.5rem;
      background-color: black;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.2rem;
    }
  </style>`;
}

function renderField(
  field: EmbeddedJoinFormData['fields'][number],
  messages: JoinFormMessages
) {
  const fieldId = `joinform-${field.s}`;
  const isCustom = 'l' in field;
  const isEnum = isCustom && field.t == CUSTOM_FIELD_TYPE.ENUM && 'e' in field;
  const label = isCustom ? field.l : messages.glob.personFields[field.s];

  if (isEnum) {
    return `<div class="zetkin-joinform__field">
      <label for="${escapeHtml(fieldId)}">${escapeHtml(label)}</label><br />
      <select id="${escapeHtml(fieldId)}" name="${escapeHtml(field.s)}">
        ${field.e
          .map(
            (value) =>
              `<option value="${escapeHtml(value.key)}">${escapeHtml(
                value.key
              )}</option>`
          )
          .join('')}
      </select>
    </div>`;
  }

  if (field.s == 'gender') {
    const options = messages.glob.genderOptions;
    return `<div class="zetkin-joinform__field">
      <label for="${escapeHtml(fieldId)}">${escapeHtml(label)}</label>
      <div>
        <select id="${escapeHtml(fieldId)}" name="${escapeHtml(field.s)}">
          <option value="unspecified">${escapeHtml(options.unspecified)}</option>
          <option value="m">${escapeHtml(options.m)}</option>
          <option value="f">${escapeHtml(options.f)}</option>
          <option value="o">${escapeHtml(options.o)}</option>
        </select>
      </div>
    </div>`;
  }

  const required =
    field.s == 'first_name' || field.s == 'last_name' ? ' required' : '';

  return `<div class="zetkin-joinform__field">
    <label for="${escapeHtml(fieldId)}">${escapeHtml(label)}</label>
    <div>
      <input id="${escapeHtml(fieldId)}" name="${escapeHtml(
        field.s
      )}"${required} type="text" />
    </div>
  </div>`;
}

function htmlResponse(body: string, status = 200) {
  return new NextResponse(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
    status,
  });
}

export async function GET(request: Request, { params }: Props) {
  try {
    const url = new URL(request.url);
    const { formDataObj, formDataStr } = joinFormDataFromParam(params.formData);
    const messages = (await getMessages({
      locale: params.locale,
    })) as JoinFormMessages;
    const data = await formDataObj;
    const fields = data.fields
      .map((field) => renderField(field, messages))
      .join('');
    const submitButton = messages.feat.joinForms.embedding.submitButton;

    return htmlResponse(`<!doctype html>
<html lang="${escapeHtml(params.locale)}">
  <body>
    <form method="post">
      <input name="__joinFormData" type="hidden" value="${escapeHtml(
        formDataStr
      )}" />
      ${fields}
      <button class="zetkin-joinform__submit-button" type="submit">${escapeHtml(
        submitButton
      )}</button>
    </form>
    ${renderStyles(url.searchParams.get('stylesheet'))}
  </body>
</html>`);
  } catch {
    return htmlResponse('', 404);
  }
}

export async function POST(request: Request, { params }: Props) {
  const formData = await request.formData();
  await submitJoinForm('editing', formData);

  const url = new URL(request.url);
  const messages = (await getMessages({
    locale: params.locale,
  })) as JoinFormMessages;
  const redirectUrl = url.searchParams.get('redirect');
  const redirectScript = redirectUrl
    ? `<script>window.parent.location.href = ${JSON.stringify(
        redirectUrl
      )};</script>`
    : '';

  return htmlResponse(`<!doctype html>
<html lang="${escapeHtml(params.locale)}">
  <body>
    <h2>${escapeHtml(messages.feat.joinForms.embedding.formSubmitted)}</h2>
    ${redirectScript}
  </body>
</html>`);
}
