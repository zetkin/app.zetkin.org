import { HTMLProps, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';

import ZUIPreviewableInput, { ZUIPreviewableMode } from '.';

export default {
  component: ZUIPreviewableInput,
  title: 'Other/ZUIPreviewableInput',
} as Meta<typeof ZUIPreviewableInput>;

const Template: StoryFn<typeof ZUIPreviewableInput> = (args) => {
  const [value, setValue] = useState(args.value);
  const [otherValue, setOtherValue] = useState(args.value);
  const [mode, setMode] = useState<ZUIPreviewableMode>(
    ZUIPreviewableMode.PREVIEW
  );

  return (
    <>
      <ZUIPreviewableInput
        mode={mode}
        onSwitchMode={(newMode) => setMode(newMode)}
        renderInput={(props: HTMLProps<HTMLInputElement>) => (
          <input
            onChange={(ev) => setValue(ev.target.value)}
            value={value}
            {...props}
          />
        )}
        value={value}
      />
      <ZUIPreviewableInput
        mode={mode}
        onSwitchMode={(newMode) => setMode(newMode)}
        renderInput={(props: HTMLProps<HTMLInputElement>) => (
          <input
            onChange={(ev) => setOtherValue(ev.target.value)}
            value={otherValue}
            {...props}
          />
        )}
        value={otherValue}
      />
      {mode == ZUIPreviewableMode.EDITABLE && (
        <button onClick={() => setMode(ZUIPreviewableMode.PREVIEW)}>
          Save
        </button>
      )}
    </>
  );
};

export const basic = Template.bind({});
basic.args = {
  value: 'foo',
};
