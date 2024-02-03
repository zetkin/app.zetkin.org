import { mockObject } from 'utils/testing/mocks';
import mockOrganization from './mockOrganization';
import { ZetkinFile } from 'utils/types/zetkin';

const file: ZetkinFile = {
  id: 1,
  mime_type: 'image/jpeg',
  organization: mockOrganization(),
  original_name: 'myfile.jpg',
  uploaded: '1857-07-05T13:37:00.000',
  url: 'http://files.dev.zetkin.org/myfile.jpg',
};

const mockFile = (overrides?: Partial<ZetkinFile>): ZetkinFile => {
  return mockObject(file, overrides);
};

export default mockFile;
