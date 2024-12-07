import { ImportPreview, PersonImport } from './types';

type TransformFunction = (k: string) => string;

const transform: TransformFunction = (k) => (k === 'member_id' ? 'ext_id' : k);

const objectRecursiveKeyMap = (obj: object, fn: TransformFunction) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const getValue = (v: unknown): unknown =>
        typeof v === 'object' && v !== null ? objectRecursiveKeyMap(v, fn) : v;
      return [
        fn(key),
        Array.isArray(value)
          ? value.map((val) => getValue(val))
          : getValue(value),
      ];
    })
  );

const remapFields = (importRes: ImportPreview | PersonImport) =>
  objectRecursiveKeyMap(importRes, transform);

export default remapFields;
