import ZetkinUploadDialog from 'components/ZetkinUploadDialog';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    component: ZetkinUploadDialog,
    title: "ZetkinUploadDialog",
} as ComponentMeta<typeof ZetkinUploadDialog>

const Template : ComponentStory<typeof ZetkinUploadDialog> = (args) => <ZetkinUploadDialog { ...args }  />

export const FileUpload = Template.bind({});
FileUpload.args = {
    accept: ['image/*'],
    open: true,
    title: 'Image upload',
}
