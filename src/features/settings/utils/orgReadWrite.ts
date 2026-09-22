import { ZetkinCustomField } from 'utils/types/zetkin';
import { AccessType } from '../types';

export function getOrgReadWrite(access: AccessType): {
  org_read: 'sameorg' | 'suborgs';
  org_write: 'sameorg' | 'suborgs';
} {
  if (access === AccessType.ONLY_THIS_ORG) {
    return {
      org_read: 'sameorg',
      org_write: 'sameorg',
    };
  } else if (access === AccessType.SUBORG_READ) {
    return {
      org_read: 'suborgs',
      org_write: 'sameorg',
    };
  } else {
    return {
      org_read: 'suborgs',
      org_write: 'suborgs',
    };
  }
}

export function getAccessType(field: ZetkinCustomField): AccessType {
  if (field.org_read === 'suborgs' && field.org_write === 'sameorg') {
    return AccessType.SUBORG_READ;
  } else if (field.org_read === 'suborgs' && field.org_write === 'suborgs') {
    return AccessType.SUBORG_READ_AND_WRITE;
  } else {
    return AccessType.ONLY_THIS_ORG;
  }
}
