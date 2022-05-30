import { mockObject } from 'utils/testing/mocks';
import { ZetkinFile } from 'types/zetkin';

const file: ZetkinFile = {
  id: 1,
  mime_type: 'image/jpeg',
  organization: {
    id: 1,
    title: 'KPD',
  },
  original_name: 'myfile.jpg',
  uploaded: '1857-07-05T13:37:00.000',
  url: 'http://files.dev.zetkin.org/myfile.jpg',
};

const mockFile = (overrides?: Partial<ZetkinFile>): ZetkinFile => {
  return mockObject(file, overrides);
};

export default mockFile;
