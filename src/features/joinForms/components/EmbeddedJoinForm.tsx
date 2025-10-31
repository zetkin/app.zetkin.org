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
import submitJoinForm from '../actions/submitEmbeddedJoinForm';
import {
  CUSTOM_FIELD_TYPE,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';

export type Props = {
  encrypted: string;
  fields: EmbeddedJoinFormData['fields'];
  messages: {
    embedding: {
      formSubmitted: string;
      submitButton: string;
    };
    genderOptions: {
      f: string;
      m: string;
      o: string;
      unspecified: string;
    };
    personFields: Record<keyof ZetkinPersonNativeFields, string>;
  };
};

const EmbeddedJoinForm: FC<Props> = ({ encrypted, fields, messages }) => {
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
            const isEnum =
              isCustom && field.t == CUSTOM_FIELD_TYPE.ENUM && 'e' in field;
            const label = isCustom ? field.l : messages.personFields[field.s];

            if (isEnum) {
              return (
                <div key={field.s} className="zetkin-joinform__field">
                  <label htmlFor={field.s}>{label}</label>
                  <br />
                  <select id={field.s} name={field.s}>
                    {field.e.map((v) => {
                      return (
                        <option key={v.key} value={v.key}>
                          {v.key}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            } else {
              return (
                <div key={field.s} className="zetkin-joinform__field">
                  <label>
                    {label}
                    <div>
                      {field.s != 'gender' && (
                        <input
                          name={field.s}
                          required={
                            field.s == 'first_name' || field.s == 'last_name'
                          }
                          type="text"
                        />
                      )}
                      {field.s == 'gender' && (
                        <select name={field.s}>
                          <option value="unspecified">
                            {messages.genderOptions.unspecified}
                          </option>
                          <option value="m">{messages.genderOptions.m}</option>
                          <option value="f">{messages.genderOptions.f}</option>
                          <option value="o">{messages.genderOptions.o}</option>
                        </select>
                      )}
                    </div>
                  </label>
                </div>
              );
            }
          })}
          <button className="zetkin-joinform__submit-button" type="submit">
            {messages.embedding.submitButton}
          </button>
        </form>
      )}
      {status == 'submitted' && <h2>{messages.embedding.formSubmitted}</h2>}
    </div>
  );
};

export default EmbeddedJoinForm;
