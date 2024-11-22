'use client';

import { FC, useEffect } from 'react';
// Type definitions for the new experimental stuff like useFormState in
// react-dom are lagging behind the implementation so it's necessary to silence
// the TypeScript error about the lack of type definitions here in order to
// import this.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useFormState } from 'react-dom';

import { EmbeddedJoinFormData, EmbeddedJoinFormStatus } from '../types';
import { Msg, useMessages } from 'core/i18n';
import globalMessageIds from 'core/i18n/globalMessageIds';
import submitJoinForm from '../actions/submitEmbeddedJoinForm';
import messageIds from '../l10n/messageIds';

type Props = {
  encrypted: string;
  fields: EmbeddedJoinFormData['fields'];
};

const EmbeddedJoinForm: FC<Props> = ({ encrypted, fields }) => {
  const globalMessages = useMessages(globalMessageIds);

  const [status, action] = useFormState<EmbeddedJoinFormStatus>(
    submitJoinForm,
    'editing'
  );

  // For some reason, the version of react (or @types/react) that we use
  // does not understand server action functions as properties to the form,
  // but upgrading to the most recent versions causes type-related problems
  // with react-intl (and perhaps other libraries). So this workaround
  // allows us to pass the action to the form by pretending it's a string.
  const actionWhileTrickingTypescript = action as unknown as string;

  useEffect(() => {
    if (status == 'submitted') {
      const url = new URL(location.toString());
      const query = url.searchParams;
      const redirectUrl = query.get('redirect');

      if (redirectUrl) {
        const win = window.parent || window;
        win.location.href = redirectUrl;
      }
    }
  }, [status]);

  return (
    <div>
      {status == 'editing' && (
        <form action={actionWhileTrickingTypescript}>
          <input name="__joinFormData" type="hidden" value={encrypted} />
          {fields.map((field) => {
            const isCustom = 'l' in field;
            const label = isCustom
              ? field.l
              : globalMessages.personFields[field.s]();

            return (
              <div key={field.s}>
                <label>
                  {label}
                  <div>
                    {field.s != 'gender' && <input name={field.s} />}
                    {field.s == 'gender' && (
                      <select name={field.s}>
                        <option value="unspecified">
                          {globalMessages.genderOptions.unspecified()}
                        </option>
                        <option value="m">
                          {globalMessages.genderOptions.m()}
                        </option>
                        <option value="f">
                          {globalMessages.genderOptions.f()}
                        </option>
                        <option value="o">
                          {globalMessages.genderOptions.o()}
                        </option>
                      </select>
                    )}
                  </div>
                </label>
              </div>
            );
          })}
          <button type="submit">
            <Msg id={messageIds.embedding.submitButton} />
          </button>
        </form>
      )}
      {status == 'submitted' && (
        <h2>
          <Msg id={messageIds.embedding.formSubmitted} />
        </h2>
      )}
    </div>
  );
};

export default EmbeddedJoinForm;
