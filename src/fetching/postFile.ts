import { defaultFetch } from '.';
import { FileObject } from 'material-ui-dropzone';
import { ZetkinFile } from '../types/zetkin';

export default function postEvent(orgId: string, fetch = defaultFetch) {
  return async (file: FileObject): Promise<ZetkinFile> => {
    const url = `/orgs/${orgId}/files`;
    const formData = new  FormData();
    formData.append("file", file);
    const res = await fetch(url, {
      body: formData,
      method: 'POST',
    });
    const resData = await res.json();
    return resData;
  };
}
