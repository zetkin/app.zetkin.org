import ZUICollapse from '.';
import { Meta, StoryFn } from '@storybook/react';

export default {
  component: ZUICollapse,
  title: 'Atoms/ZUICollapse',
} as Meta<typeof ZUICollapse>;

const Template: StoryFn<typeof ZUICollapse> = (args) => (
  <ZUICollapse collapsedSize={args.collapsedSize}>{args.children}</ZUICollapse>
);

export const basic = Template.bind({});
basic.args = {
  children: (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed
      venenatis urna. Maecenas non nibh eu diam bibendum egestas id bibendum
      mauris. Duis lacinia neque eu ligula rhoncus vehicula. Duis aliquet libero
      ac condimentum laoreet.
      <br />
      <br />
      In porttitor egestas arcu, facilisis elementum odio pharetra in. Phasellus
      consequat tristique mauris, sit amet luctus augue aliquet sit amet.
      Curabitur id interdum lorem. Suspendisse at tellus tincidunt, rhoncus sem
      non, dictum libero. Nam non tortor sit amet nibh ornare cursus nec in ex.
      Nam scelerisque, odio nec ornare consequat, augue elit malesuada libero,
      malesuada elementum urna erat tincidunt urna.
      <br />
      <br />
      Nullam dignissim ex nulla, in sagittis nunc porta nec. Aenean in elit
      iaculis, ornare arcu non, fermentum mauris. Nulla suscipit tincidunt nisl.
      Curabitur et malesuada elit. Aliquam et augue lacus. Quisque aliquam
      lectus a tristique porta. Donec id arcu mauris. Mauris eget mi faucibus,
      congue metus eu, rutrum lorem. Proin neque tortor, facilisis quis rutrum
      et, semper vitae orci. Aliquam id pulvinar nibh. Duis in cursus purus.
      <br />
      <br />
      Nunc tempus sem non diam suscipit, at finibus lectus consectetur. Fusce
      maximus ut libero sit amet venenatis. Praesent iaculis commodo tellus, a
      pharetra sem venenatis fermentum. Nullam at fermentum arcu, ac malesuada
      turpis. In condimentum nunc id varius sagittis. Vestibulum ante ipsum
      primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer
      eu leo a ipsum tempor congue id tempor felis. Phasellus vitae mi ipsum.
      <br />
      <br />
      Nunc urna ipsum, pharetra sit amet ipsum eget, venenatis pulvinar lorem.
      Sed molestie sapien lacus, eu laoreet lorem tempor sed. Mauris iaculis
      eget nisl placerat gravida.
    </p>
  ),
  collapsedSize: 100,
};

export const shortText = Template.bind({});
shortText.args = {
  children: (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed
      venenatis urna. Maecenas non nibh eu diam bibendum egestas id bibendum
      mauris. Duis lacinia neque eu ligula rhoncus vehicula. Duis aliquet libero
      ac condimentum laoreet.
    </p>
  ),
  collapsedSize: 100,
};
